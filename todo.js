//LISTS
const listContainer = $("[data-lists]");
const inputList = $(".input-new-list");
const delList = $(".delete.del-list");
const addList = $(".add.ad-list");

//TASKS
const listTasksCount = $(".count-tasks span");
const listTitle = $("[data-list-title]");
const clearCompletedTasks = $(".delete.del-tasks");
const tasksContainer = $("[data-tasks]");
const inputTask = $(".input-new-task");
const addTask = $(".add.ad-task");

// key for saving list data as value. i.e as key-value pair.
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "task.selectedList";

//load lists from local storage at given key if present else start as empty list.
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || null;
let selectedList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY)) || {};
let tasks = [];



listContainer.on("click", event => {
  if (event.target.tagName.toLowerCase() === "li") {
    selectedListId = event.target.id;

    var sl = lists.find(list => list.id === selectedListId);

    selectedList = {
      id: sl.id,
      name: sl.name,
      tasks: sl.tasks,
      remainingTasks: sl.remainingTasks,
      completedTasks: sl.completedTasks
    };

    saveAndRender();
  }
});

//if selected list is to be deleted.
delList.on("click", function () {
  //new list which contains all list which are not selected.
  //becoz only selected list is deleted.
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  selectedList.id = "";
  selectedList.name = "No list Selected";
  selectedList.tasks = [];
  selectedList.remainingTasks = 0;
  selectedList.completedTasks = 0;
  listTasksCount.text(0);
  // selectedListTitle = null;
  saveAndRender();
});


clearCompletedTasks.on("click", function () {
  //new list which contains all list which are not selected.
  //becoz only selected list is deleted.

  for (var i = selectedList.tasks.length - 1; i >= 0; i--) {


    if (selectedList.tasks[i].completed === true) {
      selectedList.tasks.splice(i, 1);

    }

  }

  //after deleting all completed tasks no completed task is left.
  selectedList.completedTasks = 0;

  saveAndRender();
  renderRemainingTasks();

});

// input new list into lists by pressing [ENTER] key.
inputList.on("keydown", event => {

  if (inputList.val() !== "" && event.keyCode === 13) {

    listInput();

  } else {

    if (inputList.val() === "" && event.keyCode === 13) {
      alert("[ LIST : name not given ! ]");
    }

  }
});

// input new list into lists by pressing [MOUSE-LEFT] click key.
addList.on("click", () => {

  if (inputList.val() !== "") {

    listInput();

  } else {

    if (inputList.val() === "") {
      alert("[ LIST : name not given ! ]");
    }

  }
});


function listInput() {
  //prevents default refreshing of page.
  event.preventDefault();

  //stores the name of input list.
  const listName = inputList.val();

  //stores the created object of new list.
  const list = createList(listName);

  //clearing the input box.
  inputList.val("");

  lists.push(list);

  //this renders the pre-loaded data with new data .
  saveAndRender();

}

//function that returns an object of list with its key as id,name,tasks.
function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
    remainingTasks: 0,
    completedTasks: 0
  };
}


inputTask.on("keydown", event => {

  if (inputTask.val() !== "" && event.keyCode === 13 && selectedList.name !== "No list Selected") {

    taskInput();

  } else if (inputTask.val() === "" && event.keyCode === 13) {

    alert("[ TASK : no name ! ]");

  } else {

    if (inputTask.val() !== "" &&
      event.keyCode === 13 && selectedList.name === "No list Selected") {

      alert("[ LIST : First create a new list ! ]\n                     or \n[ LIST : Select an existing list ! ].");

    }

  }

});

addTask.on("click", () => {

  if (inputTask.val() !== "" && selectedList.name !== "No list Selected") {

    taskInput();

  } else if (inputTask.val() === "") {

    alert("[ TASK : no name ! ]");

  } else {

    if (inputTask.val() !== "" && selectedList.name === "No list Selected") {

      alert("[ LIST : First create a new list ! ]\n                     or \n[ LIST : Select an existing list ! ].");

    }

  }
});


function taskInput() {
  //prevents default refreshing of page.
  event.preventDefault();

  //stores the name of input list.
  const taskName = inputTask.val();

  //stores the created object of new list.
  const task = createTask(taskName);

  //clearing the input box.
  inputTask.val("");

  selectedList.tasks.push(task);

  selectedList.remainingTasks++;

  //this renders the pre-loaded data with new data .
  saveAndRender();
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    completed: false
  };
}


// function to save the list to local storage at particular key in string format.
function save() {
  //store list data to the local storage key .
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_KEY,
    JSON.stringify(selectedList)
  );
}

// function to display our list on startup.
function render() {
  // clearing the element.
  clearElement(listContainer);

  renderLists();

  //if any list is selected only the display its tasks.
  if (selectedListId == null) {

    $(".todo-list").css("display", "none");
  } else {
    $(".todo-list").css("display", "");
    listTitle.text(selectedList.name.toUpperCase());

    //clears the previous tasks in the list.
    clearElement(tasksContainer);

    renderTasks();
    renderRemainingTasks();
  }
}

function renderLists() {
  lists.forEach(list => {
    var listElement = $(
      "<li class='list-name' id='" + list.id + "' ></li>"
    ).text(list.name);
    //check if the list id is the selected list id.
    if (list.id === selectedListId) {
      listElement.addClass("selected-list");
    }
    listContainer.append(listElement);
  });
}


function renderTasks() {

  selectedList.tasks.forEach(task => {
    // console.log(task);

    const taskLabel = $(" <label for = " + task.id + " > < /label>").text(
      task.name
    );
    // console.log(taskLabel);

    const delIcon = $('<i class="material-icons" id="' + task.id + '">delete_forever</i>').one(
      "click",
      function () {

        var delete_task = $(this).parent();
        var index = selectedList.tasks.findIndex(task => task.id === this.id);


        if (selectedList.tasks[index].completed === false)
          selectedList.remainingTasks--;
        else {
          selectedList.completedTasks--;
        }
        save();
        renderRemainingTasks();

        selectedList.tasks.splice(index, 1);

        delete_task.fadeOut(function () {
          delete_task.remove();
        });
        save();
      });


    const checkBox = $(
      '<input type="checkbox" class="check-box" name="" id=' + task.id + '>'
    ).click(function () {

      taskLabel.toggleClass("line-through");

      //if the task was not completed the it is changed to completed.  
      if (selectedList.tasks.find(task => task.id === this.id).completed === false) {
        selectedList.tasks.find(list => list.id === this.id).completed = true;
        selectedList.completedTasks++;
        selectedList.remainingTasks--;
      } else {
        selectedList.tasks.find(list => list.id === this.id).completed = false;
        selectedList.completedTasks--;
        selectedList.remainingTasks++;
      }
      save();
      renderRemainingTasks();

    });

    if (task.completed === true) {
      console.log("checked");
      taskLabel.addClass("line-through");
      checkBox.prop("checked", "true");
      save();
    }

    var taskElement = $('<div class="task"></div>').append(
      checkBox,
      taskLabel,
      delIcon
    );

    tasksContainer.append(taskElement);
  });
}

function updateList(id) {
  var index = lists.findIndex(list => list.id === id);
  lists[index] = selectedList;
}

function renderRemainingTasks() {
  updateList(selectedListId);
  listTasksCount.text(selectedList.remainingTasks);
}

// function that calls both save() and render() functions.
function saveAndRender() {
  save();
  render();
}



//function to remove the children of the given element.
function clearElement(element) {
  //element.children() returns all children of element.
  $(element.children()).remove();
}

//this loads and renders the preloaded data.
render();