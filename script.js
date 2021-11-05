class TodoModel {
    todos = [
        { id: 1, text: "Renew rent contract", done: false }
    ];

    lastId = 1;

    constructor() {
        
    }

    addTodo(text, done) {
        this.lastId += 1;
        this.todos.push({id: this.lastId, text: text, done: done});
    }

    removeTodo(id) {

    }
}

class TodoView {
    constructor(todosInput, todosList) {
        this.todosInput = document.getElementById(todosInput);
        this.todosList = document.getElementById(todosList);
    }

    renderInitialView() {
        const todoInputTemplate = document.querySelector("#todo-input-template");
        const todoInputFragment = document.importNode(todoInputTemplate.content, true);

        this.todosList.appendChild(todoInputFragment);
    }
    
    renderView(model) {
        const todoItemTemplate = document.querySelector("#todo-item-template");
        
        model.todos.forEach(item => {
            const todoItemFragment = document.importNode(todoItemTemplate.content, true);
            todoItemFragment.querySelector(".todo-text").innerHTML = item.text;
            todoItemFragment.querySelector(".done").checked = item.done;
            this.todosList.appendChild(todoItemFragment);
        });
    }
}

class Controller {
    constructor(todoModel, todoView) {
        this.todoModel = todoModel;
        this.todoView = todoView;
        this.todoView.renderInitialView();
    }

    handleUpdate() {
        this.todoView.renderView(this.todoModel);
    }
}

let todoModel = new TodoModel();
todoModel.addTodo("test1", true);
todoModel.addTodo("test2", false);
todoModel.addTodo("test3", true);
todoModel.addTodo("test4", true);
const app = new Controller(todoModel, new TodoView("input", "todos-list"));

app.handleUpdate();