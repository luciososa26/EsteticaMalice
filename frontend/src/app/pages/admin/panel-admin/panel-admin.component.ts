import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss'],
})
export class PanelAdminComponent {}
