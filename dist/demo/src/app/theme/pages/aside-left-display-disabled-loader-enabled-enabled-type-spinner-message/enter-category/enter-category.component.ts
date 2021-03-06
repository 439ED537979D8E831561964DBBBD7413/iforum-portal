import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var $:any
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
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
        private chRef: ChangeDetectorRef,
        public toastr: ToastsManager,
        private _router: Router,
        vRef: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vRef);
    }
    ngOnInit() {
        // this.getDataAccount();
        this.getDataCategory();
        // this.getDataCommentCategory();
        this.getDataWeb();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        this.datatable = (<any>$('#m_datatable_ec')).mDatatable(this.options);
        
        $(document).on('click', '.open_dialoge', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deletee', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
    }
    form = this._formBuilder.group({
        urlPost: new FormControl('', Validators.required),
        idCategory: new FormControl('',Validators.required),
        // accountPost: new FormControl('', Validators.required),
        // commentCategory: new FormControl('',Validators.required),
        idWeb: new FormControl('',Validators.required),
    });

    editForm = this._formBuilder.group({
        e_urlPost: new FormControl('', Validators.required),
        e_idCategory: new FormControl(null),
        e_idWeb: new FormControl(null),
    });

    urlGetLinkPost = this._callApi.createUrl('linkpost/all');
    urlGetLinkPostById = this._callApi.createUrl('linkpost/id/');
    urlAddLinkPost = this._callApi.createUrl('linkpost/add');
    urlEditLinkPost = this._callApi.createUrl('linkpost/edit');
    urlDeleteLinkPost = this._callApi.createUrl('linkpost/delete/');
    
    urlGetAccount = this._callApi.createUrl('account/website/1');
    urlGetWeb = this._callApi.createUrl('website/all');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/website/1');
    urlGetCategory = this._callApi.createUrl('postcategory/all');

    listAccount: any;
    listWeb: any;
    listCommentCategory: any;
    listCategory: any;

    idCactegory = 1;
    action = 'add';
    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid && this.action === 'add') {
            this._http.post(this.urlAddLinkPost, JSON.stringify(this.form.value), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Thêm thành công', 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
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
        if (this.form.valid && this.action === 'edit') {
            this.onSubmitEdit();
        }
    }
    onSubmitEdit() {
            var dataS= {
                'urlPost': this.form.get('urlPost').value,
                'idCategory': this.form.get('idCategory').value,
                'idWeb': this.form.get('idWeb').value,
                'id': this.form.get('id').value,
            }
            this._http.post(this.urlEditLinkPost, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    
                    this.toastr.success(data['message'], 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
                    this.action = 'add';
                    this.form = this._formBuilder.group({
                        urlPost: new FormControl('', Validators.required),
                        idCategory: new FormControl('', Validators.required),
                        idWeb: new FormControl('', Validators.required),
                    });
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

    formEdit(id) {
        this.action = 'edit';
        this._http.get(this.urlGetLinkPostById + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                // var dataParse = JSON.parse(data);
                this.form = this._formBuilder.group({
                    urlPost: new FormControl(data['urlPost'], Validators.required),
                    idCategory: new FormControl(data['idCategory'], Validators.required),
                    idWeb: new FormControl(data['idWeb'], Validators.required),
                    id: new FormControl(data['id'], Validators.required),
                });
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

    delete(id) {
        this._http.get(this.urlDeleteLinkPost + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                
                this.toastr.success('Xóa thành công', 'Success!')
                this.chRef.detectChanges();
                this.datatable.reload();
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

    onChange(value) {
        this.idCactegory = 1;
        this.chRef.detectChanges();
        
        this.datatable.reload();
    }
    //datatables
    public datatable: any;
    linkPosCategory = this.urlGetLinkPost;
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.linkPosCategory,
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
            field: "urlPost",
            title: "Link đăng tin",
            sortable: 'asc',
            filterable: false,
        }, 
        // {
        //     field: "accountPost",
        //     title: "Tài khoản",
        //     template: function(row, index, datatable) {
        //         return `<span>${row.accountPost.username}</span>`;
        //     }
        // },
        // {
        //     field: "commentCategory",
        //     title: "Loại",
        //     template: function(row, index, datatable) {
        //         return `<span>${row.commentCategory.name}</span>`;
        //     }
        // },
        {
            field: "Actions",
            title: "Sự kiện",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return `
                    <button  data-element-id="${row.id}" (click)="edit(${row.id})" class="open_dialoge m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </button >\
                    <button  data-element-id="${row.id}" (click)="delete(${row.id})" class="deletee m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </button >\
                `;
            }
        }
        ]
    }

    getDataAccount() {
        this._http.get(this.urlGetAccount, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listAccount = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    }

    getDataWeb() {
        this._http.get(this.urlGetWeb, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listWeb = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    }

    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listCommentCategory = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    }

    getDataCategory() {
        this._http.get(this.urlGetCategory, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listCategory = data;
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    }
}
