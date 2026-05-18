const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const spacesTabs = document.getElementById('spacesTabs');
const addSpaceBtn = document.getElementById('addSpaceBtn');
const spaceTitle = document.getElementById('spaceTitle');

let spaces = JSON.parse(localStorage.getItem('spaces')) || [{ id: 1, name: 'Personal' }];
let activeSpaceId = parseInt(localStorage.getItem('activeSpaceId')) || spaces[0].id;
let tasks = [];

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem(`tasks_${activeSpaceId}`)) || [];
}

function saveTasks() {
    localStorage.setItem(`tasks_${activeSpaceId}`, JSON.stringify(tasks));
}

function saveSpaces() {
    localStorage.setItem('spaces', JSON.stringify(spaces));
}

function switchSpace(id) {
    activeSpaceId = id;
    localStorage.setItem('activeSpaceId', String(id));
    loadTasks();
    renderSpaces();
    renderTasks();
}

function addSpace() {
    const name = prompt('Space name:');
    if (!name || !name.trim()) return;
    const space = { id: Date.now(), name: name.trim() };
    spaces.push(space);
    saveSpaces();
    switchSpace(space.id);
}

function deleteSpace(id) {
    if (spaces.length === 1) return;
    spaces = spaces.filter(s => s.id !== id);
    localStorage.removeItem(`tasks_${id}`);
    saveSpaces();
    if (activeSpaceId === id) {
        switchSpace(spaces[0].id);
    } else {
        renderSpaces();
    }
}

function renameSpace(id) {
    const space = spaces.find(s => s.id === id);
    if (!space) return;
    const name = prompt('Rename space:', space.name);
    if (!name || !name.trim()) return;
    space.name = name.trim();
    saveSpaces();
    renderSpaces();
}

function renderSpaces() {
    const activeSpace = spaces.find(s => s.id === activeSpaceId);
    spaceTitle.textContent = activeSpace ? activeSpace.name : 'My To-Do List';

    spacesTabs.innerHTML = '';
    spaces.forEach(space => {
        const tab = document.createElement('div');
        tab.className = `space-tab${space.id === activeSpaceId ? ' active' : ''}`;
        tab.textContent = space.name;
        tab.addEventListener('click', () => switchSpace(space.id));
        tab.addEventListener('dblclick', () => renameSpace(space.id));

        if (spaces.length > 1) {
            const del = document.createElement('span');
            del.className = 'space-tab-close';
            del.textContent = '×';
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete space "${space.name}" and all its tasks?`)) {
                    deleteSpace(space.id);
                }
            });
            tab.appendChild(del);
        }

        spacesTabs.appendChild(tab);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    tasks.push({ id: Date.now(), text: taskText, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
        return;
    }
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function init() {
    loadTasks();
    renderSpaces();
    renderTasks();
    addButton.addEventListener('click', addTask);
    addSpaceBtn.addEventListener('click', addSpace);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

init();
