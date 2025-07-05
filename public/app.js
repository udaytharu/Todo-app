class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.apiBaseUrl = '/api/todos';
        
        this.initializeElements();
        this.bindEvents();
        this.loadTodos();
    }

    initializeElements() {
        // Form elements
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-btn');
        
        // List and state elements
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.loading = document.getElementById('loading');
        
        // Stats elements
        this.totalTodos = document.getElementById('total-todos');
        this.completedTodos = document.getElementById('completed-todos');
        this.pendingTodos = document.getElementById('pending-todos');
        
        // Filter elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Template
        this.todoTemplate = document.getElementById('todo-template');
    }

    bindEvents() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        
        // Input events
        this.todoInput.addEventListener('input', () => this.handleInputChange());
    }

    async loadTodos() {
        try {
            this.showLoading(true);
            const response = await fetch(this.apiBaseUrl);
            
            if (!response.ok) {
                throw new Error('Failed to load todos');
            }
            
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleAddTodo(e) {
        e.preventDefault();
        
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        try {
            this.addBtn.disabled = true;
            this.addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            
            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            this.renderTodos();
            this.updateStats();
            
            // Clear input
            this.todoInput.value = '';
            this.todoInput.focus();
            
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showError('Failed to add todo. Please try again.');
        } finally {
            this.addBtn.disabled = false;
            this.addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        }
    }

    async handleToggleTodo(todoId) {
        const todo = this.todos.find(t => t._id === todoId);
        if (!todo) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !todo.completed })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t._id === todoId);
            this.todos[index] = updatedTodo;
            
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    async handleEditTodo(todoId, newText) {
        if (!newText.trim()) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newText.trim() })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t._id === todoId);
            this.todos[index] = updatedTodo;
            
            this.renderTodos();
            
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    async handleDeleteTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/${todoId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            
            this.todos = this.todos.filter(t => t._id !== todoId);
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError('Failed to delete todo. Please try again.');
        }
    }

    handleFilterChange(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.renderTodos();
    }

    handleInputChange() {
        const text = this.todoInput.value.trim();
        this.addBtn.disabled = !text;
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '';
            this.showEmptyState(true);
            return;
        }
        
        this.showEmptyState(false);
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
        });
    }

    createTodoElement(todo) {
        const template = this.todoTemplate.content.cloneNode(true);
        const todoItem = template.querySelector('.todo-item');
        
        // Set data attributes
        todoItem.dataset.id = todo._id;
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        
        // Set text content
        const todoText = todoItem.querySelector('.todo-text');
        todoText.textContent = todo.text;
        
        // Set up complete button
        const completeBtn = todoItem.querySelector('.complete-btn');
        if (todo.completed) {
            completeBtn.classList.add('completed');
            completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        }
        completeBtn.addEventListener('click', () => this.handleToggleTodo(todo._id));
        
        // Set up edit functionality
        const editBtn = todoItem.querySelector('.edit-btn');
        const editForm = todoItem.querySelector('.edit-form');
        const editInput = todoItem.querySelector('.edit-input');
        const saveBtn = todoItem.querySelector('.save-btn');
        const cancelBtn = todoItem.querySelector('.cancel-btn');
        
        editBtn.addEventListener('click', () => {
            editInput.value = todo.text;
            editForm.style.display = 'flex';
            editInput.focus();
        });
        
        saveBtn.addEventListener('click', () => {
            this.handleEditTodo(todo._id, editInput.value);
            editForm.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', () => {
            editForm.style.display = 'none';
        });
        
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleEditTodo(todo._id, editInput.value);
                editForm.style.display = 'none';
            }
        });
        
        // Set up delete button
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.handleDeleteTodo(todo._id));
        
        return todoItem;
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        this.totalTodos.textContent = total;
        this.completedTodos.textContent = completed;
        this.pendingTodos.textContent = pending;
    }

    showLoading(show) {
        this.loading.classList.toggle('hidden', !show);
        if (show) {
            this.todoList.classList.add('hidden');
            this.emptyState.classList.add('hidden');
        } else {
            this.todoList.classList.remove('hidden');
        }
    }

    showEmptyState(show) {
        this.emptyState.classList.toggle('hidden', !show);
    }

    showError(message) {
        // Create a simple error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 