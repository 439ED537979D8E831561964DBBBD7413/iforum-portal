import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any
@Component({
  selector: 'app-comment-content',
  templateUrl: './comment-content.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CommentContentComponent implements OnInit {

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
  
        
        this.getDataCommentCategory();
        
        this.datatablea = (<any>$('#m_datatable_cc')).mDatatable(this.options);
        this.comment = (<any>$('.comment')).summernote();
        this.reply = (<any>$('.reply')).summernote();

        $(document).on('click', '.open_dialogd', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            // $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deleted', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
        // let tag = (<any>$('.tag').select());
    }

    urlGetCommentCategory = this._callApi.createUrl('comment/all');
    urlGetComment = this._callApi.createUrl('comment/category/');
    urlAddComment = this._callApi.createUrl('comment/add');
    urlEditComment = this._callApi.createUrl('comment/edit');
    urlGetCommentById = this._callApi.createUrl('comment/id/');
    urlDeleteComment = this._callApi.createUrl('comment/delete/');

    commentCategory: any;
    comment: any;
    reply: any;

    action = 'add';

    form = this._formBuilder.group({
        comment: new FormControl(''),
        reply: new FormControl(''),
        idCategory: new FormControl(''),
        id: new FormControl('1'),
    });
    
    formEdit(id) {
        this.action = 'edit';
        this._http.get(this.urlGetCommentById + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                this.form = this._formBuilder.group({
                    comment: new FormControl(data['contentComment']),
                    reply: new FormControl(data['contentReply']),
                    idCategory: new FormControl(data['idCategory']),
                    id: new FormControl(data['id']),
                });
                $('#comment').summernote('code', data['contentComment']);
                $('#reply').summernote('code', data['contentReply']);
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

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid && this.action === 'add') {
            var dataS= {
                'contentComment': (<any>$(this.comment).val()),
                'contentReply': (<any>$(this.reply).val()),
                'idCategory': this.form.get('idCategory').value,
                'id': 1,
            }
            this._http.post(this.urlAddComment, dataS, { 
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Thêm thành công', 'Success!')
                    // this.commentCategory = data;
                    this.chRef.detectChanges();
                    this.datatablea.reload();
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
        // if (!this.editForm.valid) {
        //     return;
        // }
        // if (this.editForm.valid) {
            var dataS= {
                'contentComment': (<any>$(this.comment).val()),
                'contentReply': (<any>$(this.reply).val()),
                'idCategory': this.form.get('idCategory').value,
                'id': this.form.get('id').value,
            }
            this._http.post(this.urlEditComment, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Sửa thành công', 'Success!')
                    this.chRef.detectChanges();
                    this.datatablea.reload();
                    this.action = 'add';
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
        // }
    }

    onChange(value) {
        this.chRef.detectChanges();
        this.datatablea.reload();
        // console.log(this.comment);
        // (<any>$(this.datatable))
    }

    datatablea: any;
    options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetComment + 1,
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
        serverSide: true,
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
            field: "contentComment",
            title: "Nội dung bình luận",
            sortable: 'asc',
        }, {
            field: "contentReply",
            title: "Nội dung trả lời",
            sortable: 'asc',
        }, {
            field: "Actions",
            title: "Sự kiện",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return `
                    <button  data-element-id="${row.id}" class="open_dialogd m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </button >\
                    <button  data-element-id="${row.id}" class="deleted m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </button >\
                `;
            }
        }
        ]
    }
    
    edit(id) {

    }

    delete(id) {
        this._http.get(this.urlDeleteComment + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                
                this.toastr.success('Xóa thành công', 'Success!')
                this.chRef.detectChanges();
                this.datatablea.reload();
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

    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.commentCategory = data;
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
