import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { UsersService } from '../../../shared/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../../../shared/models/userProfile.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  activeModal = inject(NgbActiveModal);
  private userProfileService = inject(UsersService);
  private toastService = inject(AppToastService);
  profileInfo$ = new BehaviorSubject<UserProfile | undefined>(undefined);
  form = new FormGroup({
    location: new FormControl(''),
    birthday: new FormControl<Date | null>(null),
    gender: new FormControl(''),
    bio: new FormControl('')
  });

  initializeModalData(profileInfo: UserProfile) {
    this.profileInfo$.next(profileInfo);
    this.form.patchValue({"location": profileInfo.location});
    this.form.patchValue({"birthday": profileInfo.birthday});
    this.form.patchValue({"gender": profileInfo.gender});
    this.form.patchValue({"bio": profileInfo.bio});
  }

  get location() { return this.form.get("location")}
  get birthday() { return this.form.get("birthday")}
  get gender() { return this.form.get("gender")}
  get bio() { return this.form.get("bio")}

  saveChanges() {
    debugger;
    const data: UserProfile = {
      id: this.profileInfo$.value?.id!,
      username: this.profileInfo$.value?.username!,
      location: this.location!.value!,
      bio: this.bio!.value!,
      birthday: this.birthday!.value!,
      gender: this.gender!.value!
    }  
    
    this.userProfileService.updateUserProfile(data)
      .subscribe({
        next: res => {
          this.profileInfo$.next(res);
          this.toastService.show("Success", "Profile successfully updated!");
          this.activeModal.close(); //gotta let other components know about the new updates. idk im too tired. 
        },
        error: () => {
          this.toastService.show("Error", "Updates could not be saved.");
        }
      })
  }
}
