import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
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
        private chRef: ChangeDetectorRef
    ) {

    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        
        this.getDataCommentCategory();
        
        this.datatablea = (<any>$('#m_datatable_category')).mDatatable(this.options);
        this.comment = (<any>$('.comment')).summernote();
        this.reply = (<any>$('.reply')).summernote();

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
        // let tag = (<any>$('.tag').select());
    }

    urlGetCommentCategory = this._callApi.createUrl('commentcategory/website/1');
    urlGetComment = this._callApi.createUrl('comment/category/');
    urlAddComment = this._callApi.createUrl('comment/add');
    urlEditComment = this._callApi.createUrl('comment/edit');
    urlGetCommentById = this._callApi.createUrl('comment/id/');
    urlDeleteComment = this._callApi.createUrl('comment/delete/');

    commentCategory: any;
    comment: any;
    reply: any;

    e_comment: any;
    e_reply: any;
    e_idCategory: any;
    e_id: any;

    form = this._formBuilder.group({
        comment: new FormControl(''),
        reply: new FormControl(''),
        idCategory: new FormControl(''),
        // idWeb: new FormControl('1'),
    });
    
    formEdit(id) {
        this._http.get(this.urlGetCommentById + id, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe(
            (data) => {
                console.log(data);
                // var dataParse = JSON.parse(data);
                
                this.e_comment = data['contentComment'];
                this.e_reply = data['contentReply'];
                this.e_idCategory = data['idCategory'];
                this.e_id = data['id'];
                (<any>$('#e_comment').summernote({dialogsInBody: true}));
                (<any>$('#e_reply').summernote({dialogsInBody: true}));
            },
            (error) => {
                console.log(error);
            }
        );
        
    }

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            var dataS= {
                'contentComment': (<any>$(this.comment).val()),
                'contentReply': (<any>$(this.reply).val()),
                'idCategory': this.form.get('idCategory').value,
                'id': 1,
            }
            this._http.post(this.urlAddComment, dataS, {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                    console.log(data);
                    // this.commentCategory = data;
                    this.chRef.detectChanges();
                    this.datatablea.reload();
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    onSubmitEdit() {
        // if (!this.editForm.valid) {
        //     return;
        // }
        // if (this.editForm.valid) {
            var dataS= {
                'contentComment': (<any>$(this.e_comment).val()),
                'contentReply': (<any>$(this.e_reply).val()),
                'idCategory': this.form.get('e_idCategory').value,
                'id': this.form.get('e_id').value,
            }
            this._http.post(this.urlEditComment, JSON.stringify(dataS), {
                headers: { 'Content-Type': 'application/json'}
            }).subscribe(
                (data) => {
                    this.chRef.detectChanges();
                    this.datatablea.reload();
                },
                (error) => {
                    console.log(error);
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
            title: "Comment Content",
            sortable: 'asc',
        }, {
            field: "contentReply",
            title: "Reply content",
            sortable: 'asc',
        }, {
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
    
    edit(id) {

    }

    delete(id) {
        this._http.get(this.urlDeleteComment + id, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe(
            (data) => {
                this.chRef.detectChanges();
                this.datatablea.reload();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 'Content-Type': 'application/json'}
        }).subscribe((data) => {
            this.commentCategory = data;
        })
    }
  
}
