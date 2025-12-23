import { ConfigStateService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseDto, CourseService } from '@proxy/dev/acadmy/courses'; // تأكد من المسار
import { CourseType } from '@proxy/dev/acadmy/enums';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-course',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.scss'
})
export class ListCourseComponent implements OnInit {
  courses: (CourseDto & { showMenu?: boolean })[] = [];
  loading = false;
  search = '';
  selectedType: CourseType = CourseType.All; // التاب الافتراضية
  courseTypes = CourseType; // لجعل الـ Enum متاح في الـ HTML

  private searchSubject = new Subject<string>();
  totalCount = 0;
  pageSize = 12;
  pageIndex = 1;
  roles: string[] = [];
  
  showDeleteConfirm = false;
  courseToDelete!: CourseDto;

  constructor(private courseService: CourseService, private config: ConfigStateService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
      this.search = val;
      this.pageIndex = 1;
      this.loadCourses();
    });
    this.loadCourses();
    this.roles = this.config.getOne("currentUser")?.roles ?? [];
  }

  onSearchKeyup(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  onTabChange(type: CourseType): void {
    this.selectedType = type;
    this.pageIndex = 1;
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getList(this.pageIndex, this.pageSize, this.search, this.selectedType).subscribe({
      next: (res) => {
        this.courses = res.items.map(c => ({ ...c, showMenu: false }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get totalPages(): number { return Math.ceil(this.totalCount / this.pageSize); }
  get pages(): number[] {
    const pages = [];
    for (let i = Math.max(1, this.pageIndex - 2); i <= Math.min(this.totalPages, this.pageIndex + 2); i++) pages.push(i);
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.loadCourses();
    }
  }

  hasRole(role: string): boolean { return this.roles.includes(role); }

  confirmDelete(course: CourseDto): void { this.courseToDelete = course; this.showDeleteConfirm = true; }
  cancelDelete(): void { this.showDeleteConfirm = false; }
  
  deleteCourse(): void {
    this.courseService.delete(this.courseToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadCourses();
    });
  }

  duplicate(id: string): void {
    this.courseService.duplicateCourse(id).subscribe(() => this.loadCourses());
  }
}