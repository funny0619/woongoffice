async function completeTask(task) {
    task.completed = !task.completed;
    // post request to update the task using the id and the completed value
    try {
        fetch('http://localhost:8000/api/updateTask/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: task.id,
                completed: task.completed
            })
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }

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

    // Send delete request to the backend
    try {
        fetch('http://localhost:8000/api/deleteTask/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: taskId
            })
        });
    } catch (error) {
        console.error('Error deleting task:', error);
    }
    // No need to refresh the list since we've already removed the task
}

// Function to list all tasks
async function listTasks() {
    try {
        const response = await fetch('http://localhost:8000/api/listTasks/');
        var tasks = await response.json();
        const todoList = document.getElementsByClassName('todo-list')[0]; // get the ul tag
        todoList.innerHTML = '';

        const filterButton = document.getElementsByClassName('active')[0];
        if (filterButton.id === 'allButton') {
            tasks = tasks['tasks'];
        } else if (filterButton.id === 'activeButton') {
            tasks = tasks['tasks'].filter(task => !task.completed);
        } else if (filterButton.id === 'completedButton') {
            tasks = tasks['tasks'].filter(task => task.completed);
        }

        // Sort tasks so completed tasks appear at the end
        const sortedTasks = tasks.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
        });

        displayTasks(sortedTasks, todoList);

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
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

    // console.log('DOMContentLoaded');
    listTasks();

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
                // Send a POST request to the API endpoint with the task description
                const response = await fetch('http://localhost:8000/api/createTask/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Get the value of the input field when the button is clicked
                    // and send it in the request body
                    body: JSON.stringify({ id: guid(), description: document.getElementById('taskInput').value, completed: false })
                });

                const data = await response.json();
                console.log('Data parsed:', data); // Debug log

                // After creating a task, refresh the task list
                await listTasks();
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
        listTasks();
    });

    activeButton.addEventListener('click', () => {
        setActiveButton(activeButton);
        listTasks();
    });

    completedButton.addEventListener('click', () => {
        setActiveButton(completedButton);
        listTasks();
    });
});
