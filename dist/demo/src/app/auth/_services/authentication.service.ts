import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { CallApiService } from "../../theme/_services/call-api.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthenticationService {

    constructor(
        private http: Http,
        private _http: HttpClient,
        private _callApi: CallApiService,
    ) {
    }

    urlLogin = this._callApi.createUrl('login');

    login(email: string, password: string) {
        return this._http.post(this.urlLogin , JSON.stringify({ username: email, password: password }));
            // .map((response: Response) => {
            //     // login successful if there's a jwt token in the response
            //     localStorage.setItem('currentUser', JSON.stringify(response));
            //     // let user = response.json();
            //     // if (user && user.token) {
            //     //     // store user details and jwt token in local storage to keep user logged in between page refreshes
            //     //     localStorage.setItem('currentUser', JSON.stringify(user));
            //     // }
            // });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}