import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { CallApiService } from '../../../_services/call-api.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: "app-website",
    templateUrl: "./website.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class WebsiteComponent implements OnInit, AfterViewInit {

    constructor(
        private _script: ScriptLoaderService,
        private _callApi: CallApiService,
        public toastr: ToastsManager,
        private _router: Router,
        vRef: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    public urlForum = this._callApi.createUrl('website/all');
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
            field: "name",
            title: "Name",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "url",
            title: "Url",
            sortable: 'asc',
        }
    ]
    }

    
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

        let datatable = (<any>$('#m_datatable_w')).mDatatable(this.options);
        // (<any>$.ajax({
        //     url: this.urlForum,
        //     context: document.body
        //   }).done(function() {
        //     $( this ).addClass( "done" );
        //   }
        // ))
    }
}