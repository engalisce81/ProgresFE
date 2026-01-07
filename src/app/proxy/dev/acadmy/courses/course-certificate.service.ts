import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateCourseCertificateDto } from '../dtos/request/courses/models';
import type { CourseCertificateDto } from '../dtos/response/courses/models';

@Injectable({
  providedIn: 'root',
})
export class CourseCertificateService {
  apiName = 'Default';
  

  createOrUpdate = (input: CreateUpdateCourseCertificateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/course-certificate/or-update',
      body: input.templateFile,
    },
    { apiName: this.apiName,...config });
  

  downloadCertificate = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'GET',
      responseType: 'blob',
      url: `/api/app/course-certificate/download-certificate/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  getByCourseId = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseCertificateDto>({
      method: 'GET',
      url: `/api/app/course-certificate/by-course-id/${courseId}`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
