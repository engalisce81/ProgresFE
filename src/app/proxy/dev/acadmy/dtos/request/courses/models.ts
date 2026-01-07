import type { IFormFile } from '../../../../../microsoft/asp-net-core/http/models';

export interface CreateUpdateCourseCertificateDto {
  courseId?: string;
  templateFile: IFormFile;
  nameXPosition: number;
  nameYPosition: number;
}

export interface CreateUpdateCourseFeedbackDto {
  courseId: string;
  rating: number;
  comment: string;
  isAccept: boolean;
}
