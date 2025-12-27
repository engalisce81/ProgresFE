import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { WhyChooseUsComponent } from "../why-choose-us/why-choose-us.component";
import { CoursesComponent } from "../courses/courses.component";
import { TestimonialsComponent } from "../testimonials/testimonials.component";
import { QaComponent } from "../qa/qa.component";

@Component({
  selector: 'app-website-home',
  imports: [HeroComponent, WhyChooseUsComponent, CoursesComponent, TestimonialsComponent, QaComponent],
  templateUrl: './website-home.component.html',
  styleUrl: './website-home.component.scss'
})
export class WebsiteHomeComponent {

}
