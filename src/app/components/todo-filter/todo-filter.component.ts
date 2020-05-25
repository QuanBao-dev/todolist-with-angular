import { Filter } from './../../models/filtering.model';
import { TodoService } from './../../services/todo.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-todo-filter',
  templateUrl: './todo-filter.component.html',
  styleUrls: ['./todo-filter.component.scss']
})
export class TodoFilterComponent implements OnInit, OnDestroy {
  currentFilter:Filter;
  lengthActive:number = 0;
  hasCompletedItem:boolean = false;
  hasUncompletedItem:boolean = true;
  destroy$: Subject<null> = new Subject<null>();
  constructor(
    private todoService:TodoService,
  ) { }


  ngOnInit(): void {
    this.currentFilter = Filter.All;
    this.todoService.todoListLocalStorage$.pipe(
      map(todo => todo.filter(v => v.isDone === true)),
      takeUntil(this.destroy$)
    ).subscribe(v => {
      if(v && v.length !== 0){
        this.hasCompletedItem = true;
      } else {
        this.hasCompletedItem = false;
      }
    });
    this.todoService.todoListLocalStorage$.pipe(
      map(todo => todo.filter(v => v.isDone !== true)),
      takeUntil(this.destroy$)
    ).subscribe(v => {
      this.lengthActive = v.length;
      if(v && v.length !== 0){
        this.hasUncompletedItem = true;
      } else {
        this.hasUncompletedItem = false;
      }
    });
  }

  onChangeFilter(){
    this.todoService.filterTodoList(this.currentFilter, true);
  }

  deleteAllCompleted(){
    this.todoService.deleteAllCompleted();
  }

  updateAll(){
    this.todoService.updateAll(this.hasUncompletedItem);
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.destroy$.next();
    this.destroy$.complete();
  }
}
