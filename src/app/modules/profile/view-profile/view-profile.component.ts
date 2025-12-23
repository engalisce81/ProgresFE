import { Component, OnInit } from '@angular/core';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { UserInfoDto, ProfileUserService, UpdateProfielDto } from '@proxy/dev/acadmy/profile-users';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit {
  profile!: UserInfoDto;
  loading = true;
  uploading = false;

  constructor(
    private profileService: ProfileUserService,
    private mediaService: MediaItemService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getTeacherProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploading = true;

    // 1) Upload Image
    this.mediaService.uploadImage(file).subscribe({
      next: (uploadResponse) => {
        const newUrl = uploadResponse.data;

        // 2) Update User Data
        const updateModel: UpdateProfielDto = {
          logoUrl: newUrl
        };

        this.profileService.updateAllUserData(updateModel).subscribe({
          next: () => {
            this.profile.profilePictureUrl = newUrl;
            this.uploading = false;
          },
          error: (err) => {
            console.error(err);
            this.uploading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.uploading = false;
      }
    });
  }
}