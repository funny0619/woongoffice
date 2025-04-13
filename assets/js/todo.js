// Global variable to store tasks
let globalTasks = [];
let url = 'https://eunjibackend-feg2fwcahycuf3hj.westus-01.azurewebsites.net/';
async function completeTask(task) {
    task.completed = !task.completed;
    // post request to update the task using the id and the completed value
    try {
        fetch(url + 'updateTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${encodeURIComponent(task.id)}`
        });


        // Update the task in the global array
        const taskIndex = globalTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            globalTasks[taskIndex].completed = task.completed;
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }

    // Check which filter is currently active
    const activeFilter = document.getElementsByClassName('active')[0].id;

    // If we're on a filtered view and the task now doesn't match the filter, reapply filter
    if ((activeFilter === 'activeButton' && task.completed) ||
        (activeFilter === 'completedButton' && !task.completed)) {
        // Reapply the current filter immediately
        listTasks(false);
        return; // Exit early since we're refreshing the whole list
    }

    // If we're showing all tasks or the task still matches the filter, just update the UI
    // Find the task element in the DOM and update its class immediately
    const taskElement = document.querySelector(`li[data-task-id="${task.id}"]`);
    if (taskElement) {
        if (task.completed) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
    }

    // Re-sort the list
    const todoList = document.getElementsByClassName('todo-list')[0];
    const tasks = Array.from(todoList.children);

    // Sort the tasks based on completion status
    tasks.sort((a, b) => {
        const aCompleted = a.classList.contains('completed');
        const bCompleted = b.classList.contains('completed');
        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;
        return 0;
    });

    // Re-append the sorted tasks
    tasks.forEach(task => todoList.appendChild(task));
}

async function deleteTask(taskId) {
    // Remove the task from the DOM immediately
    const taskElement = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }

    // Remove from global tasks array
    globalTasks = globalTasks.filter(task => task.id !== taskId);

    // Send delete request to the backend
    try {
        fetch(url + 'deleteTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${encodeURIComponent(taskId)}`
        });
    } catch (error) {
        console.error('Error deleting task:', error);
    }
    // No need to refresh the list since we've already removed the task
}

// Function to list all tasks - only fetches from API when needed
async function listTasks(forceRefresh = false) {
    // Only fetch tasks from API if global tasks is empty or force refresh is true
    if (globalTasks.length === 0 || forceRefresh) {
        try {
            const response = await fetch(url + 'listTasks');
            const data = await response.json();
            globalTasks = data['tasks'];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return;
        }
    }

    const todoList = document.getElementsByClassName('todo-list')[0]; // get the ul tag
    todoList.innerHTML = '';

    let filteredTasks = [...globalTasks]; // Create a copy of the global tasks

    const filterButton = document.getElementsByClassName('active')[0];
    if (filterButton.id === 'activeButton') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filterButton.id === 'completedButton') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Sort tasks so completed tasks appear at the end
    const sortedTasks = filteredTasks.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
    });

    displayTasks(sortedTasks, todoList);
}

function displayTasks(sortedTasks, todoList) {
    sortedTasks.forEach(task => {
        // create a li tag
        const li = document.createElement('li');
        li.setAttribute('data-task-id', task.id); // Use data-task-id instead of key
        if (task.completed) {
            li.className = 'completed';
        }

        // create a div tag
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        // create a input tag
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = task.completed;
        input.addEventListener('change', () => completeTask(task));
        taskContent.appendChild(input);

        // create a span tag
        const span = document.createElement('span');
        span.textContent = task.description;
        taskContent.appendChild(span);

        li.appendChild(taskContent);

        // create a button tag
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        li.appendChild(deleteButton);

        // append the li tag to the todoList
        todoList.appendChild(li);
    });

}

function setActiveButton(button) {
    const filterButtons = document.getElementsByClassName('active');
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove('active');
    }
    button.classList.add('active');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');

    // Initial load of tasks from the API
    listTasks(true);

    // Add task button event listener
    if (addTaskButton) {
        addTaskButton.addEventListener('click', async () => {
            try {
                var guid = () => {
                    var w = () => { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
                    return `${w()}${w()}-${w()}-${w()}-${w()}-${w()}${w()}${w()}`;
                }
                // Check if the input field is empty or contains only whitespace
                if (document.getElementById('taskInput').value.trim() === '') {
                    return;
                }

                // Create the new task object
                const newTask = {
                    id: guid(),
                    description: document.getElementById('taskInput').value,
                    completed: false
                };

                const formBody = `id=${encodeURIComponent(newTask.id)}&description=${encodeURIComponent(newTask.description)}&completed=${newTask.completed}`;
                // Send a POST request to the API endpoint with the task description
                const response = await fetch(url + 'createTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody
                });

                const data = await response.json();

                // Add the new task to global tasks array
                globalTasks.push(newTask);

                // Refresh the task list with the updated global tasks
                listTasks(false);

                // clear the input field
                document.getElementById('taskInput').value = '';
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        });
    } else {
        console.error('Add task button not found!');
    }


    const allButton = document.getElementById('allButton');
    const activeButton = document.getElementById('activeButton');
    const completedButton = document.getElementById('completedButton');

    allButton.addEventListener('click', () => {
        setActiveButton(allButton);
        // No need for API call, just filter the existing tasks
        listTasks(false);
    });

    activeButton.addEventListener('click', () => {
        setActiveButton(activeButton);
        // No need for API call, just filter the existing tasks
        listTasks(false);
    });

    completedButton.addEventListener('click', () => {
        setActiveButton(completedButton);
        // No need for API call, just filter the existing tasks
        listTasks(false);
    });
});
