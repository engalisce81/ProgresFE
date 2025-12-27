import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationModule } from '@abp/ng.core';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [CommonModule, LocalizationModule],
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent {
  // مصفوفة الأسئلة مع مفاتيح الترجمة
  faqItems = [
    { question: '::QA:Q1', answer: '::QA:A1', active: false },
    { question: '::QA:Q2', answer: '::QA:A2', active: false },
    { question: '::QA:Q3', answer: '::QA:A3', active: false }
  ];

  toggleItem(index: number) {
    this.faqItems[index].active = !this.faqItems[index].active;
    // لإغلاق الباقي عند فتح واحد (اختياري)
    this.faqItems.forEach((item, i) => {
      if (i !== index) item.active = false;
    });
  }
}