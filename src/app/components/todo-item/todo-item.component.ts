import { Todo } from './../../models/todo.model';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo:Todo;
  @Output() changeStatus:EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() changeTitle:EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteItem:EventEmitter<Todo> = new EventEmitter<Todo>();
  changeToInput = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeTodoStatus(){
    this.changeStatus.emit({...this.todo, isDone: !this.todo.isDone});
  }


  changeTodoInput(){
    if(!this.todo.isDone){
      this.changeToInput = true;
    }
  }

  updateTodo(event){
    if(event.keyCode === 13){
      let title = event.target.value;
      this.changeTitle.emit({...this.todo, title: title});
      this.changeToInput = false;
    }
  }

  focusInput(event){
    event.target.focus();
  }

  onChangeClickOutside(event){
    let inputElement = event.target;
    inputElement.focus();
    let click$ = fromEvent(document,'click');
    click$.subscribe((event)=>{
      if(!inputElement.contains(event.target)){
        let title = inputElement.value;
        this.changeTitle.emit({...this.todo, title: title});
        this.changeToInput = false;  
      };
    })
  }

  triggerDeleteItem(){
    this.deleteItem.emit({...this.todo});
  }
}
