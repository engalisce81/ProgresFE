import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamQuestionsDto, ExamService } from '@proxy/dev/acadmy/exams';

@Component({
  selector: 'app-bank-question',
  imports: [ReactiveFormsModule],
  templateUrl: './bank-question.component.html',
  styleUrl: './bank-question.component.scss'
})
export class BankQuestionComponent {
  bankId!: string;
  questions: ExamQuestionsDto[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // ✅ خذ bankId من الـ route
      if (id) {
        this.bankId = id;
        this.loadQuestions();
      }
    });
  }

  loadQuestions() {
    this.loading = true;

    this.examService.getQuestionsFromBank([this.bankId], "3a1d1a01-1ab7-8fb6-fdf2-2dcabfba1b42").subscribe({
      next: (res) => {
        this.questions = res.items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.loading = false;
      }
    });
  }
}
