import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService, ReplaceableComponentsService } from '@abp/ng.core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { EmptyLayoutComponent } from '@abp/ng.theme.lepton-x/layouts';

@Component({
  selector: 'app-web',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  standalone:true,
  templateUrl: './web.component.html',
  styleUrl: './web.component.scss'
})
export class WebComponent implements OnInit ,OnDestroy{
constructor(
    private authService: AuthService,
    private router: Router,
    private replaceableComponents: ReplaceableComponentsService
  ) { }
  ngOnInit() {
    document.body.classList.add('hide-abp-layout');
    } 
    ngOnDestroy() {
    // إزالة الكلاس عند الخروج من الصفحة ليعود الـ Layout للأقسام الأخرى (مثل الـ Admin)
    document.body.classList.remove('hide-abp-layout');
  }
}
