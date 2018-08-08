import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { AsideLeftDisplayDisabledLoaderEnabledEnabledTypeSpinnerMessageComponent } from '../aside-left-display-disabled-loader-enabled-enabled-type-spinner-message.component';
import { AccountComponent } from './account.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
      "path": "",
      "component": AsideLeftDisplayDisabledLoaderEnabledEnabledTypeSpinnerMessageComponent,
      "children": [
          {
              "path": "",
              "component": AccountComponent
          }
      ]
  }
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ], exports: [
    RouterModule,
  ], declarations: [AccountComponent]
})
export class AccountModule { }
