import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private _data:any = {};


  get data(){
    return this._data;
  }

  set data(data){
    this._data = data;
  }

  constructor() { }
}
