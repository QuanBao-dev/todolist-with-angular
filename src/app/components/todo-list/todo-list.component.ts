import { TodoService } from './../../services/todo.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoList$:Observable<Todo[]>;
  constructor(private todoService:TodoService) { }

  ngOnInit(): void {
    this.todoList$ = this.todoService.todoList$;
  }

  editStatus(newTodo:Todo){
    this.todoService.editStatus(newTodo.id,newTodo.isDone);
  }

  editTitle(newTodoEdit:Todo){
    this.todoService.editTitle(newTodoEdit.id,newTodoEdit.title);
  }

  deleteItem(deletedTodo:Todo){
    this.todoService.deleteTodo(deletedTodo.id);
  }

}
