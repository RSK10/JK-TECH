import { Component, OnInit } from '@angular/core';
import { UserService, AuthService } from 'src/app/service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUserId: any;
  user: any;

  constructor(
    private userService: UserService,
    private AuthService: AuthService
  ) { }

  ngOnInit() {
    this.currentUserId = this.AuthService.getLoggedInUser().id;
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUser(this.currentUserId).subscribe({
      next: (res => {
        this.user = res;
      }),
      error: (e => {
        console.log(e.error);
      })
    })
  }

  logOut() {
    this.AuthService.logout();
  }
}
