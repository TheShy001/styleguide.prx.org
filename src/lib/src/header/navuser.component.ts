import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'prx-navuser',
  styleUrls: [
    './navitem.component.css',
    './navuser.component.css'
  ],
  template: `
    <div class="nav-holder">
      <ng-template [ngIf]="userName">
        <a *ngIf="userName">
          <span class="name">{{userName}}</span>
          <ng-content select=".user-loaded"></ng-content>
        </a>
      </ng-template>
      <div *ngIf="!userName" class="spin-holder">
        <ng-content select=".user-loading"></ng-content>
      </div>
    </div>
    `
})

export class NavUserComponent {
  @Input() userName: string;
}
