const inputTitle = document.getElementById("input-title");
const inputText = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
const addTodosButton = document.getElementById("add-todos-button");
const saveEditTodosButton = document.getElementById("save-todos-button");
const prioritySelect = document.getElementById("priority");
const sortBySelect = document.getElementById("sort-by");
let icon = document.getElementById("icon");

document.addEventListener("DOMContentLoaded", getTodos);
addTodosButton.addEventListener("click", addTodos);
listContainer.addEventListener("click", clickOnButtons);
sortBySelect.addEventListener("change", sortSelect);
icon.addEventListener("click", clickOnIcon);

let toDos = [];

function getTodos() {
  toDos = JSON.parse(localStorage.getItem("toDos")) || [];
  sortSelect();
  displayTodos();
}

function clickOnIcon() {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    icon.src = "images/icons/sun.png";
  } else {
    icon.src = "images/icons/moon.png";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (saveEditTodosButton.style.display === "inline") {
      saveEditTodosButton.click();
    } else {
      addTodosButton.click();
    }
  }
});

function addTodos() {
  if (inputTitle.value === "" && inputText.value === "") {
    return;
  } else {
    let toDo = {
      title: inputTitle.value,
      text: inputText.value,
      priority: prioritySelect.value,
      isChecked: false,
    };
    toDos.push(toDo);
    displayTodos();
    inputTitle.value = "";
    inputText.value = "";
  }
}

function clickOnButtons(e) {
  if (e.target.closest(".remove-todos-button")) {
    let id = e.target.getAttribute("data-id");
    let todo = toDos[id];
    let todoIndex = toDos.indexOf(todo);
    toDos.splice(todoIndex, 1);
    saveTodosInLocalStorage();
    displayTodos();
  }

  if (e.target.closest(".edit-todos-button")) {
    let id = e.target.getAttribute("data-id");
    let todo = toDos[id];
    inputTitle.value = todo.title;
    inputText.value = todo.text;
    saveEditTodosButton.style.display = "inline";

    document.addEventListener("click", function (e) {
      if (e.target.id === "save-todos-button") {
        todo.title = inputTitle.value;
        todo.text = inputText.value;
        inputTitle.value = "";
        inputText.value = "";
        saveEditTodosButton.style.display = "none";
        saveTodosInLocalStorage();
        displayTodos();
      }
    });
  }
}

function saveTodosInLocalStorage() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function displayTodos() {
  listContainer.innerHTML = "";

  for (let i = 0; i < toDos.length; i++) {
    let div = document.createElement("div");

    let isCheckedTodo = document.createElement("input");
    isCheckedTodo.setAttribute("type", "checkbox");
    isCheckedTodo.setAttribute("data-id", i);
    div.appendChild(isCheckedTodo);

    let priorityValue = document.createElement("span");
    priorityValue.innerHTML = toDos[i].priority;
    div.appendChild(priorityValue);

    let h4 = document.createElement("h4");
    h4.innerHTML = toDos[i].title;
    div.appendChild(h4);

    let p = document.createElement("p");
    p.innerHTML = toDos[i].text;
    div.appendChild(p);
    saveTodosInLocalStorage();

    let editTodosButton = document.createElement("button");
    editTodosButton.classList.add("edit-todos-button");
    editTodosButton.setAttribute("data-id", i);
    editTodosButton.innerHTML = "Edit";
    div.appendChild(editTodosButton);

    let removeTodosButton = document.createElement("button");
    removeTodosButton.classList.add("remove-todos-button");
    removeTodosButton.setAttribute("data-id", i);
    removeTodosButton.innerHTML = "Remove";
    div.appendChild(removeTodosButton);

    listContainer.appendChild(div);

    isCheckedTodo.addEventListener("change", (e) => {
      div.classList.toggle("todo-wrapper");
      let id = e.target.getAttribute("data-id");
      let todo = toDos[id];
      todo.isChecked = e.target.checked;
      saveTodosInLocalStorage();
    });
  }
}

function sortSelect() {
  let selectedPriority = sortBySelect.value;

  toDos.sort((a, b) => (a.priority === selectedPriority ? -1 : 1));
  saveTodosInLocalStorage();
  displayTodos();
}
