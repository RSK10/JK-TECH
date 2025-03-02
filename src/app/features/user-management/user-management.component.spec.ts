import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsComponent } from '../documents/documents.component';
import { DocumentService, AuthService } from 'src/app/service';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MessageService, ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  let documentService: jasmine.SpyObj<DocumentService>;
  let authService: jasmine.SpyObj<AuthService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;
  let commonService: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    const documentServiceSpy = jasmine.createSpyObj('DocumentService', ['getDocuments', 'addDocument', 'deleteDocument']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole', 'getLoggedInUser']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['markRequiredFieldsAsDirty']);

    await TestBed.configureTestingModule({
      declarations: [DocumentsComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    confirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load documents on init', () => {
    const documents = [{ id: 1, description: 'Document 1' }, { id: 2, description: 'Document 2' }];
    documentService.getDocuments.and.returnValue(of(documents));

    component.getDocuments();

    expect(component.documents.length).toBe(2);
    expect(component.documents[0].srNo).toBe(1);
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('should handle error while loading documents', () => {
    documentService.getDocuments.and.returnValue(throwError(() => new Error('Error loading documents')));

    component.getDocuments();

    expect(component.documents.length).toBe(0);
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('should call addDocument when onSave is called with valid form', () => {
    const file = new File([''], 'document.txt');
    component.file = file;
    component.documentForm.controls['description'].setValue('Sample Document');
    component.documentForm.controls['fileName'].setValue(file.name);
    documentService.addDocument.and.returnValue(of({}));

    component.onSave();

    expect(documentService.addDocument).toHaveBeenCalledWith({
      id: "test",
      fileName: "test.pdf",
      description: "Document 1",
      addedBy: "testuser"
    });
    expect(component.documentForm.reset).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Document has been added successfully', key: 'dm' });
  });

  it('should not call addDocument when onSave is called with invalid form', () => {
    const file = new File([''], 'document.txt');
    component.file = file;
    component.documentForm.controls['description'].setValue('');
    component.documentForm.controls['fileName'].setValue('');

    component.onSave();

    expect(documentService.addDocument).not.toHaveBeenCalled();
    expect(commonService.markRequiredFieldsAsDirty).toHaveBeenCalledWith(component.documentForm);
  });

  it('should call confirmDelete when trying to delete a document', () => {
    const doc = {
      id: 1,
      fileName: "test.pdf",
      description: "Document 1",
      addedBy: "testuser"
    };
    component.selectedDoc = doc;
    confirmationService.confirm.and.callFake((config: any) => config.accept());

    component.confirmDelete(doc);

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(documentService.deleteDocument).toHaveBeenCalledWith(doc.id);
  });

  it('should display success message when document is deleted', () => {
    const doc = { id: 1, fileName: "test.pdf", description: "Document 1", addedBy: "testuser" };
    component.selectedDoc = doc;
    documentService.deleteDocument.and.returnValue(of({}));

    component.deleteDocument(doc.id);

    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Document has been deleted successfully', key: 'dm' });
  });

  it('should display error message when document deletion fails', () => {
    const doc = { id: 1, description: 'Sample Document' };
    component.selectedDoc = doc;
    documentService.deleteDocument.and.returnValue(throwError(() => new Error('Error deleting document')));

    component.deleteDocument(doc.id);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Document could not be deleted Please try later',
      key: 'dm'
    });
  });

  it('should trigger file selection on file input change', () => {
    const event = { target: { files: [new File([''], 'document.txt')] } };
    component.onFileSelected(event);

    expect(component.file?.name).toBe('document.txt');
    expect(component.documentForm.get('fileName')?.value).toBe('document.txt');
  });

  it('should disable delete option for super users', () => {
    authService.hasRole.and.returnValue(true);

    component.ngOnInit();

    expect(component.items![1].disabled).toBeTrue();
  });

  it('should enable delete option for non-super users', () => {
    authService.hasRole.and.returnValue(false);

    component.ngOnInit();

    expect(component.items![1].disabled).toBeFalse();
  });
});
