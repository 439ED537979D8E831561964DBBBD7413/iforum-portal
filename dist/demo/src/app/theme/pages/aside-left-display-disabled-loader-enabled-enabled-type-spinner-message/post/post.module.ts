import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { AsideLeftDisplayDisabledLoaderEnabledEnabledTypeSpinnerMessageComponent } from '../aside-left-display-disabled-loader-enabled-enabled-type-spinner-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const changedReq = req.clone({
        headers: req.headers
        .set('Content-Type','application/json')
        .set('Auth-Token', localStorage.getItem('Auth-Token')),
        withCredentials: true
    });
    return next.handle(changedReq);
  }
}
const routes: Routes = [
  {
      "path": "",
      "component": AsideLeftDisplayDisabledLoaderEnabledEnabledTypeSpinnerMessageComponent,
      "children": [
          {
              "path": "",
              "component": PostComponent
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
  ], declarations: [PostComponent]
  ,providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
}],
})
export class PostModule { }
