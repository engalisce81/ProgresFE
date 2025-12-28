import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService, CreateUpdateCourseDto } from '@proxy/dev/acadmy/courses';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { SubjectService } from '@proxy/dev/acadmy/universites';

// تعريف الأنواع محلياً للتأكد من التزامن مع التابات
export enum CourseType { General = 0, Quiz = 1, Pdf = 2 }

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  subjects: LookupDto[] = [];
  
  // ملفات الرفع
  pdfFile: File | null = null;
  pdfFileName: string | null = null;
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  // إدارة التابات
  selectedTab: CourseType = CourseType.General;
  courseTypes = CourseType;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private subjectService: SubjectService,
    private router: Router,
    private uploadService: MediaItemService
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      subjectId: ['', Validators.required],
      youTubeVideoUrl: [""],
      driveVideoUrl:[""],
      isActive: [true],
      isLifetime: [false],
      durationInDays: [0],
      isPdf: [false],
      isQuiz: [false],
      showSubscriberCount: [true],
      infos: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  get infos(): FormArray {
    return this.courseForm.get('infos') as FormArray;
  }

  // منطق التبديل بين التابات
  selectTab(type: CourseType) {
    this.selectedTab = type;
    this.courseForm.patchValue({
      isPdf: type === CourseType.Pdf,
      isQuiz: type === CourseType.Quiz
    });
  }

  loadSubjects() {
    this.subjectService.getSubjectsWithCollegeList().subscribe(res => {
      this.subjects = res.items;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.logoFile = input.files[0];
    const reader = new FileReader();
    reader.onload = e => this.logoPreview = e.target?.result;
    reader.readAsDataURL(this.logoFile);
  }

  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.pdfFile = input.files[0];
    this.pdfFileName = this.pdfFile.name;
  }

  addInfo() {
    this.infos.push(this.fb.control('', Validators.required));
  }

  removeInfo(index: number) {
    if (this.infos.length > 1) this.infos.removeAt(index);
  }

  async submit() {
    if (this.courseForm.invalid) {
      alert('Please check required fields');
      return;
    }

    this.loading = true;
    try {
      let logoUrl = '';
      let pdfUrl = '';

      // رفع اللوجو
      if (this.logoFile) {
        const res = await this.uploadService.uploadImage(this.logoFile).toPromise();
        logoUrl = res.data;
      }

      // رفع الملف لو التابة PDF
      if (this.selectedTab === CourseType.Pdf && this.pdfFile) {
        const res = await this.uploadService.uploadImage(this.pdfFile).toPromise();
        pdfUrl = res.data;
      }

      const dto: CreateUpdateCourseDto = {
        ...this.courseForm.value,
        logoUrl,
        pdfUrl,
        isPdf: this.selectedTab === CourseType.Pdf,
        isQuiz: this.selectedTab === CourseType.Quiz,
        infos: this.infos.value.filter((i: string) => i.trim() !== '')
      };

      this.courseService.create(dto).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          this.loading = false;
          alert('Save Error: ' + err.message);
        }
      });

    } catch (error) {
      this.loading = false;
      alert('Upload Error: ' + error);
    }
  }
}