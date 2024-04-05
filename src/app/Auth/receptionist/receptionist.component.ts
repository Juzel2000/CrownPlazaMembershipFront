import { AuthentictionService } from '../../service/auth/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/service/functional/snackbar.service';


@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistComponent implements OnInit {

  
  loginForm!: FormGroup;
  isAuthenticated = false;

  constructor(private formBuilder: FormBuilder,private router: Router,private authService: AuthentictionService, private alert:SnackbarService) 
    {
      localStorage.removeItem('token');
    }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      BypassForceLogOff: [true]
    });
  }

  onSubmit() {
    this.markFormGroupTouched(this.loginForm); 
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        if (data==true) {
          this.router.navigate(['/home/campaign-list']);
        } else {
          this.alert.showError('Invalid Login');
          setTimeout(() => {
            location.reload();
          }, 3000); 
        }
      }
    );

  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  logout(): void {
    this.isAuthenticated = false;
    this.router.navigate(['/receptionist']);
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

}
