import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit {

    constructor(
        private _script: ScriptLoaderService,
        private _callApi: CallApiService,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private chRef: ChangeDetectorRef,
        public toastr: ToastsManager,
        private _router: Router,
        vRef: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vRef);
    }
    ngOnInit() {
        this.getDataPostCategory();
        this.getDataCommentCategory();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

        this.summernote = (<any>$('.summernote')).summernote();
        // let tag = (<any>$('.tag').select());
    }

    form = this._formBuilder.group({
        idCategory: new FormControl('', Validators.required),
        idCommentCategory: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        time1: new FormControl('', Validators.required),
        time2: new FormControl('', Validators.required),
        time3: new FormControl('', Validators.required),
        time4: new FormControl('', Validators.required),
        viewCount: new FormControl(''),
        content: new FormControl(''),
        idWeb: new FormControl('1'),
    });

    listCategory: any;
    listCommentCategory: any;
    summernote: any;
  
    urlPost = this._callApi.createUrl('task/postcategory');
    urlGetCategoryPost = this._callApi.createUrl('postcategory/all');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/all');

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            var dataS = {
                'id_web': 1,
                'content': (<any>$(this.summernote).val()),
                'id_category': this.form.get('idCategory').value,
                'id_comment_category': this.form.get('idCommentCategory').value,
                'title': this.form.get('title').value,
                'time_sleeps': [
                    this.form.get('time1').value,
                    this.form.get('time2').value,
                    this.form.get('time3').value,
                    this.form.get('time4').value
                ],
                'view_requirement': this.form.get('viewCount').value
            }
            this._http.post(this.urlPost, JSON.stringify(dataS), {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                    this.toastr.success(data['message'], 'Success!')
                },
                (error) => {
                    if (error.status == 403) {
                        this.toastr.error(error.error['message'], 'Success!')
                        localStorage.removeItem('Auth-Token');
                        this._router.navigate(['/logout']);
                    }
                    this.toastr.error(error.error['message'], 'Oops!')
                }
            );
        }
    }

    getDataPostCategory() {
        this._http.get(this.urlGetCategoryPost, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe(
        (data) => {
            this.listCategory = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Oops!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    }
    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listCommentCategory = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Oops!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        });
    }
}
