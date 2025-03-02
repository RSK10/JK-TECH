import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { RouterModule, Routes } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let messageServiceMock: MessageService;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['Authenticated$']);
    const authenticatedSubject = new BehaviorSubject<boolean>(false); 
    authServiceSpy.Authenticated$ = authenticatedSubject.asObservable();
    messageServiceMock = new MessageService();


    await TestBed.configureTestingModule({
      imports:[        
        ReactiveFormsModule , 
        CardModule,
        InputTextModule,
        FloatLabelModule,
        ButtonModule,
        ToastModule,
        PasswordModule,
        RouterModule,
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceMock },

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAuthenticated to true when Authenticated$ emits true', () => {
   
    (authService.Authenticated$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges(); 

    expect(component.isAuthenticated).toBeTrue();
  });

  it('should set isAuthenticated to false when Authenticated$ emits false', () => {
    
    (authService.Authenticated$ as BehaviorSubject<boolean>).next(false);
    fixture.detectChanges(); 

    expect(component.isAuthenticated).toBeFalse();
  });

  it('should subscribe to the AuthService Authenticated$ observable in ngOnInit', () => {
    spyOn(authService.Authenticated$, 'subscribe');
    fixture.detectChanges(); 

    expect(authService.Authenticated$.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe from AuthService Authenticated$ observable in ngOnDestroy', () => {
    spyOn(component['authStatusSubscription'], 'unsubscribe');
    component.ngOnDestroy();

    expect(component['authStatusSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should display sidebar correctly when sidebarVisible is true', () => {
    component.sidebarVisible = true;
    fixture.detectChanges();
    
    const sidebar = fixture.debugElement.query(By.css('.sidebar'));
    expect(sidebar).toBeTruthy();  
  });

  it('should not display sidebar when sidebarVisible is false', () => {
    component.sidebarVisible = false;
    fixture.detectChanges();

    const sidebar = fixture.debugElement.query(By.css('.sidebar'));
    expect(sidebar).toBeFalsy();  
  });
});
