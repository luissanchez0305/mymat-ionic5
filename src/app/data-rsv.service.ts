import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DataRSVService implements Resolve<any>{

  constructor(private dataSrv:DataService) { }
  
  resolve(){

    return this.dataSrv.data;

  }
}
