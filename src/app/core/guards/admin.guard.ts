import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, map, of } from "rxjs";
import { AuthService } from "../auth/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    canActivate(): Observable<boolean> {
        return of(false);
        // return this.authService.getUser().pipe(
        //     map(user => {
        //         console.log("admin guard");
            
        //         console.log(user);
        //         if (user && user.isAdmin === true) {
        //             return true;
        //         } else {
        //             this.authService.isAdminPage$.next(false);
        //             this.router.navigate(['/home']);
        //             return false;
        //         }
        //     })
        // );
    }

}