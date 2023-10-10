import { Directive,HostListener } from '@angular/core';


@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {
@HostListener('drop',['$event'])   // hostListener 2 roles: selects the host element , listen to events
@HostListener('dragover',['$event'])
  public handleEvent(event:Event){
    event.preventDefault()
  }



}
