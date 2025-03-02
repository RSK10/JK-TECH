import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService, AuthService } from 'src/app/service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/common/common.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class DocumentsComponent implements OnInit {

  documents: any = [];

  file: File | null = null;
  documentForm!: FormGroup;
  items: MenuItem[] | undefined;
  selectedDoc: any
  addDocDialog: boolean = false
  @ViewChild('menu') menu: Menu | undefined;
  isSuperUser: boolean = false;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getDocuments();
    this.createForm();
    this.isSuperUser = this.authService.hasRole('super user')

    this.items =
      [
        {
          label: 'Download',
          icon: 'pi pi-download',
          command: () => {
            this.downloadDocument()
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          disabled: this.isSuperUser,
          command: () => {
            this.confirmDelete(this.selectedDoc.id)
          }
        }
      ];
  }

  selectDoc(event: MouseEvent, doc: any) {
    this.selectedDoc = doc;
    this.menu?.toggle(event)
  }

  getDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (documents: any[]) => {
        if(documents){
          this.documents = documents.map((doc, index) => ({ ...doc, srNo: index + 1 }));
        }
       
      },
      error: (err) => {
        // Handle error: for example, log it or set an empty array as a fallback
        console.error('Error loading documents:', err);
        this.documents = []; // Set empty array if the request fails
      }
    });
  
  }

  createForm() {
    this.documentForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required])
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
  confirmDelete(doc: any) {
    this.confirmationService.confirm({
      header: "Are you sure?",
      message: "You won't be able to revert this! action",
      accept: () => {
        this.deleteDocument(doc)
      }
    });
  }

  deleteDocument(id: any) {
    this.documentService.deleteDocument(id).subscribe({
      next: (res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document has been deleted successfully', key: "dm" });
        this.getDocuments();
      }),
      error: (e => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Document could not be deleted Please try later', key: "dm" });
      })
    });

  }

  downloadDocument() {
    const content = "This is a dummy document.";

    const blob = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');


    link.href = URL.createObjectURL(blob);
    link.download = 'dummy_document.txt';

    link.click();

    URL.revokeObjectURL(link.href);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.documentForm.get('fileName')?.setValue(this.file?.name);
  }

  onSave() {
    if (this.file && this.documentForm.valid) {
      var fileObj = {
        "fileName": this.file.name,
        "description": this.documentForm.get('description')?.value,
        "addedBy": this.authService.getLoggedInUser().username
      }
      this.documentService.addDocument(fileObj).subscribe({
        next: (res => {
          this.getDocuments();
          this.documentForm.reset();
          this.file = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document has been added successfully', key: "dm" });
        }),
        error: (e => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Document could not be added Please try later', key: "dm" });
        })
      });

      this.addDocDialog = false
    }
    else {
      this.commonService.markRequiredFieldsAsDirty(this.documentForm)
    }
  }


}
