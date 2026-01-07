import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// استيراد المكونات
import { ListCourseComponent } from './list-course/list-course.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { ListSubscriberComponent } from './list-subscriber/list-subscriber.component';
import { ListRequestjoinComponent } from './list-requestjoin/list-requestjoin.component';
import { DegreeStudentComponent } from './degree-student/degree-student.component';
import { ListFeedbackComponent } from './list-feedback/list-feedback.component';
import { ListChapterComponent } from './chapter/list-chapter/list-chapter.component';
import { ListLectureComponent } from './chapter/lecture/list-lecture/list-lecture.component';
import { ListExamComponent } from './exam/list-exam/list-exam.component';
import { ListQuizComponent } from './chapter/lecture/quiz/list-quiz/list-quiz.component';
import { ListChatComponent } from './chat/list-chat/list-chat.component';
import { CertificateComponent } from './certificate/certificate/certificate.component';
import { BankQuestionComponent } from '../questionbank/bank-question/bank-question.component';
import { ExamQuestionsComponent } from './exam/exam-questions/exam-questions.component';
import { ExamParticipantsComponent } from './exam/participant/exam-participants/exam-participants.component';
import { ExamResultReviewComponent } from './exam/participant/result-review/exam-result-review/exam-result-review.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListCourseComponent },
    { path: 'certificate/:id', component: CertificateComponent }, // تمت إزالة pathMatch الزائدة هنا للتبسيط

  { path: 'create', component: CreateCourseComponent },
  { path: 'update/:id', component: UpdateCourseComponent },
  { path: ':id/chat', component: ListChatComponent },
  { path: 'subscriber/:id', component: ListSubscriberComponent },
  { path: 'subscriber/:id/degree/:userId', component: DegreeStudentComponent },
  { path: 'requestjoin/:id', component: ListRequestjoinComponent },
  { path: ':id/feedbacks', component: ListFeedbackComponent },
  { path: ':id/chapters', component: ListChapterComponent },
  { path: ':id/chapters/:chapterId/lectures', component: ListLectureComponent },
  { path: ':id/chapters/:chapterId/lectures/:lectureId/quizies', component: ListQuizComponent },
  { path: ':id/exams',pathMatch:'full' , component: ListExamComponent },
  { path: ':id/exams/:examId/questions', component:ExamQuestionsComponent },
  { path: ':id/exams/:examId/students',pathMatch:'full' , component:ExamParticipantsComponent },
  { path: ':id/exams/:examId/students/:userId/result',  pathMatch:'full' , component:ExamResultReviewComponent },
  { path: ':id/quizies', component: ListQuizComponent },
];

@NgModule({
  // تأكد أن RouterModule.forChild(routes) هي المرجع الوحيد هنا
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }