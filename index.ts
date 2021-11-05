interface ITodoItem {
    id: number;
    title: string;
    completed: boolean;
}

class TodoModel {
    public todos: ITodoItem[] = JSON.parse(localStorage.getItem('todos') || '[]');
    private nextTodoId = 1;
    private modelChangedHandler: (todos: ITodoItem[]) => void;

    public bindModelChangedHandler(handler: (todos: ITodoItem[]) => void) {
        this.modelChangedHandler = handler;
    }

    private modelChanged(todos: ITodoItem[]) {
        localStorage.setItem('todos', JSON.stringify(todos));

        if (this.modelChangedHandler !== null) {
            this.modelChangedHandler(todos);
        }
    }

    public addTodo(todoText: string): void {
        this.todos.push({
            id: this.nextTodoId++,
            title: todoText,
            completed: false
        });

        this.modelChanged(this.todos);
    }

    public toggleTodo(id: number): void {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo !== null) {
            todo.completed = !todo.completed;
        }

        this.modelChanged(this.todos);
    }

    public deleteTodo(id: number): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.modelChanged(this.todos);
    }
}

class TodoView {
    private todoItemTemplate: HTMLTemplateElement = document.querySelector("#todo-item-template");
    private form: HTMLFormElement = document.querySelector("#add-new-todo form");
    private newTodoInput: any = document.getElementById("new-todo");
    
    constructor() {
    }
    
    public bindFormSubmitEvent(formSubmitHandler: (todoText: string) => void) {
        this.form.addEventListener("submit", event => {
            event.preventDefault();
            
            if (this.newTodoInput.value.trim() !== "") {
                formSubmitHandler(this.newTodoInput.value.trim());
                this.newTodoInput.value = "";
            }
        });
    }
    
    public bindTodoToggleEvent(todoToggleHandler: (id: number) => void) {
        document.getElementById("todos-list").addEventListener("click", (event: any) => {
            if (event.target.parentElement.className == "todo-item") {
                let id = event.target.parentElement.querySelector("input[type='checkbox']").getAttribute("id");
                todoToggleHandler(parseInt(id));
            }
        });
    }

    public bindTodoDeleteEvent(todoDeleteHandler: (id: number) => void) {
        document.getElementById("todos-list").addEventListener("click", (event: any) => {
            if (event.target.className == "delete") {
                let id = event.target.parentElement.querySelector("input[type='checkbox']").getAttribute("id");
                todoDeleteHandler(parseInt(id));
            }
        });
    }

    public updateTodosList(todos: ITodoItem[]) {
        document.getElementById("todos-list").innerHTML = "";

        todos.forEach(todo => {
            const fragment = document.importNode(this.todoItemTemplate.content, true);
            fragment.querySelector("input[type='checkbox']").id = todo.id.toString();
            const label = fragment.querySelector("label");
            label.setAttribute("for", todo.id.toString());

            if (todo.completed) {
                label.innerHTML = `<s>${todo.title}</s>`;
                fragment.querySelector("input[type='checkbox']").setAttribute("checked", "checked");
            } else {
                label.innerHTML = todo.title;
            }

            document.getElementById("todos-list").appendChild(fragment);
        });
    }
}

class TodoController {
    private model: TodoModel;
    private view: TodoView;

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindModelChangedHandler((todos: ITodoItem[]) => {
            this.view.updateTodosList(todos);
        });
        
        this.view.bindFormSubmitEvent((todoText: string) => {
            this.model.addTodo(todoText);
        });
        
        this.view.bindTodoToggleEvent((id: number) => {
            this.model.toggleTodo(id);
        });
        
        this.view.bindTodoDeleteEvent((id: number) => {
            this.model.deleteTodo(id);
        });

        this.view.updateTodosList(this.model.todos);
    }
}

const app = new TodoController(new TodoModel(), new TodoView());