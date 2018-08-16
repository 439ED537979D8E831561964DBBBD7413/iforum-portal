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
  selector: 'app-auto-category',
  templateUrl: './auto-category.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AutoCategoryComponent implements OnInit {

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
        // this.getDataWebCategory();
        this.getDataWebCategory(1);
        this.getDataCommentCategory();
        this.getDataWeb();
        this.run();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        this.datatable = (<any>$('#m_datatable_autoc')).mDatatable(this.options);
        $(document).on('click', '.open_dialogaab', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            // $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deleteaab', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
        $(document).on('click', '.playab', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.play(id);
        });
        $(document).on('click', '.stopab', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.stop(id);
        });
    }
    run() {
        setInterval(()=> this.datatable.reload() ,15000);
    }

    createAction() {
        (<any>$('.open_dialog').on('click', () => this.edit(1)));
    }

    form = this._formBuilder.group({
        idCommentCategory: new FormControl(''),
        time1: new FormControl('', Validators.required),
        time2: new FormControl('', Validators.required),
        time3: new FormControl('', Validators.required),
        time4: new FormControl('', Validators.required),
        idWebCategory: new FormControl(''),
        idWeb: new FormControl(''),
    });

    setForm() {
        this.form = this._formBuilder.group({
            idCommentCategory: new FormControl(''),
            time1: new FormControl('', Validators.required),
            time2: new FormControl('', Validators.required),
            time3: new FormControl('', Validators.required),
            time4: new FormControl('', Validators.required),
            idWebCategory: new FormControl(''),
            idWeb: new FormControl(''),
        });
    }
    reset(){
        this.action = 'add';
        this.form = this._formBuilder.group({
            idCommentCategory: new FormControl(''),
            time1: new FormControl('', Validators.required),
            time2: new FormControl('', Validators.required),
            time3: new FormControl('', Validators.required),
            time4: new FormControl('', Validators.required),
            idWebCategory: new FormControl(''),
            idWeb: new FormControl(''),
        });
    }
    urlGetCommentCategory = this._callApi.createUrl('commentcategory/all');
    urlGetWebCategory = this._callApi.createUrl('webcategory/website/');
    urlGetWeb = this._callApi.createUrl('website/all');

    urlGetTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/website/1');
    urlGetTaskByIdAutoCactegory = this._callApi.createUrl('taskwebcategory/id/');
    urlEditTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/edit');
    urlAddTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/add');
    urlDeleteTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/delete/');
    urlStopTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/stop/');
    urlResumeTaskAutoCactegory = this._callApi.createUrl('taskwebcategory/run/');

    listcommentCategory: any;
    listWebCategory: any;
    listWeb: any;

    action = 'add';

    formEdit(id) {
        this.action = 'edit';
        this._http.get(this.urlGetTaskByIdAutoCactegory + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                this.form = this._formBuilder.group({
                    idCommentCategory: new FormControl(''),
                    time1: new FormControl(data['timeSleep'][0], Validators.required),
                    time2: new FormControl(data['timeSleep'][1], Validators.required),
                    time3: new FormControl(data['timeSleep'][2], Validators.required),
                    time4: new FormControl(data['timeSleep'][3], Validators.required),
                    idWebCategory: new FormControl(data['webCategory']['id']),
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
                'idCommentCategory': this.form.get('idCommentCategory').value,
                'idWebCategory': this.form.get('idWebCategory').value,
                'timeSleep': [
                    this.form.get('time1').value,
                    this.form.get('time2').value,
                    this.form.get('time3').value,
                    this.form.get('time4').value
                ]
            }
            this._http.post(this.urlAddTaskAutoCactegory, JSON.stringify(dataS), {
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
                'idCommentCategory': this.form.get('idCommentCategory').value,
                'idWebCategory': this.form.get('idWebCategory').value,
                'timeSleep': [
                    this.form.get('time1').value,
                    this.form.get('time2').value,
                    this.form.get('time3').value,
                    this.form.get('time4').value
                ]
            }
            this._http.post(this.urlEditTaskAutoCactegory, JSON.stringify(dataS), {
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
                    this.form = this._formBuilder.group({
                        idCommentCategory: new FormControl(''),
                        time1: new FormControl('', Validators.required),
                        time2: new FormControl('', Validators.required),
                        time3: new FormControl('', Validators.required),
                        time4: new FormControl('', Validators.required),
                        idWebCategory: new FormControl(''),
                        idWeb: new FormControl(''),
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
        // }
    }

    setValueFormNull() {
        this.chRef.detectChanges();
        this.form = this._formBuilder.group({
            idCommentCategory: new FormControl(''),
            time1: new FormControl('', Validators.required),
            time2: new FormControl('', Validators.required),
            time3: new FormControl('', Validators.required),
            time4: new FormControl('', Validators.required),
            idWebCategory: new FormControl(''),
            idWeb: new FormControl(''),
        });
    }
    //datatables
    public datatable: any;
    

    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetTaskAutoCactegory,
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
            field: "category",
            title: "Loại",
            sortable: 'asc',
            filterable: false,
            template: function(row, index, datatable) {
                return row.webCategory.name;
            }
        }, {
            field: "url",
            title: "Url",
            template: function(row, index, datatable) {
                return row.webCategory.url;
            }
        },{
            field: "description",
            title: "Trạng thái",
            template: function(row, index, datatable) {
                // console.log(row);
                return row.decription;
            }
        },
        // {
        //     // field: "status",
        //     title: "Trạng thái",
        //     sortable: false,
        //     width: 75,
        //     template: function(row, index, datatable) {
        //         var status = {
        //             0: {
        //                 'title': `<button data-element-id="${row.id}" class="playa m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
        //                 'class': 'm--font-success fa fa-play'
        //             },
        //             1: {
        //                 'title': `<button data-element-id="${row.id}" class="stopa m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Finish"><i class=" fa fa-stop"></i></button>`,
        //                 'class': 'm--font-success fa fa-stop'
        //             },
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
                        'title': `<button data-element-id="${row.id}" class="playab m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Run"><i class=" fa fa-play"></i></button>`,
                        'class': 'm--font-success fa fa-play'
                    },
                    1: {
                        'title': `<button data-element-id="${row.id}" class="pauseab m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Pause"><i class=" fa fa-pause"></i></button>`,
                        'class': 'm--font-success fa fa-pause'
                    },
                    2: {
                        'title': `<button data-element-id="${row.id}" class="stopab m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Finish"><i class=" fa fa-stop"></i></button>`,
                        'class': 'm--font-success fa fa-stop'
                    },
                    3: {
                        'title': `<button data-element-id="${row.id}" class="closeab m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Fail"><i class=" fa fa-close"></i></button>`,
                        'class': 'm--font-success fa fa-close'
                    },
                    4: {
                        'title': `
                                    <button  data-element-id="${row.id}" (click)="edit(${row.id})" class="open_dialogaab m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                        <i class="la la-edit"></i>\
                                    </button >\
                                    <button  data-element-id="${row.id}" (click)="delete(${row.id})" class="deleteaab m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
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
                }
                if (row.status === 0 || row.status === 4 || row.status === 2  ) {
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
    getDataWebCategory(id) {
        this._http.get(this.urlGetWebCategory+ id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe((data) => {
            this.listWebCategory = data;
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
    };

    edit(id) {
        console.log(id);
    };
    delete(id) {
        this._http.get(this.urlDeleteTaskAutoCactegory + id, {
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
        this._http.get(this.urlResumeTaskAutoCactegory + id, {
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
    stop(id) {
        this._http.get(this.urlStopTaskAutoCactegory + id, {
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

    onChange(id) {
        this.getDataWebCategory(id);
    }
}
