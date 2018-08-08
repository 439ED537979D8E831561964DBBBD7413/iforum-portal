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

    public urlForum = this._callApi.createUrl('website/all');
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlForum,
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
            field: "url",
            title: "Link",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "name",
            title: "Web",
        }, 
        // {
        //     field: "comment_last",
        //     title: "Detail last comment",
        //     width: 150,
        //     responsive: {
        //         visible: 'lg'
        //     }
        // },{
        //     field: "reply_last",
        //     title: "Detail last reply",
        //     width: 150,
        //     responsive: {
        //         visible: 'lg'
        //     }
        // }
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