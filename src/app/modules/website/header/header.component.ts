import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  AuthService, 
  LocalizationModule, 
  SessionStateService,
} from '@abp/ng.core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, LocalizationModule]
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  isDarkMode = true;

  constructor(
    private sessionState: SessionStateService,
    private authService: AuthService  ) {}

  ngOnInit() {
    // كود الثيم
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDarkMode = false;
      document.body.classList.add('light-mode');
    }
  }

  // الحصول على اللغة الحالية
  get currentLang(): string {
    return this.sessionState.getLanguage();
  }

  // دالة تغيير اللغة للإصدارات الحديثة
  changeLanguage() {
    const targetLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.sessionState.setLanguage(targetLang);
  }
  login() {
    this.authService.navigateToLogin();
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}