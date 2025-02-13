import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../../shared/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { ManageFavoritesComponent } from '../manage-favorites/manage-favorites.component';

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
    username: new FormControl(''),
    location: new FormControl(''),
    birthday: new FormControl<Date | null>(null),
    gender: new FormControl(''),
    bio: new FormControl('')
  });

  profileInfo$ = this.usersService.getCurrentUserProfile();

  initializeModalData() {
    this.profileInfo$.subscribe((profile) => {
      if (profile !== null) {
        this.form.patchValue({"id": profile.id});
        this.form.patchValue({"username": profile.username});
        this.form.patchValue({"location": profile.location});
        this.form.patchValue({"birthday": profile.birthday});
        this.form.patchValue({"gender": profile.gender});
        this.form.patchValue({"bio": profile.bio});
      } 
    });
  }

  get id() { return this.form.get('id')}
  get username() { return this.form.get('username')}
  get location() { return this.form.get("location")}
  get birthday() { return this.form.get("birthday")}
  get gender() { return this.form.get("gender")}
  get bio() { return this.form.get("bio")}

  saveChanges() {
    const data: UserProfile = {
      id: this.id!.value!,
      username: this.username!.value!,
      location: this.location!.value!,
      bio: this.bio!.value!,
      birthday: this.birthday!.value!,
      gender: this.gender!.value!
    }  
    
    this.usersService.updateUserProfile(data, this.activeModal);
  }
}
