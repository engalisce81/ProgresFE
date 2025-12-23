import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
    {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'universties',
    loadChildren: () => import('./modules/university/university.module').then(m => m.UniversityModule),
  }, 

  {
    path: 'courses',
    loadChildren: () => import('./modules/course/course.module').then(m => m.CourseModule),
  },
 
  {
    path: 'accountc',
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'students',
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule),
  },
  {
    path: 'teachers',
    loadChildren: () => import('./modules/teacher/teacher.module').then(m => m.TeacherModule),
  },

 {
    path: 'enrollments',
    loadChildren: () => import('./modules/enrollment/enrollment.module').then(m => m.EnrollmentModule),
  },
  {
    path: 'questionbanks',
    loadChildren: () => import('./modules/questionbank/questionbank.module').then(m => m.QuestionbankModule),
  },

 

  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
  },
  
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
