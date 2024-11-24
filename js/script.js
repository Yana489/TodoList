const inputTitle = document.getElementById("input-title");
const inputText = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
const addTodosButton = document.getElementById("add-todos-button");
const saveEditTodosButton = document.getElementById("save-todos-button");
const prioritySelect = document.getElementById("priority");
const sortBySelect = document.getElementById("sort-by");
let modeIcon = document.getElementById("icon");

document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage);
addTodosButton.addEventListener("click", addTodos);
sortBySelect.addEventListener("change", sortSelect);
modeIcon.addEventListener("click", clickOnChangeModeIcon);
document.addEventListener("keydown", clickOnEnterButton);
inputTitle.addEventListener("input", AddButtonVisibility);
inputText.addEventListener("input", AddButtonVisibility);
changeTheme();

let toDos = [];

function getTodosFromLocalStorage() {
  toDos = JSON.parse(localStorage.getItem("toDos")) || [];
  sortSelect();
  displayTodos();
}

function saveTodosInLocalStorage() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function changeTheme() {
  let currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    modeIcon.src = "images/icons/sun.png";
  }
}

function clickOnChangeModeIcon() {
  document.body.classList.toggle("dark-theme");
  let theme = "light";
  if (document.body.classList.contains("dark-theme")) {
    theme = "dark";
    modeIcon.src = "images/icons/sun.png";
    localStorage.setItem("theme", theme);
  } else {
    modeIcon.src = "images/icons/moon.png";
    localStorage.setItem("theme", theme);
  }
}

function clickOnEnterButton(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (saveEditTodosButton.style.display === "inline") {
      saveEditTodosButton.click();
    } else {
      addTodosButton.click();
    }
  }
}

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
    prioritySelect.value = "Priority";
    AddButtonVisibility();
  }
}

function AddButtonVisibility() {
  if (inputTitle.value !== "" || inputText.value !== "") {
    addTodosButton.style.display = "inline";
  } else {
    addTodosButton.style.display = "none";
  }
}

function clickOnRemoveButtons(e) {
  let id = e.target.getAttribute("data-id");
  let todo = toDos[id];
  let todoIndex = toDos.indexOf(todo);
  toDos.splice(todoIndex, 1);
  saveTodosInLocalStorage();
  displayTodos();
}

function clickOnEditButtons(e) {
  let id = e.target.getAttribute("data-id");
  let todo = toDos[id];
  inputTitle.value = todo.title;
  inputText.value = todo.text;
  saveEditTodosButton.style.display = "inline";

  saveEditTodosButton.addEventListener("click", saveTodos.bind(null, id, todo));
}

function saveTodos(id, todo) {
  todo.title = inputTitle.value;
  todo.text = inputText.value;
  inputTitle.value = "";
  inputText.value = "";
  saveEditTodosButton.style.display = "none";
  saveTodosInLocalStorage();
  displayTodos();
  saveEditTodosButton.removeEventListener(
    "click",
    saveTodos.bind(null, id, todo)
  );
  AddButtonVisibility();
}

function displayTodos() {
  listContainer.innerHTML = "";
  AddButtonVisibility();

  for (let i = 0; i < toDos.length; i++) {
    let div = document.createElement("div");

    let checkboxTodo = document.createElement("input");
    checkboxTodo.setAttribute("type", "checkbox");
    checkboxTodo.setAttribute("data-id", i);

    if (toDos[i].isChecked) {
      checkboxTodo.setAttribute("checked", "checked");
      div.classList.add("todo-wrapper");
    }

    div.appendChild(checkboxTodo);

    let priorityValue = document.createElement("span");
    let checkPriorityValue = {
      1: "high",
      2: "medium",
      3: "low",
    };

    priorityValue.innerHTML = checkPriorityValue[toDos[i].priority] || "";
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

    editTodosButton.addEventListener("click", clickOnEditButtons);

    if (toDos[i].isChecked) {
      editTodosButton.setAttribute("disabled", "");
    }

    div.appendChild(editTodosButton);

    let removeTodosButton = document.createElement("button");
    removeTodosButton.classList.add("remove-todos-button");
    removeTodosButton.setAttribute("data-id", i);
    removeTodosButton.innerHTML = "Remove";

    removeTodosButton.addEventListener("click", clickOnRemoveButtons);
    div.appendChild(removeTodosButton);

    listContainer.appendChild(div);

    checkboxTodo.addEventListener("change", (e) => {
      div.classList.toggle("todo-wrapper");
      let id = e.target.getAttribute("data-id");
      let todo = toDos[id];
      todo.isChecked = e.target.checked;

      editTodosButton.disabled = e.target.checked;

      saveTodosInLocalStorage();
    });
  }
  if (toDos.length > 0) {
    sortBySelect.style.display = "block";
  } else {
    sortBySelect.style.display = "none";
  }
}

function sortSelect() {
  let selectedPriority = sortBySelect.value;

  toDos.sort((a, b) => (a.priority === selectedPriority ? -1 : 1));
  saveTodosInLocalStorage();
  displayTodos();
}
