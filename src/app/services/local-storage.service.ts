import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage:Storage;
  constructor() {
    this.storage = window.localStorage;
  }
  getObject(key:string){
    return JSON.parse((this.storage.getItem(key)));
  }

  setObject(key:string, object:object){
    this.storage.setItem(key, JSON.stringify(object));
  }
}
