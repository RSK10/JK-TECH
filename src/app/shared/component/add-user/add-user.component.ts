import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserService } from 'src/app/service';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common/common.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [MessageService, DatePipe]
})
export class AddUserComponent implements OnInit {

  signUpForm!: FormGroup;
  errorMessage: string = '';
  isAdmin: boolean = false;
  hide = true;
  roles: any = []

  @Input() title!: string;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.roles = [
      { name: 'User', value: 'user' },
      { name: 'Super User', value: 'super user' },
      { name: 'Admin', value: 'admin' }
    ]

    let formattedCurrDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm:ss a')

    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', [Validators.required]),
      createdDate: new FormControl(formattedCurrDate),
      modifieddDate: new FormControl(formattedCurrDate),
      description: new FormControl('')
    });

    this.signUpForm.get('role')?.setValue(this.getRoleObject('user'));
    this.isAdmin = this.authService.hasRole('admin');
    if (!this.isAdmin) {
      this.signUpForm.get('role')?.disable();
    }
  }
  getRoleObject(role: any) {
    return this.roles.find((option: any) => option.value === role) || null;
  }

  onSignUp() {
    const selectedRole = this.signUpForm.get('role')?.value;

    if (selectedRole && typeof selectedRole === 'object') {
      this.signUpForm.get('role')?.setValue(selectedRole.value);
    }
    if (this.signUpForm.valid) {
      this.userService.addUser(this.signUpForm.value).subscribe({
        next: (res => {
          this.save.emit(res);
          switch (this.title) {
            case 'Add User':
              this.closeDialog.emit(true)
              this.signUpForm.reset()
              break;

            case 'Sign Up':
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'You have successfully signed up! Login using the credentials',
                key: 'ct'
              });
              this.router.navigate(['/login'])
              break;

            default:
              break;
          }
        }),
        error: (e => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User Could not be added Please try later',
            key: "lt"
          });
        })
      })
    } else {
      this.commonService.markRequiredFieldsAsDirty(this.signUpForm)
    }
  }
}
