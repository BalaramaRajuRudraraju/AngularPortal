import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  private selectedSection = new BehaviorSubject<string>('default message');
  selectedSection$ = this.selectedSection.asObservable();

  pushSelection = (selectedValue: string): void => {
    this.selectedSection.next(selectedValue);
  }

  constructor() { }
}
