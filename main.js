const app = Vue.createApp({
    data() {
        return {
            newTask: '',
            tasks: [],
            filter: 'all' // 'all', 'active', 'completed'
        }
    },
    created() {
        // Load tasks from localStorage when the app is created
        try {
            const savedTasks = localStorage.getItem('todo-tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
        }
    },
    computed: {
        filteredTasks() {
            let tasks = this.tasks;
            switch (this.filter) {
                case 'active':
                    return tasks.filter(task => !task.completed);
                case 'completed':
                    return tasks.filter(task => task.completed);
                default:
                    // Sort tasks so that completed tasks appear at the end
                    return [...tasks].sort((a, b) => {
                        if (a.completed && !b.completed) return 1;
                        if (!a.completed && b.completed) return -1;
                        return 0;
                    });
            }
        }
    },
    methods: {
        addTask() {
            if (this.newTask.trim()) {
                const task = {
                    id: Date.now(),
                    text: this.newTask.trim(),
                    completed: false
                };
                this.tasks.push(task);
                this.saveTasks();
                this.newTask = '';
            }
        },
        toggleTask(task) {
            task.completed = !task.completed;
            this.saveTasks();
        },
        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
        },
        saveTasks() {
            try {
                localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
            } catch (error) {
                console.error('Error saving tasks to localStorage:', error);
            }
        },
        setFilter(filter) {
            this.filter = filter;
        }
    }
})
