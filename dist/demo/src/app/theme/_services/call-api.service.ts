import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConfigApi } from '../config-api';

@Injectable()
export class CallApiService {

  constructor(
    private http: Http,
    private config: ConfigApi
  ) { }

  createUrl(path: string) {
    return this.config.apiUrl+path;
  }

  getAccount() {
    
  }

  addAccount(url: string, data: any) {
    return this.http.post(url, data);
  }
}
