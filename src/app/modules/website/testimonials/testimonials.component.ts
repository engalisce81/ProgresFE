import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
    imports:[NgFor,NgIf],

  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials = [
    {
      id: 1,
      text: "The quizzes and proctored exams kept me accountable. I landed an internship two weeks after graduating. The hands-on projects were exactly what employers were looking for!",
      name: "Alex Shaw",
      role: "Frontend Graduate",
      roleIcon: "fa-code",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      id: 2,
      text: "Best part was the career support. The team reviewed my projects and CV thoroughly. I got 3 job offers within a month of completing the backend course!",
      name: "Maryam Rizk",
      role: "Backend Graduate",
      roleIcon: "fa-server",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4.5
    },
    {
      id: 3,
      text: "Hands‑on projects made all the difference. I shipped my first app to the store during the course! The instructors were always available to help.",
      name: "Omar Ali",
      role: "Mobile Apps Graduate",
      roleIcon: "fa-mobile-alt",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  getStars(rating: number): any[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    if (hasHalfStar) {
      stars.push('half');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    
    return stars;
  }
}