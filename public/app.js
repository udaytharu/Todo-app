class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.apiBaseUrl = '/api';
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
        
        this.initializeElements();
        this.bindEvents();
        this.checkAuthStatus();
    }

    initializeElements() {
        // Auth elements
        this.authSection = document.getElementById('auth-section');
        this.todoSection = document.getElementById('todo-section');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.showRegisterLink = document.getElementById('show-register');
        this.showLoginLink = document.getElementById('show-login');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userUsername = document.getElementById('user-username');
        
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
        // Auth events
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        this.showRegisterLink.addEventListener('click', (e) => this.showRegisterForm(e));
        this.showLoginLink.addEventListener('click', (e) => this.showLoginForm(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Todo events
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        this.todoInput.addEventListener('input', () => this.handleInputChange());
    }

    checkAuthStatus() {
        if (this.token && this.user) {
            this.showTodoSection();
            this.loadTodos();
        } else {
            this.showAuthSection();
        }
    }

    showAuthSection() {
        this.authSection.classList.remove('hidden');
        this.todoSection.classList.add('hidden');
    }

    showTodoSection() {
        this.authSection.classList.add('hidden');
        this.todoSection.classList.remove('hidden');
        this.userUsername.textContent = this.user.username;
    }

    showLoginForm(e) {
        e.preventDefault();
        this.loginForm.classList.remove('hidden');
        this.registerForm.classList.add('hidden');
    }

    showRegisterForm(e) {
        e.preventDefault();
        this.registerForm.classList.remove('hidden');
        this.loginForm.classList.add('hidden');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const btn = this.loginForm.querySelector('.auth-btn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            this.showTodoSection();
            this.loadTodos();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message);
        } finally {
            const btn = this.loginForm.querySelector('.auth-btn');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        try {
            const btn = this.registerForm.querySelector('.auth-btn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
            
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            this.showTodoSection();
            this.loadTodos();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError(error.message);
        } finally {
            const btn = this.registerForm.querySelector('.auth-btn');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
        }
    }

    async handleLogout() {
        try {
            await fetch(`${this.apiBaseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            this.user = null;
            this.todos = [];
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            this.showAuthSection();
            this.loginForm.reset();
            this.registerForm.reset();
        }
    }

    async loadTodos() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBaseUrl}/todos`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleLogout();
                    return;
                }
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
            
            const response = await fetch(`${this.apiBaseUrl}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleLogout();
                    return;
                }
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
            const response = await fetch(`${this.apiBaseUrl}/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ completed: !todo.completed })
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleLogout();
                    return;
                }
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
            const response = await fetch(`${this.apiBaseUrl}/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ text: newText.trim() })
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleLogout();
                    return;
                }
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
            const response = await fetch(`${this.apiBaseUrl}/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleLogout();
                    return;
                }
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