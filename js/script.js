const inputTitle = document.getElementById("input-title");
const inputText = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
const addTaskButton = document.getElementById("add-task-button");
const sortSelect = document.getElementById("sort-by");

let toDos = [];
let editTodo = null;

function getTodos() {
  toDos = JSON.parse(localStorage.getItem("toDos"));
  createTodos();
}

document.getElementById("todo__input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = inputText.value;
  if (inputTitle.value === "" && inputText.value === "") {
    return;
  }
  if (addTaskButton.value === "Edit") {
    editTodos(editTodo.target.previousElementSibling.innerHTML);
    editTodo.target.previousElementSibling.innerHTML = taskText;
    addTaskButton.value = "Add";
    inputText.value = "";
    inputTitle.value = "";
  } else {
    let toDo = {
      title: inputTitle.value,
      text: inputText.value,
    };
    toDos.push(toDo);
    createTodos();
    inputTitle.value = "";
    inputText.value = "";
    saveTodosInLocalStorage(taskText);
  }
}
function updateTodo(e) {
  if (e.target.closest(".remove-task-button")) {
    e.target.parentElement.remove();
    deleteTodos(e.target.parentElement);
  }

  if (e.target.closest(".edit-task-button")) {
    inputText.value = e.target.previousElementSibling.innerHTML;
    inputText.focus();
    addTaskButton.value = "Edit";
    editTodo = e;
    editTodos(e.target.previousElementSibling.innerHTML);
  }
}

function saveTodosInLocalStorage() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function createTodos() {
  for (let i = 0; i < toDos.length; i++) {
    let div = document.createElement("div");
    div.classList.add("input");
    let h4 = document.createElement("h4");
    h4.innerHTML = toDos[i].title;
    div.appendChild(h4);

    let p = document.createElement("p");
    p.innerHTML = toDos[i].text;
    div.appendChild(p);

    let editTaskButton = document.createElement("button");
    editTaskButton.classList.add("edit-task-button");
    editTaskButton.innerHTML = "Edit";
    div.appendChild(editTaskButton);

    let removeTaskButton = document.createElement("button");
    removeTaskButton.classList.add("remove-task-button");
    removeTaskButton.innerHTML = "Remove";
    div.appendChild(removeTaskButton);

    listContainer.appendChild(div);
  }
}

function deleteTodos(todo) {
  let todoText = todo.children[0].innerHTML;
  let todoIndex = toDos.indexOf(todoText);
  toDos.splice(todoIndex, 1);
  saveTodosInLocalStorage();
}

function editTodos(todo) {
  toDos = JSON.parse(localStorage.getItem("toDos"));
  let todoIndex = toDos.indexOf(todo);
  toDos[todoIndex] = inputText.value;
  saveTodosInLocalStorage();
}
document.addEventListener("DOMContentLoaded", getTodos);
addTaskButton.addEventListener("click", addTask);
listContainer.addEventListener("click", updateTodo);
