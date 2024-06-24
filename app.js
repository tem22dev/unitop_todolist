const TODO_LIST_APP = 'TODO_LIST_APP';
const listTask = document.querySelector('.list-task');
const getTask = document.querySelector('input');
const btnSubmit = document.querySelector('.add-task');
const btnSubmitElement = document.querySelector('.btn-submit');
const btnEditElement = document.querySelector('.btn-edit');
const footerElement = document.querySelector('#footer');
const taskCompleteElement = document.querySelector('.task-completed');

let tasks = [];

function addTask() {
    btnSubmit.addEventListener('submit', (e) => {
        let contentTask = getTask.value;
        getTask.value = '';
        if (contentTask.length < 2) {
            alert('Vui lòng nhập ít nhất 2 ký tự!!!');
            e.preventDefault();
            return false;
        } 
        
        let indexExist = getTask.getAttribute('index');

        if (indexExist != null) {
            tasks[indexExist].taskName = contentTask;
            getTask.removeAttribute('index');
            btnSubmitElement.textContent = 'Add Task';
        } else {
            let task = {
                taskName: contentTask,
                isComplete: false
            };
            
            tasks.unshift(task);
        }
        saveTask(tasks);
        renderTask();
        markTaskComplete();
        deleteTask();
        editTask();
        countTaskComplete();
        e.preventDefault();
    });
}

function saveTask(data) {
    localStorage.setItem(TODO_LIST_APP, JSON.stringify(data));
}

function loadTask() {
    let data = JSON.parse(localStorage.getItem(TODO_LIST_APP));
    return data;
}

function renderTask() {
    let listTaskInLocal = loadTask();
    
    if (listTaskInLocal !== null) {
        tasks = loadTask();
        
        let taskHtml = listTaskInLocal.map((item) => {
            
            return /*html*/ `
                <li class="task-item" is-complete = ${item.isComplete} data-id = ${listTaskInLocal.indexOf(item)}>
                    <p class="content-task">${item.taskName}</p>
                    <div class="action">
                        <div class="edit" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>                              
                        </div>
                        <div class="remove" title="Remove">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>   
                        </div>
                    </div>
                </li>
            `;
        });
        
        listTask.innerHTML = taskHtml.join('');
    }
}

function markTaskComplete() {
    const taskItemAll = document.querySelectorAll('.content-task');
    
    taskItemAll.forEach((taskItem) => {

        taskItem.addEventListener('click',() => {
            let isComplete = taskItem.parentElement.getAttribute('is-complete');

            if (isComplete === 'true') {
                taskItem.parentElement.setAttribute('is-complete', false);
                tasks[taskItem.parentElement.dataset.id].isComplete = false;
            } else {
                taskItem.parentElement.setAttribute('is-complete', true);
                tasks[taskItem.parentElement.dataset.id].isComplete = true;
            }
            saveTask(tasks);
            renderTask();
            markTaskComplete();
            deleteTask();
            editTask();
            countTaskComplete();
        });
    });
}

function actionDeleteTask(index) {
    tasks.splice(index, 1);
    saveTask(tasks);
    renderTask();
    deleteTask();
    markTaskComplete();
    countTaskComplete();
    editTask();
}

addTask();
renderTask();



function deleteTask() {
    const listIconDeleteTask = document.querySelectorAll('.remove');
    listIconDeleteTask.forEach((itemDelete) => {
        itemDelete.addEventListener('click', () => {
            let taskParent = itemDelete.closest('.task-item');
            let index = taskParent.dataset.id;
            let deleteConfirm = confirm('Bạn chắc chắn muốn xoá công việc này ?');
            if (deleteConfirm) {
                actionDeleteTask(index);
            }
        });
    });
}

function actionEditTask(taskEdit) {
    const listActionElement = document.querySelectorAll('.action');
    let index = taskEdit.dataset.id;
    let actionElement = taskEdit.lastElementChild;
    
    listActionElement.forEach((itemAction) => {
        let isExist = itemAction.classList.contains('hide');
        if (isExist) {
            itemAction.classList.remove('hide');
        }
    });

    getTask.value = taskEdit.firstElementChild.textContent;
    actionElement.classList.add('hide');
    btnSubmitElement.textContent = 'Edit Task';
    getTask.setAttribute('index', index);
}

function editTask() {
    const listIconEditTask = document.querySelectorAll('.edit');
    listIconEditTask.forEach((itemEdit) => {
        itemEdit.addEventListener('click', () => {
            let taskParent = itemEdit.closest('.task-item');
            actionEditTask(taskParent);
        });
    });
}

function countTaskComplete() {
    let listTaskInLocal = loadTask();
    let countComplete = 0;
    listTaskInLocal.forEach((item) => {
        if (item.isComplete == true) {
            countComplete ++;
        }
    });

    taskCompleteElement.textContent = `Yeah, ${countComplete} task complete`;

    if (listTaskInLocal.length === 0) {
        taskCompleteElement.textContent = '';
    }
    
}

document.addEventListener('keyup', (e) => {
    if (e.which === 27) {
        btnSubmitElement.textContent = 'Add Task';
        getTask.value = '';
        getTask.removeAttribute('index');

        const listActionElement = document.querySelectorAll('.action');
        
        listActionElement.forEach((itemAction) => {
            let isExist = itemAction.classList.contains('hide');
            if (isExist) {
                itemAction.classList.remove('hide');
            }
        });
    }
});

deleteTask();
editTask();
markTaskComplete();
countTaskComplete();