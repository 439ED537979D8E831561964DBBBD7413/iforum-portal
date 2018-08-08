import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var $:any

@Component({
  selector: 'app-enter-category',
  templateUrl: './enter-category.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EnterCategoryComponent implements OnInit {

    constructor(
        private _script: ScriptLoaderService,
        private _callApi: CallApiService,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private chRef: ChangeDetectorRef
    ) {

    }
    ngOnInit() {
        this.getDataAccount();
        this.getDataCategory();
        this.getDataCommentCategory();
        this.getDataWeb();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        this.datatable = (<any>$('#m_datatable_category')).mDatatable(this.options);
        
        $(document).on('click', '.open_dialoga', (event) => {
            console.log($(event.target).parent().data('element-id'));
            this.formEdit($(event.target).parent().data('element-id'));
            $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deletea', (event) => {
            console.log($(event.target).parent().data('element-id'));
            this.delete($(event.target).parent().data('element-id'));
        });
    }
    form = this._formBuilder.group({
        urlPost: new FormControl('', Validators.required),
        idCategory: new FormControl('',Validators.required),
        accountPost: new FormControl('', Validators.required),
        commentCategory: new FormControl('',Validators.required),
        idWeb: new FormControl('1'),
    });

    editForm = this._formBuilder.group({
        e_name: new FormControl('', Validators.required),
    });

    urlGetLinkPost = this._callApi.createUrl('linkpost/all');
    urlGetLinkPostById = this._callApi.createUrl('linkpost/id/');
    urlAddLinkPost = this._callApi.createUrl('linkpost/add');
    urlEditLinkPost = this._callApi.createUrl('linkpost/edit');
    urlDeleteLinkPost = this._callApi.createUrl('linkpost/delete');
    
    urlGetAccount = this._callApi.createUrl('account/website/1');
    urlGetWeb = this._callApi.createUrl('website/all');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/website/1');
    urlGetCategory = this._callApi.createUrl('postcategory/all');

    listAccount: any;
    listWeb: any;
    listCommentCategory: any;
    listCategory: any;

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            this._http.post(this.urlAddLinkPost, JSON.stringify(this.form.value), {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                    this.chRef.detectChanges();
                    this.datatable.reload();
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
    onSubmitEdit() {
            var dataS= {
                'idCategory': this.form.get('e_idCategory').value,
                'id': this.form.get('e_id').value,
            }
            this._http.post(this.urlEditLinkPost, JSON.stringify(dataS), {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                    this.chRef.detectChanges();
                    this.datatable.reload();
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    formEdit(id) {
        this._http.get(this.urlGetLinkPostById + id, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe(
            (data) => {
                console.log(data);
                // var dataParse = JSON.parse(data);
                this.editForm = this._formBuilder.group({
                    e_name: new FormControl(data['name'], Validators.required),
                });
            },
            (error) => {
                console.log(error);
            }
        );
        
    }

    delete(id) {

    }
    //datatables
    public datatable: any;
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetLinkPost,
                    method: 'GET'
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
            field: "urlPost",
            title: "Link Post",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "accountPost",
            title: "Account",
            template: function(row, index, datatable) {
                return `<span>${row.accountPost.username}</span>`;
            }
        },{
            field: "commentCategory",
            title: "Category",
            template: function(row, index, datatable) {
                return `<span>${row.commentCategory.name}</span>`;
            }
        },{
            field: "Actions",
            title: "Actions",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return `
                    <button  data-element-id="${row.id}" (click)="edit(${row.id})" class="open_dialoga m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </button >\
                    <button  data-element-id="${row.id}" (click)="delete(${row.id})" class="deletea m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </button >\
                `;
            }
        }
        ]
    }

    getDataAccount() {
        this._http.get(this.urlGetAccount, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listAccount = data;
        })
    }

    getDataWeb() {
        this._http.get(this.urlGetWeb, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listWeb = data;
        })
    }

    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listCommentCategory = data;
        })
    }

    getDataCategory() {
        this._http.get(this.urlGetCategory, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.listCategory = data;
        })
    }
}
