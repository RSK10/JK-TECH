import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor(private messageService: MessageService) { }

  markRequiredFieldsAsDirty(form: any) {
    let controlArray: any = []
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control && control.hasError('required')) {
        controlArray.push(control)
        control.markAsDirty();
      }
    });
    if (controlArray.length > 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Mandatory fields cannot be empty', key: "ct" });
    }

  }
}

