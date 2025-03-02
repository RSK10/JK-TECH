import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  pageTitle: string = 'Dashboard'
  constructor(private router: Router ,private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) 
    ).subscribe(() => {
      const routeData = this.getRouteData(this.activatedRoute);
      this.pageTitle = routeData['title'] ? routeData['title'] : 'Dashboard';
    });
  }

  private getRouteData(route: ActivatedRoute): any {
    if (route.firstChild) {
      return this.getRouteData(route.firstChild);
    } else {
      return route.snapshot.data;
    }
  }
}
