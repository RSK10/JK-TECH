import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  modalTitle: any = "Sign Up";

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }
  
  onSave (message: string) {
    console.log("Received from child: " + message);
  }
}
