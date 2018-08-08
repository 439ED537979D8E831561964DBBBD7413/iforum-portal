import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
        private chRef: ChangeDetectorRef
    ) {

    }
    ngOnInit() {
        this.getDataPostCategory();
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
    summernote: any;
  
    urlPost = this._callApi.createUrl('task/postcategory');
    urlGetCategoryPost = this._callApi.createUrl('postcategory/all');

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            var dataS = {
                'idWeb': 1,
                'content': (<any>$(this.summernote).val()),
                'idCategory': this.form.get('idCategory').value,
                'title': this.form.get('title').value,
                'timeSleep': [
                    this.form.get('time1').value,
                    this.form.get('time2').value,
                    this.form.get('time3').value,
                    this.form.get('time4').value
                ],
                'viewCount': this.form.get('viewCount').value
            }
            this._http.post(this.urlPost, JSON.stringify(dataS), {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    getDataPostCategory() {
        this._http.get(this.urlGetCategoryPost, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listCategory = data;
        })
    }
}
