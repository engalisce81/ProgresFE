import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteHomeComponent } from './website-home.component';

describe('WebsiteHomeComponent', () => {
  let component: WebsiteHomeComponent;
  let fixture: ComponentFixture<WebsiteHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
