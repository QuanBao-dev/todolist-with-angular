import { LocalStorageService } from './local-storage.service';
import { Filter } from './../models/filtering.model';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private static readonly TodoStorageKey = 'todoList';
  private todoList:Todo[];
  private filteredTodoList: Todo[];
  private todoListLocalStorage = new BehaviorSubject<Todo[]>([]); 
  private lengthSubject = new BehaviorSubject<number>(0);//// stream with initial value
  private displayTodoSubject = new BehaviorSubject<Todo[]>([]);
  private currentFilter:Filter = Filter.All;
  todoList$:Observable<Todo[]> = this.displayTodoSubject.asObservable();
  length$:Observable<number> = this.lengthSubject.asObservable();
  todoListLocalStorage$:Observable<Todo[]> = this.todoListLocalStorage.asObservable();

  constructor(private storageService:LocalStorageService) { }

  fetchFromLocalStorage(){
    this.todoList = this.storageService.getObject(TodoService.TodoStorageKey) || [];
    this.filteredTodoList = [...this.todoList];
    this.updateTodoData();
  }

  
  updateToLocalStorage(){
    this.storageService.setObject(TodoService.TodoStorageKey, this.todoList);
    this.filterTodoList(this.currentFilter, false);
    this.updateTodoData();
  }
  
  private updateTodoData() {
    this.displayTodoSubject.next(this.filteredTodoList);
    this.lengthSubject.next(this.todoList.length);
    this.todoListLocalStorage.next(this.todoList);
  }
   
  filterTodoList(filter:Filter, isFiltering: boolean){
    this.currentFilter = filter;
    switch(filter){
      case Filter.Active:
        this.filteredTodoList = this.todoList.filter(todo => !todo.isDone);
        break;
      case Filter.Completed:
        this.filteredTodoList = this.todoList.filter(todo => todo.isDone);
        break;
      case Filter.All:
        this.filteredTodoList = [...this.todoList];
        break;
    }
    if(isFiltering) {
      this.updateTodoData()
    }
  }

  addTodo(text:string){
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date,text);
    this.todoList.unshift(newTodo);
    this.updateToLocalStorage();
  }

  editStatus(id:number, isDone:boolean){
    const index = this.todoList.findIndex((todo)=> todo.id === id);
    this.todoList[index].isDone = isDone;
    // this.todoList.splice(index, 1, this.todoList[index]);
    this.updateToLocalStorage();
  }

  editTitle(id:number,title:string){
    const index = this.todoList.findIndex((todo) => todo.id === id);
    this.todoList[index].title = title;
    this.updateToLocalStorage();
  }

  deleteTodo(id:number){
    const index = this.todoList.findIndex(todo => todo.id === id);
    this.todoList.splice(index,1);
    this.updateToLocalStorage();
  }

  deleteAllCompleted(){
    this.todoList = this.todoList.filter(todo => !todo.isDone);
    this.updateToLocalStorage();
  }

  updateAll(allDone:boolean){
    if(allDone){
      this.todoList = this.todoList.map(todo => ({...todo,isDone: true}));
    } else {
      this.todoList = this.todoList.map(todo => ({...todo,isDone: false}));
    }
    this.updateToLocalStorage();
  }
}
