import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {path:'',pathMatch:'full',component:ListCourseComponent},
  {path:'create',pathMatch:'full',component:CreateCourseComponent},
  {path:'update/:id',pathMatch:'full',component:UpdateCourseComponent},
  {path:':id/chat',pathMatch:'full',component:ListChatComponent},

  {path: 'subscriber/:id',pathMatch:'full' ,  component: ListSubscriberComponent},
  { path: 'subscriber/:id/degree/:userId' ,pathMatch:'full', component: DegreeStudentComponent },
   {path:'requestjoin/:id',pathMatch:'full',component:ListRequestjoinComponent},
   {path:':id/feedbacks',pathMatch:'full',component:ListFeedbackComponent},
   {path:':id/chapters',pathMatch:'full',component:ListChapterComponent},
   {path:':id/chapters/:chapterId/lectures',pathMatch:'full',component:ListLectureComponent},
   {path:':id/chapters/:chapterId/lectures/:lectureId/quizies',pathMatch:'full',component:ListQuizComponent},
   {path:':id/exams',pathMatch:'full',component:ListExamComponent},
   {path:':id/quizies',pathMatch:'full',component:ListQuizComponent},










];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
