import { CoreModule } from '@abp/ng.core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports:[CoreModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  tags = [
    { icon: 'fa-code', text: 'Frontend' },
    { icon: 'fa-server', text: 'Backend' },
    { icon: 'fa-mobile-alt', text: 'Mobile' },
    { icon: 'fa-paint-brush', text: 'Graphics' },
    { icon: 'fa-briefcase', text: 'Internship Ready' }
  ];
}