import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../../shared/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { ManageFavoritesComponent } from '../manage-favorites/manage-favorites.component';
import { Utils } from '../../../core/services/utils';
import { environment } from '../../../../environments/environment';
import { AppToastService } from '../../../shared/services/app-toast.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ManageFavoritesComponent, NgClass, AsyncPipe],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  public activeModal = inject(NgbActiveModal);
  private usersService = inject(UsersService);
  private toastService = inject(AppToastService);

  currentTab = 'about';
  updateProfileForm = new FormGroup({
    id: new FormControl(''),
    displayId: new FormControl(''),
    username: new FormControl(''),
    location: new FormControl(''),
    birthday: new FormControl<Date | null>(null),
    gender: new FormControl(''),
    bio: new FormControl(''),
    profilePhoto: new FormControl<File | undefined>(undefined),
    coverPhoto: new FormControl<File | undefined>(undefined)
  });
  newProfilePhoto: string | undefined = undefined;
  newProfilePhotoSelected: boolean = false;
  newCoverPhoto: string = "https://kitsu.app/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png";
  environment = environment;

  profileInfo$ = this.usersService.profile$;

  @ViewChild(ManageFavoritesComponent) favoritesComponent!: ManageFavoritesComponent;

  initializeModalData(openToTab: string = 'about') {
    if (this.profileInfo$.value !== null) {
      let profile = this.profileInfo$.value;
      this.updateProfileForm.patchValue({"id": profile.id});
      this.updateProfileForm.patchValue({"displayId": profile.displayId});
      this.updateProfileForm.patchValue({"username": profile.username});
      this.updateProfileForm.patchValue({"location": profile.location});
      this.updateProfileForm.patchValue({"birthday": profile.birthday});
      this.updateProfileForm.patchValue({"gender": profile.gender});
      this.updateProfileForm.patchValue({"bio": profile.bio});
      this.newProfilePhoto = profile.profilePhotoId;
      if (profile.profilePhotoId === null) {
        this.newProfilePhoto = "https://media.kitsu.app/user/1523778/avatar/large-77089f27577b3c80b2f270125e0c85ee.jpeg"; //not the best name. also check logic and fix bug
      }
      else {
        this.newProfilePhoto = `${this.environment.imageHostUrl}/users/profile/${profile.profilePhotoId}.jpg`
      }

      if (profile.coverPhotoId === null) {
        this.newCoverPhoto = "https://kitsu.app/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png";
      }
      else {
        this.newCoverPhoto = `${this.environment.imageHostUrl}/users/cover/${profile.coverPhotoId}.jpg`;
      }

      this.currentTab = openToTab;
    } 
  }

  onUpdateProfileClick() {
    const req = new FormData();
    req.append('id', this.id!.value!);
    req.append('displayId', this.displayId!.value!);
    req.append('username', this.username!.value!);
    req.append('location', this.location!.value!);
    req.append('bio', this.bio!.value!);
    if (!Utils.IsNullOrUndefined(this.birthday!.value)) req.append('birthday', new Date(this.birthday!.value!).toLocaleDateString());
    req.append('gender', this.gender!.value!);
    req.append('profilePhoto', this.profilePhoto!.value!)
    req.append('coverPhoto', this.coverPhoto!.value!); 
    
    this.usersService.updateProfile(req)
      .subscribe({
        next: () => this.toastService.show("Success", "Profile successfully updated!"),
        error: () => this.toastService.show("Error", "Updates could not be saved.")
      });
      
    if (this.currentTab === 'favorites') {
      this.favoritesComponent.onUpdateProfileClick();
    }
  }

  onProfilePhotoClick() {
    document.getElementById("profile-photo-input")?.click();
  }

  onCoverPhotoClick() {
    document.getElementById("cover-photo-input")?.click();
  }

  onProfilePhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newProfilePhoto = reader.result?.toString();
    }
    this.updateProfileForm.patchValue({profilePhoto: file});
    this.newProfilePhotoSelected = true;
  }

  onCoverPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result !== null) {
        this.newCoverPhoto = reader.result.toString();
      }
    }
    this.updateProfileForm.patchValue({coverPhoto: file});
  }

  // FORM GETTERS
  get id() { return this.updateProfileForm.get('id')}
  get displayId() { return this.updateProfileForm.get('displayId')}
  get username() { return this.updateProfileForm.get('username')}
  get location() { return this.updateProfileForm.get("location")}
  get birthday() { return this.updateProfileForm.get("birthday")}
  get gender() { return this.updateProfileForm.get("gender")}
  get bio() { return this.updateProfileForm.get("bio")}
  get profilePhoto() { return this.updateProfileForm.get("profilePhoto")}
  get coverPhoto() { return this.updateProfileForm.get("coverPhoto")}
}
