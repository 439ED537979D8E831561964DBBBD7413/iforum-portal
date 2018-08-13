import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
declare var $:any
@Component({
  selector: 'app-comment-category',
  templateUrl: './comment-category.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CommentCategoryComponent implements OnInit {

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
        // let tag = (<any>$('.tag').select());
        $(document).on('click', '.open_dialog', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.delete', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
    }

    formEdit(id) {
        this._http.get(this.urlGetCommentCategory + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                // var dataParse = JSON.parse(data);
                this.editForm = this._formBuilder.group({
                    e_id: new FormControl(data['id'], Validators.required),
                    e_name: new FormControl(data['name'], Validators.required),
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

    onSubmitEdit() {
        if (!this.editForm.valid) {
            return;
        }
        if (this.editForm.valid) {
            var dataS = {
                id: this.editForm.get('e_id').value,
                name: this.editForm.get('e_name').value,
            }
            this._http.post(this.urlEditCommentCategory, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Sửa thành công', 'Success!')
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
    }

    urlAddCommentCategory = this._callApi.createUrl('commentcategory/add');
    urlEditCommentCategory = this._callApi.createUrl('commentcategory/edit');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/id/');
    urlDeleteCommentCategory = this._callApi.createUrl('commentcategory/delete/');
    urlCommentCategory = this._callApi.createUrl('commentcategory/all');

    form = this._formBuilder.group({
        name: new FormControl('', Validators.required),
        idWeb: new FormControl('1'),
    });

    editForm = this._formBuilder.group({
        e_id: new FormControl('', Validators.required),
        e_name: new FormControl('', Validators.required),
    });

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            this._http.post(this.urlAddCommentCategory, JSON.stringify(this.form.value), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Thêm thành công', 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
                    // this.commentCategory = data;
                    
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

    datatable: any;
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlCommentCategory,
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
        },{
            field: "name",
            title: "Loại",
            textAlign: 'center'
        }, {
            field: "Actions",
            title: "Sự kiện",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return `
                    <button  data-element-id="${row.id}" (click)="edit(${row.id})" class="open_dialog m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </button >\
                    <button  data-element-id="${row.id}" (click)="delete(${row.id})" class="delete m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </button >\
                `;
            }
        }
        ]
    };

    run() {
        setInterval(function() {
            this.datatable.ajax.reload();
        },30000);
    }

    edit(id) {

    }

    delete(id) {
        this._http.get(this.urlDeleteCommentCategory + id, {
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
}
