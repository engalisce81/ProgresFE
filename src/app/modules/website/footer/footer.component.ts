import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports:[NgFor,NgIf],
  standalone:true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { path: '/', icon: 'fa-home', text: 'Home' },
    { path: '/courses', icon: 'fa-book', text: 'Courses' },
    { path: '/blog', icon: 'fa-blog', text: 'Blog' },
    { path: '/about', icon: 'fa-info-circle', text: 'About' },
    { path: '/contact', icon: 'fa-envelope', text: 'Contact' }
  ];
  
  courses = [
    { path: '/courses', icon: 'fa-code', text: 'Frontend Development' },
    { path: '/courses', icon: 'fa-server', text: 'Backend Development' },
    { path: '/courses', icon: 'fa-mobile-alt', text: 'Mobile Development' },
    { path: '/courses', icon: 'fa-paint-brush', text: 'Graphic Design' },
    { path: '/courses', icon: 'fa-chart-bar', text: 'Data Science' }
  ];
  
  contactInfo = [
    { icon: 'fa-envelope', text: 'info@tadriscom.com', link: 'mailto:info@tadriscom.com' },
    { icon: 'fa-phone', text: '+1 234 567 890', link: 'tel:+1234567890' },
    { icon: 'fa-map-marker-alt', text: '123 Learning St, Tech City' },
    { icon: 'fa-shield-alt', text: 'Privacy Policy' },
    { icon: 'fa-file-contract', text: 'Terms of Service' }
  ];
  
  socialLinks = [
    { icon: 'fab fa-facebook-f', link: '#', label: 'Facebook' },
    { icon: 'fab fa-twitter', link: '#', label: 'Twitter' },
    { icon: 'fab fa-linkedin-in', link: '#', label: 'LinkedIn' },
    { icon: 'fab fa-instagram', link: '#', label: 'Instagram' },
    { icon: 'fab fa-youtube', link: '#', label: 'YouTube' }
  ];
  
  footerBottomLinks = [
    { text: 'Privacy Policy' },
    { text: 'Terms of Service' },
    { text: 'Cookie Policy' },
    { text: 'Sitemap' }
  ];
}