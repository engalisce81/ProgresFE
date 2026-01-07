import { Component, viewChild, signal, inject, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourseCertificateService } from '@proxy/dev/acadmy/courses';
import * as pdfjsLib from 'pdfjs-dist';
import { CommonModule, NgIf } from '@angular/common';
import { CreateUpdateCourseCertificateDto } from '@proxy/dev/acadmy/dtos/request/courses/models';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss'
})
export class CertificateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private certificateService = inject(CourseCertificateService);

  readonly pdfCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pdfCanvas');

  courseId = signal<string | null>(null);
  pdfLoaded = signal(false);
  isLoading = signal(false);
  namePosition = signal({ x: 0, y: 0 });
  showMarker = signal(false);
  selectedFile: File | null = null;
  exampleName = signal('John Doe'); // Default English Name

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.courseId.set(id);
        this.loadExistingCertificate(id);
      }
    });
  }

  loadExistingCertificate(id: string) {
    this.certificateService.getByCourseId(id).subscribe({
      next: async (data) => {
        if (data && data.templateUrl) {
          this.namePosition.set({ x: data.nameXPosition, y: data.nameYPosition });
          this.showMarker.set(true);
          // تأكد أن الـ URL يبدأ بـ http ليتجنب مشاكل الـ Fetch
          this.downloadAndRenderPdf(data.templateUrl);
        }
      },
      error: () => console.log('Ready for new template configuration.')
    });
  }

  downloadAndRenderPdf(url: string) {
    this.isLoading.set(true);
    // استخدام HttpClient مع ArrayBuffer يحل أغلب مشاكل الـ CORS
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe({
      next: async (buffer) => {
        await this.displayPdf(buffer);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Download error:', err);
        this.isLoading.set(false);
      }
    });
  }

  async displayPdf(data: ArrayBuffer) {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = this.pdfCanvas()?.nativeElement;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      this.pdfLoaded.set(true);
    } catch (error) {
      console.error('PDF Rendering error:', error);
    }
  }

  async loadPdf(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const arrayBuffer = await file.arrayBuffer();
    await this.displayPdf(arrayBuffer);
  }

  selectPosition(event: MouseEvent) {
    if (!this.pdfLoaded()) return;
    const canvas = this.pdfCanvas()?.nativeElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

    this.namePosition.set({ x: xPercent, y: yPercent });
    this.showMarker.set(true);
  }

  saveConfig() {
    const id = this.courseId();
    if (!id) return;

    const dto: CreateUpdateCourseCertificateDto = {
      courseId: id,
      templateFile: this.selectedFile as any, // سيتم إرساله كـ Multipart Form Data
      nameXPosition: this.namePosition().x,
      nameYPosition: this.namePosition().y
    };

    this.certificateService.createOrUpdate(dto).subscribe({
      next: () => alert('تم الحفظ بنجاح!'),
      error: (err) => {
        console.error('Save error:', err);
        alert('حدث خطأ أثناء الحفظ. تأكد من إدخال جميع البيانات المطلوبة.');
      }
    });
  }
}