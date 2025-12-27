import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web/web.component';
import { WebsiteHomeComponent } from './website-home/website-home.component';

const routes: Routes = [
  {path:'',component:WebComponent ,
    data: { layout: 'empty' } ,
      children:[
        {path:'' , component:WebsiteHomeComponent}
      ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
