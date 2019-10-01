const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

// clearCompleteTasksButton.addEventListener('click', e => {
//   const selectedList = lists.find(list => list.id === selectedListId)
//   selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
//   saveAndRender()
// })

//code for removing complete tasks
$(document).on('click', 'button[data-clear-complete-tasks-button]', function(event) {
  event.preventDefault();
  /* Act on the event */
  const selectedList = lists.find(list => list.id === $(this).attr('data-id'))
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
});

// delete button functionality
$(document).on('click', 'button[data-delete-list-button]', function(event) {
  event.preventDefault();
  /* Act on the event */
  lists = lists.filter(list => list.id !== $(this).attr('data-id'))
  saveAndRender()
});


// deleteListButton.addEventListener('click', e => {
//   lists = lists.filter(list => list.id !== selectedListId)
//   selectedListId = null
//   saveAndRender()
// })

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

// new task form functionality
$(document).on('submit', 'form[data-new-task-form]',function(event) {
  event.preventDefault();
  /* Act on the event */
  var new_input = $(this).find('input[data-new-task-input]')
  const taskName = new_input.val()
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  new_input.value = null
  const selectedList = lists.find(list => list.id === $(this).attr('id'))
  selectedList.tasks.push(task)
  saveAndRender()

});

// newTaskForm.addEventListener('submit', e => {
//   e.preventDefault()
//   const taskName = newTaskInput.value
//   if (taskName == null || taskName === '') return
//   const task = createTask(taskName)
//   newTaskInput.value = null
//   const selectedList = lists.find(list => list.id === selectedListId)
//   selectedList.tasks.push(task)
//   saveAndRender()
// })

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { 
    id: Date.now().toString(), 
    name: name, 
    complete: false
  }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    createCards(); //newly added
    // listTitleElement.innerText = selectedList.name
    // renderTaskCount(selectedList)
    // clearElement(tasksContainer)
    // renderTasks(selectedList)
  }
}

//action listener for completed task
$(document).on('click', '.checked-input', function(event) {
  event.preventDefault();
  /* Act on the event */
  const selectedList = lists.find(list => list.id === $(this).attr('data-id'))
  selectedList.task = selectedList.tasks.find(task => task.id == $(this).attr('id'))
  selectedList.task.complete = !selectedList.task.complete
  saveAndRender()

});
// end of action listener

// code for making the cards
function createCards() {
  $('#task_lists').html('');
  lists.forEach(item => {
    const incompleteTaskCount = item.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"

    task_html = "";

    item.tasks.forEach(task => {  
      task_html += `<div class="task">
        <input type="checkbox" class="checked-input" data-id="${item.id}" id="${task.id}">
        <label for="${task.id}">
          <span class="custom-checkbox"></span>
          ${task.name}
        </label>
      </div>`;
    })

    $('#task_lists').append(
      `<div class="card todo-list m-2" data-list-display-container>
        <div class="card-header todo-header text-white">
          <h2 class="list-title" data-list-title>${item.name}</h2>
          <p class="task-count" data-list-count>${incompleteTaskCount} ${taskString} remaining</p>
        </div>

        <div class="card-body" style="background-color: white;">
            <div class="todo-body">
              <div class="tasks" data-tasks>${task_html}</div>

              <div class="new-task-creator">
                <form action="" id="${item.id}" data-new-task-form>
                    <input type="text" data-new-task-input class="new task" placeholder="new task name" aria-label="new task name"/>
                    <button class="btn create" aria-label="create new task">+</button>
                </form>
              </div>

          </div>
        </div>
        <div class="p-2" style="background-color: white;">
              <button class="btn btn-primary btn-rounded p-2 text-white float-left" data-id="${item.id}" data-clear-complete-tasks-button>Clear completed tasks</button>
              <button class="btn btn-danger btn-rounded p-2 text-white float-right" data-id="${item.id}" data-delete-list-button>Delete list</button>
            </div>
          
        </div>`
      );
  })
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    taskElement.out
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()