document.addEventListener('DOMContentLoaded', () => {
    
    let todos = [];
    let editingId = null;
    const todoForm = document.getElementById('todo-form');
    const newTodoInput = document.getElementById('new-todo');
    const todoList = document.getElementById('todo-list');
    function renderTodos() {
      if (todos.length === 0) {
        todoList.innerHTML = '<p class="empty-state">No todos yet. Add one above!</p>';
        return;
      }
  
      todoList.innerHTML = todos.map(todo => {
        if (editingId === todo.id) {
          return `
            <div class="todo-item">
              <button class="btn-toggle ${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
                ${todo.completed ? '✓' : '○'}
              </button>
              <form class="edit-form" data-id="${todo.id}" onsubmit="saveEdit(event, ${todo.id})">
                <input type="text" class="edit-input" value="${todo.text}" />
                <button type="submit" class="btn-save" title="Save">✓</button>
                <button type="button" class="btn-cancel" onclick="cancelEdit()" title="Cancel">✕</button>
              </form>
            </div>
          `;
        }
  
        return `
          <div class="todo-item">
            <button class="btn-toggle ${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
              ${todo.completed ? '✓' : '○'}
            </button>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <div class="todo-actions">
              <button class="btn-edit" onclick="startEditing(${todo.id})" title="Edit">✎</button>
              <button class="btn-delete" onclick="deleteTodo(${todo.id})" title="Delete">×</button>
            </div>
          </div>
        `;
      }).join('');
    }
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = newTodoInput.value.trim();
      if (text) {
        todos.push({
          id: Date.now(),
          text,
          completed: false
        });
        newTodoInput.value = '';
        renderTodos();
        saveTodos();
      }
    });
    window.toggleTodo = (id) => {
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      renderTodos();
      saveTodos();
    };
    window.deleteTodo = (id) => {
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
      saveTodos();
    };
    window.startEditing = (id) => {
      editingId = id;
      renderTodos();
      const input = document.querySelector('.edit-input');
      if (input) {
        input.focus();
        input.select();
      }
    };
    window.saveEdit = (e, id) => {
      e.preventDefault();
      const newText = e.target.querySelector('.edit-input').value.trim();
      
      if (newText) {
        todos = todos.map(todo =>
          todo.id === id ? { ...todo, text: newText } : todo
        );
        editingId = null;
        renderTodos();
        saveTodos();
      }
    };
    window.cancelEdit = () => {
      editingId = null;
      renderTodos();
    };
    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    function loadTodos() {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
      }
    }
   
    loadTodos();
  });