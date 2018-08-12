import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
declare var $:any
@Component({
  selector: 'app-auto-comment',
  templateUrl: './auto-comment.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AutoCommentComponent implements OnInit {

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
        this.getDataCommentCategory();
        this.getDataTask();
        this.run();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        this.datatable = (<any>$('#m_datatable_auto')).mDatatable(this.options);

        $(document).on('click', '.play', (event) => {
            this.play($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.pause', (event) => {
            this.pause($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.stop', (event) => {
            this.stop($(event.target).parent().data('element-id'));
        });
    }
    run() {
        setInterval(()=> this.datatable.reload() ,15000);
    }

    createAction() {
        (<any>$('.open_dialog').on('click', () => this.edit(1)));
    }

    form = this._formBuilder.group({
        urlPost: new FormControl('', Validators.required),
        idCommentCategory: new FormControl(''),
        time1: new FormControl('', Validators.required),
        time2: new FormControl('', Validators.required),
        time3: new FormControl('', Validators.required),
        time4: new FormControl('', Validators.required),
        viewCount: new FormControl(''),
        idAccount: new FormControl(''),
        idWeb: new FormControl('1'),
    });
    count = new FormControl(0);
    urlAddAccount = this._callApi.createUrl('account/add');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/all');
    urlGetAccount = this._callApi.createUrl('account/website/1');

    urlGetTask = this._callApi.createUrl('task/all');
    urlEditTask = this._callApi.createUrl('task/edit');
    urlAddTask = this._callApi.createUrl('task/add');
    urlDeleteTask = this._callApi.createUrl('task/delete/');
    urlStopTask = this._callApi.createUrl('task/stop/');
    urlResumeTask = this._callApi.createUrl('task/run/');
    urlPauseTask = this._callApi.createUrl('task/pause/');

    listcommentCategory: any;
    listAccount: any;
    listTask: any;

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            var dataS = {
                'id': 0,
                'idWeb': 1,
                'idAccountPost': this.form.get('idAccount').value,
                'idCommentCategory': this.form.get('idCommentCategory').value,
                'url': this.form.get('urlPost').value,
                'timeSleep': [
                    this.form.get('time1').value,
                    this.form.get('time2').value,
                    this.form.get('time3').value,
                    this.form.get('time4').value
                ],
                'viewCount': this.form.get('viewCount').value || 0
            }
            this._http.post(this.urlAddTask, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
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
    //datatables
    public datatable: any;
    

    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetTask,
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
            field: "STT",
            title: "#",
            sortable: false,
            width: 40,
            selector: {
                class: 'm-checkbox--solid m-checkbox--brand'
            },
            textAlign: 'center'
        }, {
            field: "title",
            title: "Tiêu đề",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "viewNumber",
            title: "Số lượng view",
            width: 100,
            textAlign: 'center'
        },{
            field: "commentNumber",
            title: "Số lượng bình luận",
            width: 100,
            textAlign: 'center'
        },{
            field: "description",
            title: "Tiến trình",
            width: 100,
            textAlign: 'center',
        },{
            field: "status",
            title: "Trạng thái",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                var status = {
                    0: {
                        'title': `<button data-element-id="${row.id}" class="play m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
                        'class': 'm--font-success fa fa-play'
                    },
                    2: {
                        'title': `<button data-element-id="${row.id}" class="play m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
                        'class': 'm--font-success fa fa-play'
                    },
                    1: {
                        'title': `<button data-element-id="${row.id}" class="pause m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Pause"><i class=" fa fa-pause"></i></button>`,
                        'class': 'm--font-success fa fa-pause'
                    },
                    4: {
                        'title': `<button data-element-id="${row.id}" class="stop m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Finish"><i class=" fa fa-stop"></i></button>`,
                        'class': 'm--font-success fa fa-stop'
                    },
                    3: {
                        'title': `<button data-element-id="${row.id}" class="close m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Fail"><i class=" fa fa-close"></i></button>`,
                        'class': 'm--font-success fa fa-close'
                    }
                };
                return status[row.status].title;
            }
        },{
            field: "Actions",
            title: "Sự kiện",
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

    getDataCommentCategory() {
        this._http.get(this.urlGetCommentCategory, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listcommentCategory = data;
        })
    };
    getDataAccount() {
        this._http.get(this.urlGetAccount, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listAccount = data;
        })
    };
    getDataTask() {
        this._http.get(this.urlGetTask, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listTask = data;
        })
    };

    edit(id) {
        console.log(id);
    };
    delete(id) {
        console.log(id);
    };

    play(id) {
        this._http.get(this.urlResumeTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
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
    pause(id) {
        this._http.get(this.urlPauseTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
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
    stop(id) {
        this._http.get(this.urlStopTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
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
