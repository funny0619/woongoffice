async function completeTask(task) {
    task.completed = !task.completed;
    // post request to update the task using the id and the completed value
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
    // refresh the task list
    await listAllTasks();
}

async function deleteTask(taskId) {
    fetch('http://localhost:8000/api/deleteTask/' + taskId + '/', {
        method: 'DELETE'
    });
    // refresh the task list
    await listAllTasks();
}

// Function to list all tasks
async function listAllTasks() {
    try {
        const response = await fetch('http://localhost:8000/api/listTasks/');
        const tasks = await response.json();
        const todoList = document.getElementsByClassName('todo-list')[0]; // get the ul tag
        todoList.innerHTML = '';
        tasks['tasks'].forEach(task => {
            console.log(task);
            // create a li tag
            const li = document.createElement('li');
            li.key = task.id;
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

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');

    console.log('DOMContentLoaded');
    // Call listAllTasks when the page loads
    listAllTasks();

    // Add task button event listener
    if (addTaskButton) {
        addTaskButton.addEventListener('click', async () => {
            try {
                var guid = () => {
                    var w = () => { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
                    return `${w()}${w()}-${w()}-${w()}-${w()}-${w()}${w()}${w()}`;
                }
                // if the input field isnot  empty send the request
                // even if its just whitespace
                console.log(document.getElementById('taskInput'))
                console.log('Input field value:', document.getElementById('taskInput').value); // Debug log
                // Check if the input field is empty or contains only whitespace
                if (document.getElementById('taskInput').value.trim() === '') {
                    console.log('Input field is empty!');
                    console.log('Input field value:', document.getElementById('taskInput').value); // Debug log
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
                await listAllTasks();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        });
    } else {
        console.error('Add task button not found!');
    }
});
