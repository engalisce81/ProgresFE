import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUniversityComponent } from './list-university/list-university.component';
import { ListCollegeComponent } from './college/list-college/list-college.component';
import { ListGradelevelComponent } from './college/gradeLevel/list-gradelevel/list-gradelevel.component';
import { ListSubjectComponent } from './college/gradeLevel/subject/list-subject/list-subject.component';

const routes: Routes = [
  {path:'',pathMatch:"full",component:ListUniversityComponent},
  {path:':id/colleges',pathMatch:"full",component:ListCollegeComponent},
  {path:':id/colleges/:collegeId/gradeLevels',pathMatch:"full",component:ListGradelevelComponent},
  {path:':id/colleges/:collegeId/gradeLevels/:gradeLevelId/subjects',pathMatch:"full",component:ListSubjectComponent}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversityRoutingModule { }
