document.addEventListener('DOMContentLoaded', () => {
  let todos = [];
  let editingId = null;
  
  const todoForm = document.getElementById('todo-form');
  const newTodoInput = document.getElementById('new-todo');
  const todoList = document.getElementById('todo-list');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggle.querySelector('.theme-toggle-icon');
  
  function setTheme(isDark) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      themeToggleIcon.textContent = isDark ? '☀︎' : '🌚';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme === 'dark');

  themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(!isDark);
  });

  function renderTodos() {
      if (todos.length === 0) {
          todoList.innerHTML = '<p class="empty-state">No todos yet. Add one above!</p>';
          return;
      }

      todoList.innerHTML = todos.map(todo => {
          if (editingId === todo.id) {
              return `
                  <div class="todo-item">
                      <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
                          ${todo.completed ? '✓' : ''}
                      </div>
                      <form class="edit-form" onsubmit="saveEdit(event, ${todo.id})">
                          <input
                              type="text"
                              class="edit-input"
                              value="${todo.text}"
                          />
                          <button type="submit" class="action-button save-button" title="Save">✓</button>
                          <button type="button" class="action-button cancel-button" onclick="cancelEdit()" title="Cancel">✕</button>
                      </form>
                  </div>
              `;
          }

          return `
              <div class="todo-item">
                  <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
                      ${todo.completed ? '✓' : ''}
                  </div>
                  <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                  <div class="todo-actions">
                      <button class="action-button edit-button" onclick="startEditing(${todo.id})" title="Edit">✎</button>
                      <button class="action-button delete-button" onclick="deleteTodo(${todo.id})" title="Delete">×</button>
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