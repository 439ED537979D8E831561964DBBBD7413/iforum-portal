import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
declare var $:any
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
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
        private chRef: ChangeDetectorRef,
        public toastr: ToastsManager,
        private _router: Router,
        vRef: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vRef);
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
        $(document).on('click', '.open_dialogaa', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            // $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deleteaa', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
        $(document).on('click', '.playa', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.play(id);
        });
        $(document).on('click', '.pausea', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.pause(id);
        });
        $(document).on('click', '.stopa', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.stop(id);
        });
    }
    run() {
        setInterval(()=> this.datatable.reload() ,5000);
    }

    createAction() {
        (<any>$('.open_dialog').on('click', () => this.edit(1)));
    }

    form = this._formBuilder.group({
        urlPost: new FormControl('', Validators.required),
        idCommentCategory: new FormControl(''),
        time1: new FormControl(''),
        time2: new FormControl(''),
        time3: new FormControl(''),
        time4: new FormControl(''),
        viewCount: new FormControl(''),
        idAccount: new FormControl(''),
        idWeb: new FormControl('1'),
    });
    count = new FormControl(0);
    urlAddAccount = this._callApi.createUrl('account/add');
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/all');
    urlGetAccount = this._callApi.createUrl('account/website/1');

    urlGetTask = this._callApi.createUrl('task/all');
    urlGetTaskById = this._callApi.createUrl('task/id/');
    urlEditTask = this._callApi.createUrl('task/edit');
    urlAddTask = this._callApi.createUrl('task/add');
    urlDeleteTask = this._callApi.createUrl('task/delete/');
    urlStopTask = this._callApi.createUrl('task/stop/');
    urlResumeTask = this._callApi.createUrl('task/run/');
    urlPauseTask = this._callApi.createUrl('task/pause/');

    listcommentCategory: any;
    listAccount: any;
    listTask: any;

    action = 'add';

    formEdit(id) {
        this.action = 'edit';
        this._http.get(this.urlGetTaskById + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                this.form = this._formBuilder.group({
                    urlPost: new FormControl(data['url'], Validators.required),
                    idCommentCategory: new FormControl(data['idCommentCategory']),
                    time1: new FormControl(''),
                    time2: new FormControl(''),
                    time3: new FormControl(''),
                    time4: new FormControl(''),
                    viewCount: new FormControl(data['viewCount']),
                    idAccount: new FormControl(data['idAccount']),
                    idWeb: new FormControl(data['idWeb']),
                    id: new FormControl(data['id']),
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

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid && this.action === 'add') {
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
        // if (!this.editForm.valid) {
        //     return;
        // }
        // if (this.editForm.valid) {
            var dataS = {
                'id': this.form.get('id').value,
                'idWeb': this.form.get('idWeb').value,
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
            this._http.post(this.urlEditTask, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Sửa thành công', 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
                    this.setValueFormNull();
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
    reset(){
        this.action = 'add';
        this.form = this._formBuilder.group({
            urlPost: new FormControl('', Validators.required),
            idCommentCategory: new FormControl(''),
            time1: new FormControl(''),
            time2: new FormControl(''),
            time3: new FormControl(''),
            time4: new FormControl(''),
            viewCount: new FormControl(''),
            idAccount: new FormControl(''),
            idWeb: new FormControl('1'),
        });
    }
    setValueFormNull() {
        this.chRef.detectChanges();
        this.form = this._formBuilder.group({
            urlPost: new FormControl('', Validators.required),
            idCommentCategory: new FormControl(''),
            time1: new FormControl(''),
            time2: new FormControl(''),
            time3: new FormControl(''),
            time4: new FormControl(''),
            viewCount: new FormControl(''),
            idAccount: new FormControl(''),
            idWeb: new FormControl('1'),
        });
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
            title: "Link - Tiêu đề",
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
            title: "Trạng thái",
            width: 100,
            textAlign: 'center',
        },
        // {
        //     field: "status",
        //     title: "Trạng thái",
        //     sortable: false,
        //     width: 75,
        //     template: function(row, index, datatable) {
        //         var status = {
        //             0: {
        //                 'title': `<button data-element-id="${row.id}" class="play m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
        //                 'class': 'm--font-success fa fa-play'
        //             },
        //             1: {
        //                 'title': `<button data-element-id="${row.id}" class="pause m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Pause"><i class=" fa fa-pause"></i></button>`,
        //                 'class': 'm--font-success fa fa-pause'
        //             },
        //             2: {
        //                 'title': `<button data-element-id="${row.id}" class="stop m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Finish"><i class=" fa fa-stop"></i></button>`,
        //                 'class': 'm--font-success fa fa-stop'
        //             },
        //             3: {
        //                 'title': `<button data-element-id="${row.id}" class="close m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Fail"><i class=" fa fa-close"></i></button>`,
        //                 'class': 'm--font-success fa fa-close'
        //             }
        //         };
        //         return status[row.status].title;
        //     }
        // },
        {
            field: "Actions",
            title: "Sự kiện",
            sortable: false,
            template: function(row, index, datatable) {
                var status = {
                    0: {
                        'title': `<button data-element-id="${row.id}" class="playa m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
                        'class': 'm--font-success fa fa-play'
                    },
                    1: {
                        'title': `<button data-element-id="${row.id}" class="pausea m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Pause"><i class=" fa fa-pause"></i></button>`,
                        'class': 'm--font-success fa fa-pause'
                    },
                    2: {
                        'title': `<button data-element-id="${row.id}" class="stopa m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Finish"><i class=" fa fa-stop"></i></button>`,
                        'class': 'm--font-success fa fa-stop'
                    },
                    3: {
                        'title': `<button data-element-id="${row.id}" class="closea m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Fail"><i class=" fa fa-close"></i></button>`,
                        'class': 'm--font-success fa fa-close'
                    },
                    4: {
                        'title': `
                                    <button  data-element-id="${row.id}" class="open_dialogaa m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                        <i class="la la-edit"></i>\
                                    </button >\
                                    <button  data-element-id="${row.id}" class="deleteaa m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                                        <i class="la la-trash"></i>\
                                    </button >\
                                `,
                        'class': 'm--font-success fa fa-close'
                    }
                };
                var temp = '';
                if (row.status === 3) {
                    temp += status[3].title + status[4].title;
                    return temp;
                }
                if (row.status === 1) {
                    temp += status[2].title;
                    temp += status[1].title;
                }
                if (row.status === 0 || row.status === 4 || row.status === 2  ) {
                    temp += status[2].title;
                    temp += status[0].title;
                }
                if (row.status === 0 || row.status === 2) {
                    temp += status[4].title;
                }
                return temp;
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
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
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
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
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
        },
        (error) => {
            if (error.status == 403) {
                this.toastr.error(error.error['message'], 'Success!')
                localStorage.removeItem('Auth-Token');
                this._router.navigate(['/logout']);
            }
            this.toastr.error(error.error['message'], 'Oops!')
        })
    };

    edit(id) {
        console.log(id);
    };
    delete(id) {
        this._http.get(this.urlDeleteTask + id, {
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

    play(id) {
        this._http.get(this.urlResumeTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                this.toastr.success('Run thành công', 'Success!')
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
    pause(id) {
        this._http.get(this.urlPauseTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                this.toastr.success('Dừng thành công', 'Success!')
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
    stop(id) {
        this._http.get(this.urlStopTask + id, {
            headers: { 
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                this.toastr.success('Stop thành công', 'Success!')
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
