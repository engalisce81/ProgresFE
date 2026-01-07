import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { finalize } from 'rxjs/operators';
import { CreateUpdateAdvertisementDto } from '@proxy/dev/acadmy/dtos/request/advertisementes';
import { AdvertisementDto } from '@proxy/dev/acadmy/dtos/response/advertisementes';
import { AdvertisementService } from '@proxy/dev/acadmy/services';

@Component({
  selector: 'app-list-advertisement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-advertisment.component.html',
  styleUrl: './list-advertisment.component.scss'
})
export class ListAdvertisementComponent implements OnInit {
  ads: (AdvertisementDto & { showMenu?: boolean })[] = [];
  loading = false;
  uploading = false;
  
  // Pagination & Search
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  // Modals
  showFormModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  selectedAdId: string | null = null;
  adToDelete!: AdvertisementDto;

  adForm: FormGroup;

  constructor(
    private adService: AdvertisementService,
    private mediaService: MediaItemService,
    private fb: FormBuilder
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      youTubeVideoUrl: [""],
      driveVideoUrl:[""],
      startDate: [null],
      endDate: [null],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds() {
    this.loading = true;
    this.adService.getActiveAdsList(this.pageIndex, this.pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.ads = res.items.map(ad => ({ ...ad, showMenu: false }));
        this.totalCount = res.totalCount;
      });
  }

  // Handle Image Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.mediaService.uploadImage(file).subscribe({
      next: (res) => {
        this.adForm.patchValue({ imageUrl: res.data });
        this.uploading = false;
      },
      error: () => {
        alert('Image upload failed');
        this.uploading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedAdId = null;
    this.adForm.reset({ isActive: true });
    this.showFormModal = true;
  }

  openEditModal(ad: AdvertisementDto) {
    this.isEditMode = true;
    this.selectedAdId = ad.id;
    this.adForm.patchValue({
      title: ad.title,
      imageUrl: ad.imageUrl,
      targetUrl: ad.youTubeVideoUrl,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : null,
      endDate: ad.endDate ? ad.endDate.split('T')[0] : null,
      isActive: ad.isActive
    });
    this.showFormModal = true;
  }

  submitForm() {
    if (this.adForm.invalid) return;

    const dto: CreateUpdateAdvertisementDto = this.adForm.value;
    this.loading = true;

    const request = this.isEditMode && this.selectedAdId
      ? this.adService.update(this.selectedAdId, dto) // افترضت وجود ميثود update في الـ proxy
      : this.adService.create(dto);

    request.pipe(finalize(() => this.loading = false)).subscribe(() => {
      this.showFormModal = false;
      this.loadAds();
    });
  }

  confirmDelete(ad: AdvertisementDto) {
    this.adToDelete = ad;
    this.showDeleteConfirm = true;
  }

  deleteAd() {
    this.adService.delete(this.adToDelete.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.loadAds();
    });
  }
}