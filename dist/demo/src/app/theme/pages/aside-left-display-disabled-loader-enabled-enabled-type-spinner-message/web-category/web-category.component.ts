import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Helpers } from '../../../../helpers';
import { CallApiService } from '../../../_services/call-api.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var $:any
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-web-category',
  templateUrl: './web-category.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WebCategoryComponent implements OnInit {

    id = this.route.snapshot.paramMap.get('id');
    constructor(
        private _script: ScriptLoaderService,
        private _callApi: CallApiService,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private chRef: ChangeDetectorRef,
        public toastr: ToastsManager,
        private _router: Router,
        private route: ActivatedRoute,
        vRef: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vRef);
        // this._router.routeReuseStrategy.shouldReuseRoute = function(){
        //     return false;
        // }
    
        //  this._router.events.subscribe((evt) => {
        //     if (evt instanceof NavigationEnd) {
        //        // trick the Router into believing it's last link wasn't previously loaded
        //        this._router.navigated = false;
        //        // if you need to scroll back to top, here is the right place
        //     //    window.scrollTo(0, 0);
        //     }
        // });
    }
    ngOnInit() {
        this.getDataWebCategory();
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
  
        Helpers.bodyClass('m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
  
        this.datatable = (<any>$('#m_datatable_wc')).mDatatable(this.options);
        
        $(document).on('click', '.open_dialog', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            console.log(id);
            
            this.getDataWebCategory();
            setTimeout(this.formEdit(id), 100);
            // $('#m_modal').modal();
            // this.edit($(event.target).parent().data('element-id'));
        });
        $(document).on('click', '.delete', (event) => {
            var id = $(event.target).parent().data('element-id') != undefined ?  $(event.target).parent().data('element-id'):$(event.target).data('element-id');
            this.delete(id);
        });
    }
    form = this._formBuilder.group({
        id: new FormControl(''),
        url: new FormControl('', Validators.required),
        name: new FormControl('',Validators.required),
        idWeb: new FormControl(this.id),
    });

    urlGetWebCategory = this._callApi.createUrl('webcategory/website/'+this.id);
    urlGetWebCategoryById = this._callApi.createUrl('webcategory/id/');
    urlAddWebCategory = this._callApi.createUrl('webcategory/add');
    urlEditWebCategory = this._callApi.createUrl('webcategory/edit');
    urlDeleteWebCategory = this._callApi.createUrl('webcategory/delete/');

    action = 'add';

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.form.valid && this.action === 'add') {
            var dataS= {
                id: this.form.get('id').value,
                url: this.form.get('url').value,
                name: this.form.get('name').value,
                id_web: this.form.get('idWeb').value,
            }
            this._http.post(this.urlAddWebCategory, JSON.stringify(dataS), {
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
            var dataS= {
                'id': this.form.get('id').value,
                'url': this.form.get('url').value,
                'name': this.form.get('name').value,
                'id_web': this.form.get('idWeb').value,
            }
            this._http.post(this.urlEditWebCategory, JSON.stringify(dataS), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Auth-Token': localStorage.getItem('Auth-Token')
                }
            }).subscribe(
                (data) => {
                    
                    this.toastr.success(data['message'], 'Success!')
                    this.chRef.detectChanges();
                    this.datatable.reload();
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
            this.form = this._formBuilder.group({
                url: new FormControl('', Validators.required),
                name: new FormControl('', Validators.required),
                idWeb: new FormControl(this.id),
            });
    }

    webc: any;
    formEdit(id) {
        this.action = 'edit';
        this.webc = '';
        for (var i = 0; i<this.listWebCategory.length; i++) {
            if (this.listWebCategory[i].id === id){
                this.webc = this.listWebCategory[i];
            }
        }
        if (this.webc != '') {
            this.form = this._formBuilder.group({
                id: new FormControl(this.webc.id),
                url: new FormControl(this.webc.url, Validators.required),
                name: new FormControl(this.webc.name, Validators.required),
                idWeb: new FormControl(this.id),
            });
        } else {
            this.toastr.error("Chuyên mục không tồn tại", 'Oops!')
        }
    }

    onChange(value) {
        // this.idCactegory = 1;
        this.chRef.detectChanges();
        this.datatable.reload();
    }
    //datatables
    public datatable: any;
    // linkPosCategory = this.urlGetLinkPost;
    public options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    url: this.urlGetWebCategory,
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
            field: "url",
            title: "Link",
            sortable: 'asc',
            filterable: false,
        }, {
            field: "name",
            title: "Tên",
        },{
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
    }
    
    delete(id) {
        this._http.get(this.urlDeleteWebCategory + id, {
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

    listWebCategory: any;
    getDataWebCategory() {
        this._http.get(this.urlGetWebCategory, {
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
}
