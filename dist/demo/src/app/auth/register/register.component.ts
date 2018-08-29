import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";
import { AlertComponent } from "../_directives";
import { ScriptLoaderService } from "../../_services/script-loader.service";
import { UserService, AlertService } from "../_services";
import { HttpClient } from "@angular/common/http";
import { CallApiService } from "../../theme/_services/call-api.service";
import { ToastsManager } from "ng2-toastr";

declare let $: any;
declare let mUtil: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class RegisterComponent implements OnInit {

    model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private _http: HttpClient,
        private _callApi: CallApiService,
        public toastr: ToastsManager,
        vRef: ViewContainerRef,
        private cfr: ComponentFactoryResolver) {
            this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit() {
        this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleFormSwitch();
                this.handleSignInFormSubmit();
                this.handleSignUpFormSubmit();
                this.handleForgetPasswordFormSubmit();
            });
    }
    urlLogin = this._callApi.createUrl('login');
    signin() {
        this.loading = true;
        // this._authService.login(this.model.email, this.model.password)
        // .subscribe(
        //     data => {
        //         this._router.navigate([this.returnUrl]);
        //     },
        //     error => {
        //         this.showAlert('alertSignin');
        //         this._alertService.error(error);
        //         this.loading = false;
        //     });
        this.returnUrl = 'index';
        this._http.post(this.urlLogin,  JSON.stringify({ phone: this.model.email, password: this.model.password }), {
                headers: { 
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }).subscribe(
                (data) => {
                    // console.log(data);
                    this.toastr.success('Đăng nhập thành công', 'Success!')
                    localStorage.setItem('Auth-Token', data['message']);
                    this.loading = false;
                    this._router.navigate([this.returnUrl]);
                },
                (error) => {
                    console.log(error);
                    // this.showAlert('alertSignin');
                    this.toastr.error(error.error['message'], 'Oops!')
                    // this._alertService.error(error);
                    this.loading = false;
                }
            );
    }

    signup() {
        this.loading = true;
        this._userService.create(this.model).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(
                    'Thank you. To complete your registration please check your email.',
                    true);
                this.loading = false;
                this.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertSignup');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(
                    'Cool! Password recovery instruction has been sent to your email.',
                    true);
                this.loading = false;
                this.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    handleSignInFormSubmit() {
        $('#m_login_signin_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    displaySignUpForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--forget-password');
        mUtil.removeClass(login, 'm-login--signin');

        mUtil.addClass(login, 'm-login--signup');
        mUtil.animateClass(login.getElementsByClassName('m-login__signup')[0], 'flipInX animated');
    }

    displaySignInForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--forget-password');
        mUtil.removeClass(login, 'm-login--signup');
        try {
            $('form').data('validator').resetForm();
        } catch (e) {
        }

        mUtil.addClass(login, 'm-login--signin');
        mUtil.animateClass(login.getElementsByClassName('m-login__signin')[0], 'flipInX animated');
    }

    displayForgetPasswordForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--signin');
        mUtil.removeClass(login, 'm-login--signup');

        mUtil.addClass(login, 'm-login--forget-password');
        mUtil.animateClass(login.getElementsByClassName('m-login__forget-password')[0], 'flipInX animated');
    }

    handleFormSwitch() {
        document.getElementById('m_login_forget_password').addEventListener('click', (e) => {
            e.preventDefault();
            this.displayForgetPasswordForm();
        });

        document.getElementById('m_login_forget_password_cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignInForm();
        });

        document.getElementById('m_login_signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignUpForm();
        });

        document.getElementById('m_login_signup_cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignInForm();
        });
    }

    handleSignUpFormSubmit() {
        document.getElementById('m_login_signup_submit').addEventListener('click', (e) => {
            let btn = $(e.target);
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    fullname: {
                        required: true,
                    },
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true,
                    },
                    rpassword: {
                        required: true,
                    },
                    agree: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    handleForgetPasswordFormSubmit() {
        document.getElementById('m_login_forget_password_submit').addEventListener('click', (e) => {
            let btn = $(e.target);
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }
}