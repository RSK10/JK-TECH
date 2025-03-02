import { TestBed } from '@angular/core/testing';
import { CommonService } from './common.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

class MessageServiceMock {
  add = jasmine.createSpy('add');
}

describe('CommonService', () => {
  let service: CommonService;
  let messageServiceMock: MessageServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        CommonService,
        { provide: MessageService, useClass: MessageServiceMock }
      ]
    });

    service = TestBed.inject(CommonService);
    messageServiceMock = TestBed.inject(MessageService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should mark required fields as dirty and show a message if any are empty', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('test@example.com', Validators.required),
    });

    service.markRequiredFieldsAsDirty(form);

    expect(form.get('name')?.dirty).toBe(true);
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Mandatory fields cannot be empty',
      key: 'ct',
    });
  });

  it('should not show a message if no required fields are empty', () => {
    const form = new FormGroup({
      name: new FormControl('John Doe', Validators.required),
      email: new FormControl('test@example.com', Validators.required),
    });

    service.markRequiredFieldsAsDirty(form);

    expect(messageServiceMock.add).not.toHaveBeenCalled();
  });

  it('should mark multiple required fields as dirty and show a message if any are empty', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });

    service.markRequiredFieldsAsDirty(form);

    expect(form.get('name')?.dirty).toBe(true);
    expect(form.get('email')?.dirty).toBe(true);
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Mandatory fields cannot be empty',
      key: 'ct',
    });
  });
});
