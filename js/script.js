
let todoes = []; // {id, title, isCompleted, createdAt}
let filter = 'all';

// DOM refs
const listEl = document.getElementById('todo_list');
const inputEl = document.getElementById('input');
const errorEl = document.getElementById('error');
const emptyStateEl = document.getElementById('emptyState');
const statsEl = document.getElementById('stats');
const dateEl = document.getElementById('date');
const leftCountEl = document.getElementById('leftCount');

window.addEventListener('DOMContentLoaded', () => {
  loadTodoes();
  updateDate();
  filterTodos('all'); // set initial filter UI
});

// update date display
function updateDate(){
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
}

// helper: persist
function saveTodos(){
  localStorage.setItem('todoes', JSON.stringify(todoes));
  renderStats();
}

// load from localStorage
function loadTodoes(){
  const raw = localStorage.getItem('todoes');
  todoes = raw ? JSON.parse(raw) : [];
  render();
}

// create and insert DOM li
function insertTodo(todo) {
  const li = document.createElement("li");
  li.className = "flex items-center gap-3 p-3 rounded-xl bg-white/3 backdrop-blur-sm fade-in";
  li.id = todo.id;

  // checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!todo.isCompleted;
  checkbox.className = "w-5 h-5 rounded cursor-pointer";

  // text input (readonly until edit)
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.title;
  input.disabled = true;
  input.className = "w-full bg-transparent border-none text-white text-lg  font-medium input";

  // meta / time
  const meta = document.createElement("div");
  meta.className = "text-xs text-white/70 text-right";
  const created = new Date(todo.createdAt || Date.now());
  meta.innerHTML = `${timeAgo(created.toISOString())}`;

  // actions
  const actions = document.createElement("div");
  actions.className = "flex items-center gap-2";

  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square text-white/90"></i>`;
  editBtn.className = "p-2 rounded-lg hover:bg-white/5 transition";

  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = `<i class="fa-solid fa-check text-green-400"></i>`;
  saveBtn.className = "p-2 rounded-lg hover:bg-white/5 transition hidden";

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash text-red-400"></i>`;
  deleteBtn.className = "p-2 rounded-lg hover:bg-white/5 transition";

  actions.appendChild(editBtn);
  actions.appendChild(saveBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(meta);
  li.appendChild(actions);

  // prepend to show newest first
  listEl.prepend(li);

  // initial done styling
  updateDoneStyle(li, todo.isCompleted);

  // events
  checkbox.addEventListener('change', (e) => {
    const checked = e.target.checked;
    todoes = todoes.map(t => t.id === todo.id ? ({ ...t, isCompleted: checked }) : t);
    saveTodos();
    updateDoneStyle(li, checked);
    render();
  });

  deleteBtn.addEventListener('click', () => {
    if(!confirm('Delete this task?')) return;
    todoes = todoes.filter(t => t.id !== todo.id);
    saveTodos();
    li.remove();
    render();
  });

  editBtn.addEventListener('click', () => {
    input.disabled = false;
    input.focus();
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
  });

  saveBtn.addEventListener('click', saveTodo);
  input.addEventListener('keypress', (ev) => { if(ev.key === 'Enter') saveTodo(); });

  function saveTodo(){
    input.disabled = true;
    editBtn.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    const newTitle = input.value.trim();
    if(!newTitle){
      alert('Title cannot be empty');
      return;
    }
    todoes = todoes.map(t => t.id === todo.id ? ({ ...t, title: newTitle }) : t);
    saveTodos();
    render();
  }
}

// helper to apply done style
function updateDoneStyle(li, done){
  const inp = li.querySelector('.input');
  if(done){
    inp.classList.add('line-through', 'text-white/60');
    li.classList.add('ring-1', 'ring-emerald-400/30');
  } else {
    inp.classList.remove('line-through', 'text-white/60');
    li.classList.remove('ring-1', 'ring-emerald-400/30');
  }
}

// render list based on filter
function render(){
  // clear
  listEl.innerHTML = '';
  const visible = todoes.slice().filter(t => {
    if(filter === 'active') return !t.isCompleted;
    if(filter === 'done') return t.isCompleted;
    return true;
  });

  if(visible.length === 0){
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
  }

  // latest first
  visible.reverse();
  visible.forEach(t => insertTodo(t));

  renderStats();
}

// stats
function renderStats(){
  const total = todoes.length;
  const done = todoes.filter(t => t.isCompleted).length;
  const left = total - done;
  statsEl.textContent = `${total} tasks • ${done} done`;
  leftCountEl.textContent = `${left} left`;
}

// public functions
function removeError(){ errorEl.textContent = ''; }

function addTodo(){
  const title = inputEl.value.trim();
  if(title.length < 3){
    errorEl.textContent = "Title should be at least 3 characters";
    return;
  }
  const id = Date.now().toString() + Math.floor(Math.random()*999);
  const todo = { id, title, isCompleted: false, createdAt: new Date().toISOString() };
  todoes.push(todo);
  saveTodos();
  insertTodo(todo);
  inputEl.value = '';
  errorEl.textContent = "✅ Added";
  setTimeout(()=> errorEl.textContent = '', 1600);
  render();
}

function clearCompleted(){
  todoes = todoes.filter(t => !t.isCompleted);
  saveTodos();
  render();
}

function clearAll(){
  if(!confirm('Clear ALL tasks?')) return;
  todoes = [];
  saveTodos();
  render();
}

function filterTodos(f){
  filter = f;
  // update active button styles
  document.querySelectorAll('.filterBtn').forEach(btn => btn.classList.remove('bg-white/10','text-white','shadow-inner'));
  if(f === 'all') document.getElementById('f-all').classList.add('bg-white/10','text-white','shadow-inner');
  if(f === 'active') document.getElementById('f-active').classList.add('bg-white/10','text-white','shadow-inner');
  if(f === 'done') document.getElementById('f-done').classList.add('bg-white/10','text-white','shadow-inner');
  render();
}

// time-ago small util
function timeAgo(iso){
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime())/1000);
  if(diff < 60) return `${diff}s`;
  if(diff < 3600) return `${Math.floor(diff/60)}m`;
  if(diff < 86400) return `${Math.floor(diff/3600)}h`;
  if(diff < 2592000) return `${Math.floor(diff/86400)}d`;
  return d.toLocaleDateString();
}

// keyboard: Enter to add, Escape to clear
inputEl.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') addTodo();
  if(e.key === 'Escape') { inputEl.value = ''; errorEl.textContent = ''; }
});