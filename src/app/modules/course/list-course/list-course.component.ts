import { ConfigStateService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseDto, CourseService } from '@proxy/dev/acadmy/courses';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-course',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.scss'
})
export class ListCourseComponent implements OnInit {
  // تعريف المصفوفة مع إضافة خاصية إظهار القائمة يدوياً
  courses: (CourseDto & { showMenu?: boolean })[] = [];
  loading = false;
  search = '';
  
  // خاص للبحث بالحرف (Debounce)
  private searchSubject = new Subject<string>();

  totalCount = 0;
  pageSize = 12; // يفضل رقم يقبل القسمة على 2 و 3 و 4 لشكل الكروت
  pageIndex = 1;
  roles: string[] = [];
  
  showDeleteConfirm = false;
  courseToDelete!: CourseDto;

  constructor(
    private courseService: CourseService,
    private config: ConfigStateService
  ) {}

  ngOnInit(): void {
    // إعداد مراقب البحث: ينتظر 400 ملي ثانية بعد التوقف عن الكتابة
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.search = searchValue;
      this.pageIndex = 1;
      this.loadCourses();
    });

    this.loadCourses();
    
    // جلب أدوار المستخدم الحالي
    const user = this.config.getOne("currentUser");
    this.roles = user?.roles ?? [];
  }

  // تُستدعى عند الكتابة في حقل البحث
  onSearchKeyup(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        // نضبط showMenu لكل كورس عند التحميل
        this.courses = res.items.map(course => ({ ...course, showMenu: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // --- نظام الترقيم (Pagination) ---
  
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.pageIndex;
    let pages: number[] = [];
    
    // إظهار صفحتين قبل وبعد الصفحة الحالية
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.loadCourses();
    }
  }

  // --- العمليات (Actions) ---

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  confirmDelete(course: CourseDto): void {
    this.courseToDelete = course;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.courseToDelete = null!;
  }

  deleteCourse(): void {
    if (!this.courseToDelete) return;
    this.courseService.delete(this.courseToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.loadCourses();
      }
    });
  }

  dublicate(id: string): void {
    this.courseService.duplicateCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }
}