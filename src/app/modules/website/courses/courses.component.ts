import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CourseDto, CourseInfoHomeDto, CourseService } from '@proxy/dev/acadmy/courses';

@Component({
  selector: 'app-courses',
  standalone: true, // تأكد أنه standalone في ABP 9
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  // مصفوفة لتخزين البيانات القادمة من السيرفر
  courses: CourseDto[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    // إرسال قيم افتراضية للـ Pagination والـ Filters
    this.courseService.getList(1,3,"",0)
      .subscribe((response) => {
        this.courses = response.items;
        this.loading = false;
      });
  }

  // وظيفة لتحديد لون الـ Gradient بناءً على أي منطق تريده (مثلاً معرف الكورس)
  getGradientClass(index: number): string {
    const gradients = ['violet-gradient', 'purple-gradient', 'bell-gradient'];
    return gradients[index % gradients.length];
  }
}