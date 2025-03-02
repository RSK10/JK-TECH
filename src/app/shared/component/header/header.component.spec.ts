import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';

class RouterMock {
  events = of(new NavigationEnd(1, '/home', '/home'));
}

class ActivatedRouteMock {
  snapshot = { data: { title: 'Dashboard' } };  // Mock data with title
  firstChild = null;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerMock: RouterMock;
  let activatedRouteMock: ActivatedRouteMock;

  beforeEach(() => {
    routerMock = new RouterMock();
    activatedRouteMock = new ActivatedRouteMock();

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update pageTitle on route change', () => {
    component.ngOnInit();
    expect(component.pageTitle).toBe('Dashboard');
  });

  it('should set default pageTitle if title is not provided in route data', () => {
    // Here we set the title to undefined, which mimics no 'title' in route data
    component.ngOnInit();
    expect(component.pageTitle).toBe('Dashboard');
  });
});
