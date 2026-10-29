import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageFavoritesComponent } from '../manage-favorites/manage-favorites.component';
import { Utils } from '../../../../../../core/services/utils';
import { environment } from '../../../../../../../environments/environment';
import { AppToastService } from '../../../../../../shared/services/app-toast.service';
import { UsersService } from '../../../../../../shared/services/users.service';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, take } from 'rxjs';
import { ModalTitleComponent } from "../../../../../../shared/components/modal-title/modal-title.component";
import { TabItem } from '../../../../../../shared/models/tab-item.model';
import { NavTabsComponent } from "../../../../../../shared/components/nav-tabs/nav-tabs.component";
import { DEFAULT_USER_COVER, DEFAULT_USER_PROFILE } from '../../../../../../shared/constants/constants';
import { getCoverPhotoUrl, getFileNameWithoutExtension, getProfilePhotoUrl } from '../../../../../../shared/helpers/helpers';
import { FavoriteAnimeDataService } from '../../../../services/favorite-anime-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ManageFavoritesComponent, AsyncPipe, ModalTitleComponent, NavTabsComponent],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent implements OnInit, OnDestroy {
  public activeModal = inject(NgbActiveModal);
  private usersService = inject(UsersService);
  private toastService = inject(AppToastService);
  private favoritesDataService = inject(FavoriteAnimeDataService);

  currentTabId = 'profile.aboutme';
  tabs: TabItem[] = [
    {id: 'profile.aboutme', label: 'About Me'},
    {id: 'profile.favorites', label: 'Favorites'}
  ];
  updateProfileForm!: FormGroup; //VALID = SAME DATA = DISABLED. INVALID = DIFFERENT DATA = ENABLED
  currentProfilePhotoUrl: string | undefined = undefined;
  currentProfilePhotoId: string | undefined;
  currentCoverPhotoUrl: string = DEFAULT_USER_COVER;
  currentCoverPhotoId: string | undefined;
  environment = environment;

  profileInfo$ = this.usersService.profile$;
  private destroyRef = inject(DestroyRef);
  private _saveTriggerSubject = new Subject<void>();
  saveTrigger$ = this._saveTriggerSubject.asObservable();
  canSubmit$!: Observable<boolean>;
  
  ngOnInit() {    
    this.profileInfo$
      .pipe(take(1))
      .subscribe(profile => {
        if (!profile) return;

        this.currentProfilePhotoId = profile.profilePhotoId;
        this.currentCoverPhotoId = profile.coverPhotoId;

        this.updateProfileForm = new FormGroup({
          id: new FormControl<string>(profile.id),
          location: new FormControl<string | undefined>(profile.location, [this.locationIsDifferent(profile.location)]),
          birthday: new FormControl<string | undefined>(profile.birthday, [this.birthdayIsDifferent(profile.birthday)]),
          gender: new FormControl<string | undefined>(profile.gender, [this.genderIsDifferent(profile.gender)]),
          bio: new FormControl<string | undefined>(profile.bio, [this.bioIsDifferent(profile.bio)]),
          profilePhoto: new FormControl<File | undefined>(undefined, [this.profilePhotoIsDifferent(profile.profilePhotoId)]),
          coverPhoto: new FormControl<File | undefined>(undefined, [this.coverPhotoIsDifferent(profile.coverPhotoId)])
        });        

        this.currentProfilePhotoUrl = profile.profilePhotoUrl;
        this.currentCoverPhotoUrl = profile.coverPhotoUrl;

        this.canSubmit$ = combineLatest([
          this.updateProfileForm.statusChanges.pipe(startWith(this.updateProfileForm.status), map(status => status === "VALID")),
          this.favoritesDataService.favoritesChanged$
        ]).pipe(
          map(([formIsValid, favoritesChanged]) => !formIsValid || favoritesChanged),
          takeUntilDestroyed(this.destroyRef)
        );

      });
  }

  ngOnDestroy() {
    this.favoritesDataService.resetState();
  }

  onSubmit() {
    const req = new FormData();
    req.append('id', this.id!.value);

    const appendIfPresent = (key: string, value: string | Blob | null | undefined) => {
      if (!Utils.IsNullOrUndefined(value)) req.append(key, value!);
    }
    
    appendIfPresent('location', this.location?.value);
    appendIfPresent('bio', this.bio?.value);
    appendIfPresent('birthday', this.birthday!.value!);
    appendIfPresent('gender', this.gender?.value);
    appendIfPresent('profilePhoto', this.profilePhoto!.value!)
    appendIfPresent('coverPhoto', this.coverPhoto!.value!);

    this.usersService.updateProfile(req)
      .subscribe({
        next: () => {
          this.activeModal.close();
          this.toastService.show("Success", "Profile successfully updated!")
        },
        error: () => this.toastService.show("Error", "Updates could not be saved.")
      });

    if (this.currentTabId === 'profile.favorites') {
      this._saveTriggerSubject.next();
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
      this.currentProfilePhotoUrl = reader.result?.toString();
    }
    this.currentProfilePhotoId = getFileNameWithoutExtension(file.name);
    this.updateProfileForm.patchValue({ profilePhoto: file });
  }

  onCoverPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result !== null) {
        this.currentCoverPhotoUrl = reader.result.toString();
      }
    }
    this.currentCoverPhotoId = getFileNameWithoutExtension(file.name);
    this.updateProfileForm.patchValue({ coverPhoto: file });
  }

  onTabClicked(tabId: string) {
    this.currentTabId = tabId;
  }

  // FORM VALIDATORS
  locationIsDifferent(location: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === location) {
        return null;
      }
      return { locationIsDifferent: true }
    }
  }

  birthdayIsDifferent(birthday: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === birthday) {        
        return null;
      }
      return { birthdayIsDifferent: true }
    }
  }

  genderIsDifferent(gender: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === gender) {
        return null;
      }
      return { genderIsDifferent: true }
    }
  }

  bioIsDifferent(bio: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === bio) {
        return null;
      }
      return { bioIsDifferent: true }
    }
  }
  
  profilePhotoIsDifferent(profilePhotoId: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.currentProfilePhotoId === profilePhotoId) {
        return null;
      }
      return { profilePhotoIsDifferent: true }
    }
  }
  
  coverPhotoIsDifferent(coverPhotoId: string | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.currentCoverPhotoId === coverPhotoId) {
        return null;
      }
      return { coverPhotoIsDifferent: true }
    }
  }

  // FORM GETTERS
  get id() { return this.updateProfileForm.get('id') }
  get location() { return this.updateProfileForm.get("location") }
  get birthday() { return this.updateProfileForm.get("birthday") }
  get gender() { return this.updateProfileForm.get("gender") }
  get bio() { return this.updateProfileForm.get("bio") }
  get profilePhoto() { return this.updateProfileForm.get("profilePhoto") }
  get coverPhoto() { return this.updateProfileForm.get("coverPhoto") }
}
