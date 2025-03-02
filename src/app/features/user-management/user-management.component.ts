import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, UserService } from 'src/app/service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [MessageService, ConfirmationService, DatePipe]
})
export class UserManagementComponent implements OnInit {
  [x: string]: any;

  showActionButtons!: boolean;
  users: any = [];
  modalTitle = "Add User";
  userForm!: FormGroup;
  items: MenuItem[] | undefined;
  selectedUser: any
  roleOptions: any = []
  @ViewChild('menu') menu: Menu | undefined;
  addUserDialogVisible: boolean = false
  editSidebarVisible: boolean = false;
  currentDate: any
  isRoleReadOnly: boolean = false
  isSuperUser: boolean = false

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm:ss a')
    this.showActionButtons = this.authService.hasRole('admin');
    this.isSuperUser = this.authService.hasRole('super user')
    this.getUsers();
    this.createForm();

    this.roleOptions = [
      { name: 'User', value: 'user' },
      { name: 'Super User', value: 'super user' },
      { name: 'Admin', value: 'admin' }
    ]
    this.items =
      [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            this.openEditUserModal(this.selectedUser.id)
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            if (this.selectedUser.role == 'admin') {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Admin user cannot be deleted',
                key: 'um'
              });
            }
            else {
              this.confirmDelete(this.selectedUser)
            }
          },
          disabled: this.isSuperUser
        }
      ];
  }

  createForm() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      role: new FormControl({ name: 'User' }, [Validators.required]),
      id: new FormControl('', [Validators.required]),
      createdDate: new FormControl(),
      modifiedDate: new FormControl(this.currentDate),
      description: new FormControl('')
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res => {
        this.users = res;
      }),
      error: (e => {
        console.log(e.error);
      })
    });
  }

  selectUser(event: MouseEvent, user: any) {
    this.selectedUser = user; // Capture the row data (product)
    this.menu?.toggle(event)
  }

  onSave(event: any) {
    if (event) {
      this.addUserDialogVisible = false
      this.getUsers();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New user has been added successfully',
        key: 'um'
      });
    }
  }

  openEditUserModal(userId: number) {
    this.editSidebarVisible = true
    this.userService.getUser(userId).subscribe({
      next: (res => {
        this.userForm.get('email')?.setValue(res.email);
        this.userForm.get('username')?.setValue(res.username);
        this.userForm.get('role')?.setValue(this.getRoleObject(res.role));
        this.userForm.get('id')?.setValue(res.id);
        this.userForm.get('createdDate')?.setValue(res.createdDate);
        this.userForm.get('modifiedDate')?.setValue(this.currentDate);
        this.userForm.get('password')?.setValue(res.password),
          this.userForm.get('description')?.setValue(res.description)

        if (res.role == 'admin' || this.isSuperUser) {
          this.isRoleReadOnly = true
        }
        else {
          this.isRoleReadOnly = false
        }
      }),
      error: (e => {
        console.log(e.error);
      })
    })
  }

  getRoleObject(role: string) {
    return this.roleOptions.find((option: any) => option.value === role) || null;
  }

  editUser() {
    if (this.userForm.invalid) {
      return
    }
    else {
      const selectedRole = this.userForm.get('role')?.value;

      if (selectedRole && typeof selectedRole === 'object') {
        this.userForm.get('role')?.setValue(selectedRole.value);
      }
      this.userService.editUser(this.userForm.value).subscribe({
        next: (res => {
          this.editSidebarVisible = false
          this.getUsers();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully', key: "um" });
        }),
        error: (e => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User could not be added Please try later', key: "um" });
        })
      })
    }
  }

  confirmDelete(user: any) {
    this.confirmationService.confirm({
      header: "This action will delete the user with the username " + "'" + user.username + "'" + " ",
      message: 'Do you want to proceed?',
      accept: () => {
        this.deleteUser(user.id)
      }
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: (res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User has been deleted successfully', key: "um" });
        this.getUsers();
      }),
      error: (e => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User could not be deleted Please try later', key: "um" });
      })
    });

  }
}
