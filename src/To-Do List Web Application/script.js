document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('edit-task-form').addEventListener('submit', saveEditedTask);

let tasks = [];

function addTask(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;

    const task = {
        id: Date.now(),
        title,
        desc,
        priority,
        completed: false
    };

    tasks.push(task);
    sortTasksByPriority(); // Sort tasks after adding
    renderTasks();
    document.getElementById('task-form').reset();

    showAlert('Task added!', 'success');
}

function modifyTask(e) {
    if (e.target.classList.contains('edit-task')) {
        const id = e.target.parentElement.parentElement.dataset.id;
        const task = tasks.find(task => task.id == id);
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-desc').value = task.desc;
        document.getElementById('edit-task-priority').value = task.priority;
        $('#editTaskModal').modal('show');
    } else if (e.target.classList.contains('delete-task')) {
        const id = e.target.parentElement.parentElement.dataset.id;
        tasks = tasks.filter(task => task.id != id);
        renderTasks();
        showAlert('Task deleted!', 'danger');
    } else if (e.target.classList.contains('task-checkbox')) {
        const id = e.target.parentElement.parentElement.dataset.id;
        const task = tasks.find(task => task.id == id);
        task.completed = e.target.checked;
        renderTasks();
        showAlert(`Task marked as ${task.completed ? 'completed' : 'incomplete'}.`, 'info');
    }
}

function saveEditedTask(e) {
    e.preventDefault();

    const id = tasks[tasks.length - 1].id; // Assuming modal handles the last edited task
    const task = tasks.find(task => task.id == id);
    task.title = document.getElementById('edit-task-title').value;
    task.desc = document.getElementById('edit-task-desc').value;
    task.priority = document.getElementById('edit-task-priority').value;

    sortTasksByPriority(); // Sort tasks after editing
    renderTasks();
    $('#editTaskModal').modal('hide');
    showAlert('Task updated!', 'warning');
}

function sortTasksByPriority() {
    tasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }; // Define priority order
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.priority} ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input task-checkbox" id="checkbox-${task.id}" ${task.completed ? 'checked' : ''}>
                <label class="custom-control-label" for="checkbox-${task.id}"><strong>${task.title}</strong> - ${task.desc}</label>
            </div>
            <div>
                <button type="button" class="btn btn-warning edit-task mr-2">Edit</button>
                <button type="button" class="btn btn-danger delete-task">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    document.body.insertBefore(alertDiv, document.body.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

document.getElementById('task-list').addEventListener('click', modifyTask);
