import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CallApiService } from '../../../_services/call-api.service';
import { HttpClient } from '@angular/common/http';
// import * as swal from 'sweetalert2';
declare var $:any
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnInit {
    
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
        // this.run();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);

        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

        this.datatable = (<any>$('#m_datatable_account')).mDatatable(this.options);

        $(document).on('click', '.open_dialogacc', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            this.formEdit(id);
            $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.deleteacc', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.deletea(id);
        });
    }

    run() {
        // this.chRef.detectChanges();
        setInterval(()=> this.datatable.reload() ,5000);
    }
    
    public isShow = false;
    //form
    form = this._formBuilder.group({
        username: new FormControl('', Validators.required),
        email: new FormControl(''),
        password: new FormControl('', Validators.required),
        status: new FormControl(''),
        idWeb: new FormControl('1'),
    });

    editForm = this._formBuilder.group({
        e_username: new FormControl('', Validators.required),
        e_email: new FormControl(''),
        e_password: new FormControl('', Validators.required),
        e_status: new FormControl(''),
        e_idWeb: new FormControl('1'),
        e_id: new FormControl(''),
    });
    
    formEdit(id) {
        this._http.get(this.urlGetAccount + id, {
            headers: { 
                'Content-Type': 'application/json',
                'Auth-Token': localStorage.getItem('Auth-Token')
            }
        }).subscribe(
            (data) => {
                console.log(data);
                // var dataParse = JSON.parse(data);
                this.editForm = this._formBuilder.group({
                    e_username: new FormControl(data['username'], Validators.required),
                    e_email: new FormControl(data['email']),
                    e_password: new FormControl(data['password'], Validators.required),
                    e_status: new FormControl(data['status']),
                    e_idWeb: new FormControl(data['idWeb']),
                    e_id: new FormControl(data['id']),
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

    urlAddAccount = this._callApi.createUrl('account/add');
    urlEditAccount = this._callApi.createUrl('account/edit');
    urlGetAccount = this._callApi.createUrl('account/id/');
    urlDeleteAccount = this._callApi.createUrl('account/delete/');

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid) {
            console.log(this.form.value);
            var data = {
                'username': this.form.get('username').value,
                'email': this.form.get('email').value,
                'password': this.form.get('password').value,
                'status': this.form.get('status').value || 0,
                'idWeb': this.form.get('idWeb').value,
            }
            this._http.post(this.urlAddAccount, JSON.stringify(data), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    this.toastr.success('Nhập tài khoản thành công', 'Success!')
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
    onSubmitEdit() {
        if (!this.editForm.valid) {
            return;
        }
        if (this.editForm.valid) {
            var dataS = {
                username: this.editForm.get('e_username').value,
                email: this.editForm.get('e_email').value,
                password: this.editForm.get('e_password').value,
                status: this.editForm.get('e_status').value,
                idWeb: this.editForm.get('e_idWeb').value,
                id: this.editForm.get('e_id').value,
            }
            this._http.post(this.urlEditAccount, JSON.stringify(dataS), {
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
                        // this.toastr.error(error.error['message'], 'Success!')
                        // localStorage.removeItem('Auth-Token');
                        this._router.navigate(['/logout']);
                    }
                    this.toastr.error(error.error['message'], 'Oops!')
                }
            );
        }
    }

    //datatables
    public datatable: any;
    public urlApi = this._callApi.createUrl('account/website/1');
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlApi,
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
            width: 20,
            selector: {
                class: 'm-checkbox--solid m-checkbox--brand'
            },
            textAlign: 'center'
        }, {
            field: "username",
            title: "Tài khoản",
            sortable: 'asc',
            filterable: false,
            width: 100,
        }, {
            field: "password",
            title: "Mật khẩu",
            width: 100,
        }, {
            field: "status",
            title: "Trạng thái",
            width: 75,
            textAlign: 'center',
            // callback function support for column rendering
            template: function(row) {
                var status = {
                    1: {
                        'title': '<i class="fa fa-check"></i>',
                        'class': 'm--font-success fa fa-check'
                    },
                    0: {
                        'title': '<i class="fa fa-times"></i>',
                        'class': 'm--font-danger fa fa-times'
                    }
                };
                return '<span class="' + status[row.status].class + '"></span>';
            }
        },{
            field: "Actions",
            title: "Sự kiện",
            sortable: false,
            width: 75,
            template: function(row, index, datatable) {
                // var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return `
                    <button  data-element-id="${row.id}" class="open_dialogacc m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        <i class="la la-edit"></i>\
                    </button >\
                    <button  data-element-id="${row.id}" class="deleteacc m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        <i class="la la-trash"></i>\
                    </button >\
                `;
            }
        }]
    };

    deletea(id) {
        this._http.get(this.urlDeleteAccount + id, {
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
                this.chRef.detectChanges();
                this.datatable.reload();
            }
        );
    }
}
