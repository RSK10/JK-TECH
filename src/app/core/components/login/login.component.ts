import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]

})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  hide = true;
  email: any;
  password: any;
  isAdmin: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.createForm();
    this.isAdmin = this.authService.hasRole('admin');
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onLogin() {
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;

    if (this.loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: (users) => {
          if (users?.length > 0) {
            const user = users[0];
            this.authService.setLoggedInUser(user);
            this.authService.Authenticated$.next(true);
            this.router.navigate(['/dashboard']);
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Invalid credentials', key: "lt" });
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occurred during login', key: "lt" });

        }
      });
    }

    else {
      this.commonService.markRequiredFieldsAsDirty(this.loginForm)
    }
  }

}
