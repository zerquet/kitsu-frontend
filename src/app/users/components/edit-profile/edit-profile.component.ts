import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../../shared/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { ManageFavoritesComponent } from '../manage-favorites/manage-favorites.component';
import { Utils } from '../../../core/services/utils';
import { environment } from '../../../../environments/environment';

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

  currentTab = 'about';
  form = new FormGroup({
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

  profileInfo$ = this.usersService.getProfile();

  @ViewChild(ManageFavoritesComponent) favoritesComponent!: ManageFavoritesComponent;

  initializeModalData(openToTab: string = 'about') {
    this.profileInfo$.subscribe((profile) => {
      if (profile !== null) {
        this.form.patchValue({"id": profile.id});
        this.form.patchValue({"displayId": profile.displayId});
        this.form.patchValue({"username": profile.username});
        this.form.patchValue({"location": profile.location});
        this.form.patchValue({"birthday": profile.birthday});
        this.form.patchValue({"gender": profile.gender});
        this.form.patchValue({"bio": profile.bio});
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
    });
  }

  get id() { return this.form.get('id')}
  get displayId() { return this.form.get('displayId')}
  get username() { return this.form.get('username')}
  get location() { return this.form.get("location")}
  get birthday() { return this.form.get("birthday")}
  get gender() { return this.form.get("gender")}
  get bio() { return this.form.get("bio")}
  get profilePhoto() { return this.form.get("profilePhoto")}
  get coverPhoto() { return this.form.get("coverPhoto")}

  saveChanges() {
    const data = new FormData();
    data.append('id', this.id!.value!);
    data.append('displayId', this.displayId!.value!);
    data.append('username', this.username!.value!);
    data.append('location', this.location!.value!);
    data.append('bio', this.bio!.value!);
    if (!Utils.IsNullOrUndefined(this.birthday!.value)) data.append('birthday', new Date(this.birthday!.value!).toLocaleDateString());
    data.append('gender', this.gender!.value!);
    data.append('profilePhoto', this.profilePhoto!.value!)
    data.append('coverPhoto', this.coverPhoto!.value!); 
    
    this.usersService.updateProfile(data, this.currentTab === 'about' ? this.activeModal : undefined);

    if (this.currentTab === 'favorites') {
      this.favoritesComponent.saveChanges();
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
    this.form.patchValue({profilePhoto: file});
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
    this.form.patchValue({coverPhoto: file});
  }
}
