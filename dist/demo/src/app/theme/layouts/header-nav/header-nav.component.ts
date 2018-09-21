import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router } from '@angular/router';

declare let mLayout: any;
declare var $:any
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {


    constructor(
        private _router: Router
    ) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

    route(event) {
        let re = $(event.target).parent().data('route') != undefined ?  $(event.target).parent().data('route'):$(event.target).data('route');
        console.log(re);
        this._router.navigate([re]);
    }

}