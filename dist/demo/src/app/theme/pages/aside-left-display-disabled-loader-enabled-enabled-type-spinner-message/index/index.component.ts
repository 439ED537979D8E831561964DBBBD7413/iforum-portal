import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { CallApiService } from '../../../_services/call-api.service';


@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {

    constructor(
        private _script: ScriptLoaderService,
        private _callApi: CallApiService
    ) {}

    public urlForum = this._callApi.createUrl('task/all');
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlForum,
                    method: 'GET',
                    headers: {
                        'Auth-Token': localStorage.getItem('Auth-Token')
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                }
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },

        xhrFields: {
            withCredentials: true
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
            field: "url",
            title: "Link",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "title",
            title: "Web",
            template: function(row, index, datatable) {
                var matches = row.url.match('^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)');
                var domain = matches && matches[1];
                console.log(domain)
                return domain;
            }
        },{
            field: "comment_last",
            title: "Bình luận cuối",
            template: function(row, index, datatable) {
                var ct = row.commentTasks[0];
                if (!ct) {
                    return '';
                }
                if (ct.status != 2) {
                    return ct.comment.contentComment;
                }
                return ct.accountComment.username +' - '+ ct.description;
            }
        },{
            field: "replyt_last",
            title: "Trả lời cuối",
            sortable: false,
            template: function(row, index, datatable) {
                var ct = row.commentTasks[0];
                if (!ct) {
                    return '';
                }
                if (ct.status === 1) {
                    return ct.comment.contentReply;
                }
                if (ct.status === 2) {
                    return '';
                }
                return ct.description;
            }
        },
    ]
    }

    
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

        let datatable = (<any>$('#m_datatable_forum')).mDatatable(this.options);
        // (<any>$.ajax({
        //     url: this.urlForum,
        //     context: document.body
        //   }).done(function() {
        //     $( this ).addClass( "done" );
        //   }
        // ))
    }
}