import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WebsiteComponent } from './website.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { AsideLeftDisplayDisabledLoaderEnabledEnabledTypeSpinnerMessageComponent } from '../aside-left-display-disabled-loader-enabled-enabled-type-spinner-message.component';
import { HTTP_INTERCEPTORS, HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { TokenInterceptor } from '../../../_services/intercepter';
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
                "component": WebsiteComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule
    ], exports: [
        RouterModule
    ], declarations: [
        WebsiteComponent
    ],providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: NoopInterceptor,
        multi: true,
    }],
})
export class WebsiteModule {
}

