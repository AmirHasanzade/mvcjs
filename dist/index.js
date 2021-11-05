class TodoModel {
    constructor() {
        this.todos = [];
        this.nextTodoId = 1;
    }
    bindModelChangedHandler(handler) {
        this.modelChangedHandler = handler;
    }
    modelChanged(todos) {
        if (this.modelChangedHandler !== null) {
            this.modelChangedHandler(todos);
        }
    }
    addTodo(todoText) {
        this.todos.push({
            id: this.nextTodoId++,
            title: todoText,
            completed: false
        });
        this.modelChanged(this.todos);
    }
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo !== null) {
            todo.completed = !todo.completed;
        }
        this.modelChanged(this.todos);
    }
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.modelChanged(this.todos);
    }
}
class TodoView {
    constructor() {
        this.todoItemTemplate = document.querySelector("#todo-item-template");
        this.form = document.querySelector("#add-new-todo form");
        this.newTodoInput = document.getElementById("new-todo");
    }
    bindFormSubmitEvent(formSubmitHandler) {
        this.form.addEventListener("submit", event => {
            event.preventDefault();
            if (this.newTodoInput.value.trim() !== "") {
                formSubmitHandler(this.newTodoInput.value.trim());
                this.newTodoInput.value = "";
            }
        });
    }
    bindTodoToggleEvent(todoToggleHandler) {
        document.getElementById("todos-list").addEventListener("click", (event) => {
            if (event.target.parentElement.className == "todo-item") {
                let id = event.target.parentElement.querySelector("input[type='checkbox']").getAttribute("id");
                todoToggleHandler(parseInt(id));
            }
        });
    }
    bindTodoDeleteEvent(todoDeleteHandler) {
        document.getElementById("todos-list").addEventListener("click", (event) => {
            if (event.target.className == "delete") {
                let id = event.target.parentElement.querySelector("input[type='checkbox']").getAttribute("id");
                todoDeleteHandler(parseInt(id));
            }
        });
    }
    updateTodosList(todos) {
        document.getElementById("todos-list").innerHTML = "";
        todos.forEach(todo => {
            const fragment = document.importNode(this.todoItemTemplate.content, true);
            fragment.querySelector("input[type='checkbox']").id = todo.id.toString();
            const label = fragment.querySelector("label");
            label.setAttribute("for", todo.id.toString());
            if (todo.completed) {
                label.innerHTML = `<s>${todo.title}</s>`;
                fragment.querySelector("input[type='checkbox']").setAttribute("checked", "checked");
            }
            else {
                label.innerHTML = todo.title;
            }
            document.getElementById("todos-list").appendChild(fragment);
        });
    }
}
class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.model.bindModelChangedHandler((todos) => {
            this.view.updateTodosList(todos);
        });
        this.view.bindFormSubmitEvent((todoText) => {
            this.model.addTodo(todoText);
        });
        this.view.bindTodoToggleEvent((id) => {
            this.model.toggleTodo(id);
        });
        this.view.bindTodoDeleteEvent((id) => {
            this.model.deleteTodo(id);
        });
    }
}
const app = new TodoController(new TodoModel(), new TodoView());
