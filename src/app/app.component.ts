import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jk-tech';
  isAuthenticated!: boolean;
  private authStatusSubscription!: Subscription;
  sidebarVisible: boolean = true
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.updateAuthStatus();
  }

  private updateAuthStatus() {
    this.authService.Authenticated$.subscribe(status => {
      this.isAuthenticated = status;
    })
  }

  ngOnDestroy() {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

}
