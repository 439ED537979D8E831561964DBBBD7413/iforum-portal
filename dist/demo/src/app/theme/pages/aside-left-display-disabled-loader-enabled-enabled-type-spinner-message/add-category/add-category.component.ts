import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddCategoryComponent implements OnInit {

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

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

        this.datatable = (<any>$('#m_datatable_category')).mDatatable(this.options);
        // this.desc = (<any>$('.summernote')).summernote();
        // let tag = (<any>$('.tag').select());
    }

    form = this._formBuilder.group({
        name: new FormControl('', Validators.required),
    });

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            var dataS = {
                'name': this.form.get('name').value,
                'description': (<any>$(this.desc).val())
            };
            this._http.post(this.urlAddCategoryPost, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    
                    this.toastr.success('Thêm thành công', 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
                    this.setValueFormNull();
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

    setValueFormNull() {
        this.chRef.detectChanges();
        this.form.setValue({
            'name': ''
        });
        (<any>$(this.desc).val(''))
    }

    urlGetCategoryPost = this._callApi.createUrl('postcategory/all');
    urlAddCategoryPost = this._callApi.createUrl('postcategory/add');
    urlDeleteCategoryPost = this._callApi.createUrl('postcategory/delete/');
    
    datatable: any;
    desc: any;
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetCategoryPost,
                    method: 'GET',
                    headers: { 
                        'Auth-Token': localStorage.getItem('Auth-Token')
                    }
                }
            },
            pageSize: 10,
            saveState: {
                cookie: false,
                webstorage: true
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        },

        layout: {
            theme: 'default',
            class: '',
            scroll: true,
            height: 380,
            footer: false
        },

        sortable: true,

        filterable: false,

        pagination: true,

        columns: [{
            field: "id",
            title: "#",
            sortable: false,
            width: 40,
            selector: {
                class: 'm-checkbox--solid m-checkbox--brand'
            },
            textAlign: 'center'
        }, {
            field: "name",
            title: "Category",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "description",
            title: "Description",
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return '\
                    <span (click)="edit('+row.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </span>\
                    <span (click)="delete('+row.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </span>\
                ';
            }
        }
        ]
    }

    edit(id) {

    }

    delete(id) {

    }
  
}
