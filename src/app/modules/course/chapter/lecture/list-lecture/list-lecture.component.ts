import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LectureDto, LectureService, CreateUpdateLectureDto } from '@proxy/dev/acadmy/lectures';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { CommonModule } from '@angular/common';

interface ExtendedLectureDto extends LectureDto {
  showMenu?: boolean;
  showPdfs?: boolean;
}

@Component({
  selector: 'app-list-lecture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './list-lecture.component.html',
  styleUrl: './list-lecture.component.scss'
})
export class ListLectureComponent implements OnInit {
  lectures: ExtendedLectureDto[] = [];
  lectureForm!: FormGroup;
  
  loading = false;
  submitting = false;
  search = '';
  chapterId: string = '';

  // حالات التحكم في الواجهة (Form)
  showForm = false;
  isEditMode = false;
  selectedLectureId: string | null = null;
  
  // حالات التحكم في الحذف (Delete Modal)
  showDeleteConfirm = false;
  lectureToDelete: ExtendedLectureDto | null = null;

  // Pagination (اختياري حسب الـ HTML الخاص بك)
  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // رفع الملفات
  pdfFiles: File[] = [];
  existingPdfs: string[] = [];

  constructor(
    private lectureService: LectureService,
    private mediaItemService: MediaItemService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // جلب الـ ChapterId من الرابط
    this.chapterId = this.route.snapshot.paramMap.get('chapterId') || '';
    if (this.chapterId) {
      this.loadLectures();
    }
  }

  initForm() {
    this.lectureForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      youTubeVideoUrl: [""],
      driveVideoUrl:[""], 
      quizTime: [0, [Validators.required, Validators.min(0)]],
      quizTryCount: [0, [Validators.required, Validators.min(0)]],
      quizCount: [0, [Validators.required, Validators.min(0)]],
      successQuizRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isVisible: [true],
      isFree: [false],
      isRequiredQuiz:[false]
    });
  }

  loadLectures() {
    this.loading = true;
    this.lectureService.getList(this.pageIndex, this.pageSize, this.search, this.chapterId).subscribe({
      next: (res) => {
        this.lectures = res.items.map(l => ({ ...l, showMenu: false, showPdfs: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // --- وظائف الحذف (المعدلة لتناسب الـ Modal) ---
  
  confirmDelete(lecture: ExtendedLectureDto) {
    this.lectureToDelete = lecture;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.lectureToDelete = null;
  }

  deleteLecture() {
    if (!this.lectureToDelete) return;

    this.loading = true; // إظهار حالة تحميل أثناء الحذف
    this.lectureService.delete(this.lectureToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.lectureToDelete = null;
        this.loadLectures(); // إعادة تحميل القائمة
      },
      error: (err) => {
        this.loading = false;
        alert('حدث خطأ أثناء الحذف: ' + err.message);
      }
    });
  }

  // --- وظائف البحث والترقيم ---
  onSearchChange() {
    this.pageIndex = 1;
    this.loadLectures();
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadLectures();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  // --- وظائف الفورم (Inline CRUD) ---

  openCreateForm() {
    this.isEditMode = false;
    this.showForm = true;
    this.lectureForm.reset({ isVisible: true, isFree: false, quizTime:0, quizCount:0, quizTryCount:0, successQuizRate:0 });
    this.pdfFiles = [];
    this.existingPdfs = [];
  }

  openEditForm(lecture: ExtendedLectureDto) {
    this.isEditMode = true;
    this.selectedLectureId = lecture.id;
    this.showForm = true;
    this.lectureForm.patchValue(lecture);
    this.existingPdfs = [...(lecture.pdfUrls || [])];
    this.pdfFiles = [];
  }

  closeForm() {
    this.showForm = false;
    this.selectedLectureId = null;
  }

  onPdfSelected(event: any) {
    if (event.target.files) {
      this.pdfFiles.push(...Array.from(event.target.files as FileList));
    }
  }

  removeNewPdf(index: number) { this.pdfFiles.splice(index, 1); }
  removeExistingPdf(index: number) { this.existingPdfs.splice(index, 1); }

  submit() {
    if (this.lectureForm.invalid) return;
    this.submitting = true;

    if (this.pdfFiles.length > 0) {
      this.mediaItemService.uploadImages(this.pdfFiles).subscribe({
        next: (res) => this.saveLecture([...this.existingPdfs, ...res.items]),
        error: () => { this.submitting = false; alert('فشل رفع الملفات'); }
      });
    } else {
      this.saveLecture(this.existingPdfs);
    }
  }

  private saveLecture(pdfUrls: string[]) {
    const dto: CreateUpdateLectureDto = { 
      ...this.lectureForm.value, 
      chapterId: this.chapterId, 
      pdfUrls 
    };

    const request = this.isEditMode && this.selectedLectureId
      ? this.lectureService.update(this.selectedLectureId, dto)
      : this.lectureService.create(dto);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.loadLectures();
      },
      error: () => this.submitting = false
    });
  }
}