window.onload = () => {
    initialUISetup();
}

const initialUISetup = () => {
    document.getElementById('search').addEventListener('mouseover', () => addClassWithTimeout('searchLabel', 'hovered', 500));
    document.getElementById('search').addEventListener('mouseout', () => removeClassWithTimeout('searchLabel', 'hovered', 500));
    document.getElementById('search').addEventListener('keyup', (event) => searchInputHandler(event))
    document.getElementById('addTaskInput').addEventListener('keyup', (event) => validateField(event));
    document.getElementById('addButton').addEventListener('click', addNewTask);
    radioHandlersSetup();
}

const addClassWithTimeout = (id, className, timeout) => {
    setTimeout(() => {
        document.getElementById(id).classList.add(className)
    }, timeout)
}

const removeClassWithTimeout = (id, className, timeout) => {
    setTimeout(() => {
        document.getElementById(id).classList.remove(className)
    }, timeout)
}

const addClassWithoutTimeout = (id, className) => {
    document.getElementById(id).classList.add(className)
}

const removeClassWithoutTimeout = (id, className) => {
    document.getElementById(id).classList.remove(className)
}

const validateField = (event) => {
    if (event.target.value.length > 0) {
        enableAddTaskButton();
    } else {
        disableAddTaskButton();
    }
    if(event.key === 'Enter' || event.keyCode === 13) {
        addNewTask();
    }
}

const disableAddTaskButton = () => {
    const button = document.getElementById('addButton');
    removeClassWithoutTimeout('addButton', 'valid');
    button.setAttribute('disabled', '');
}

const enableAddTaskButton = () => {
    const button = document.getElementById('addButton');
    addClassWithoutTimeout('addButton', 'valid');
    button.removeAttribute('disabled');
}

const addNewTask = () => {
    const inputElement = document.getElementById('addTaskInput');
    const taskWrapper = document.createElement('div');
    const id = generateID(10);
    taskWrapper.innerHTML = getTaskTemplate(inputElement.value, id).trim();
    document.getElementById('taskList').append(taskWrapper.firstChild);
    inputElement.value = '';
    disableAddTaskButton();
    document.getElementById(id).addEventListener('click', (event) => onRadioClick(event));
}

const changeTaskStatus = (id) => {
    const taskElement = document.getElementById(id);
    taskElement.remove();
    document.getElementById('doneTaskList').append(taskElement);
}

const getTaskTemplate = (value, id) => {
    return `<div class="task plainTask" id="${id}">
                <div class="taskName">
                    <div class="radio leftElement">
                        <img width="15" src="src/images/check.png">
                    </div>
                    <span class="taskTitle">${value}</span>
                </div>
            </div>`
}

const generateID = (idLength) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const onRadioClick = (event) => {
    const taskElement = event.target.closest('.task.plainTask');
    if(taskElement){
        changeTaskStatus(taskElement.getAttribute('id'));
    }
}

const radioHandlersSetup = () => {
    const radioButtons = document.getElementsByClassName('radio');
    for (const radio of radioButtons) {
        radio.removeEventListener('click', (event) => onRadioClick(event));
        radio.addEventListener('click', (event) => onRadioClick(event));
    }
}

const searchInputHandler = (event) => {
    if (event.target.value.length > 0) {
        filterTasks(event.target.value);
    } else {
        clearFiltration();
    }
}

const filterTasks = (text) => {
    const taskElementsList = document.getElementsByClassName('task');
    for (const taskElement of taskElementsList){
        const taskTitle = taskElement.getElementsByClassName('taskTitle')[0];
        if(!taskTitle || !taskTitle.innerHTML.includes(text)) {
            taskElement.classList.add('hidden');
        }
    }
}

const clearFiltration = () => {
    const taskElementsList = document.getElementsByClassName('task');
    for (const taskElement of taskElementsList) {
        taskElement.classList.remove('hidden');
    }
}

const stringConstants = {
    localStorageKey: 'taskList',
    localStorageDoneKey: 'doneTasks',
}

const storageTemplate = JSON.stringify({taskList: []});

const initialStorageSetup = () => {
    const initialStorage = getStorage(stringConstants.localStorageKey);
    if (!initialStorage) {
        localStorage.setItem(stringConstants.localStorageKey, storageTemplate);
        localStorage.setItem(stringConstants.localStorageDoneKey, storageTemplate);
    }
}

const getTaskStorageLocation = (id) => {
    const activeStorage = getStorage(stringConstants.localStorageKey);
    if (JSON.parse(activeStorage).taskList.find((task) => task.id.localeCompare(id) === 0)) {
        return stringConstants.localStorageKey;
    } else {
        return stringConstants.localStorageDoneKey;
    }
}

const getTasksFromStorage = (key) => {
    const taskListString = getStorage(key);
    if (!taskListString) {
        initialStorageSetup();
    }
    return JSON.parse(getStorage(key)).taskList;
}

const addTaskToStorage = (task, key) => {
    const taskListString = getStorage(key);
    const taskList = JSON.parse(taskListString);
    taskList.taskList.push(task);
    localStorage.setItem(key, JSON.stringify(taskList));
}

const removeTaskFromStorage = (id, key) => {
    const taskListString = getStorage(key);
    const taskList = JSON.parse(taskListString);
    const newList = taskList.taskList.filter((task) => {
        if (task.id.localeCompare(id) === 0) {
            addTaskToStorage(task, key.localeCompare(stringConstants.localStorageKey) === 0 ? stringConstants.localStorageDoneKey : stringConstants.localStorageKey);
        } else {
            return task;
        }
    });
    localStorage.setItem(key, JSON.stringify({taskList: newList}));
}

const getStorage = (key) => {
    return localStorage.getItem(key);
}