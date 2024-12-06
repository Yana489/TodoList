const inputTitle = document.getElementById("input-title");
const inputText = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
const addTodoButton = document.getElementById("add-todo-button");
let saveEditTodoButton = document.getElementById("save-todo-button");
const prioritySelect = document.getElementById("priority");
const sortBySelect = document.getElementById("sort-by");
let modeIcon = document.getElementById("icon");

document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage);
addTodoButton.addEventListener("click", checkOfEmptyInput);
sortBySelect.addEventListener("change", sortSelect);
modeIcon.addEventListener("click", clickOnChangeModeIcon);
document.addEventListener("keydown", clickOnEnterButton);
inputTitle.addEventListener("input", changeButtonVisibility);
inputText.addEventListener("input", changeButtonVisibility);
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
  } else {
    modeIcon.src = "images/icons/moon.png";
  }
  localStorage.setItem("theme", theme);
}

function clickOnEnterButton(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (saveEditTodoButton.style.display === "inline") {
      saveEditTodoButton.click();
    } else {
      addTodoButton.click();
    }
  }
}

function checkOfEmptyInput() {
  if (inputTitle.value !== "" && inputText.value !== "") {
    addTodo();
  }
}

function addTodo() {
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
  changeButtonVisibility();
}

function changeButtonVisibility() {
  inputTitle.value !== "" || inputText.value !== ""
    ? (addTodoButton.style.display = "inline")
    : (addTodoButton.style.display = "none");
}

function clickOnRemoveButton(e) {
  let id = e.target.getAttribute("data-id");
  let todo = toDos[id];
  let todoIndex = toDos.indexOf(todo);
  toDos.splice(todoIndex, 1);
  saveTodosInLocalStorage();
  displayTodos();
}

function clickOnEditButton(e) {
  let id = e.target.getAttribute("data-id");
  let todo = toDos[id];
  inputTitle.value = todo.title;
  inputText.value = todo.text;
  saveEditTodoButton.style.display = "inline";

  saveEditTodoButton.replaceWith(saveEditTodoButton.cloneNode(true));
  saveEditTodoButton = document.getElementById("save-todo-button");

  saveEditTodoButton.addEventListener("click", () => saveTodo(todo));
}

function saveTodo(todo) {
  todo.title = inputTitle.value;
  todo.text = inputText.value;
  inputTitle.value = "";
  inputText.value = "";
  saveEditTodoButton.style.display = "none";
  saveTodosInLocalStorage();
  displayTodos();
  changeButtonVisibility();
}

function displayTodos() {
  listContainer.innerHTML = "";
  changeButtonVisibility();

  for (let i = 0; i < toDos.length; i++) {
    let div = createElement("div", "todo-items");

    let checkboxTodo = createElement("input", "checkbox-todo", null, {
      type: "checkbox",
      "data-id": i,
    });

    if (toDos[i].isChecked) {
      checkboxTodo.setAttribute("checked", "checked");
      div.classList.add("todo-wrapper");
    }

    let priorityValue = createElement(
      "span",
      "priority-value",
      toDos[i].priority
    );
    let checkPriorityValue = {
      1: "high",
      2: "medium",
      3: "low",
    };

    priorityValue.innerHTML = checkPriorityValue[toDos[i].priority] || "";

    let h4 = createElement("h4", "todo-title", toDos[i].title);

    let p = createElement("p", "todo-text", toDos[i].text);

    saveTodosInLocalStorage();

    let editTodoButton = createElement("button", "edit-todo-button", "Edit", {
      "data-id": i,
    });

    editTodoButton.addEventListener("click", clickOnEditButton);

    if (toDos[i].isChecked) {
      editTodoButton.setAttribute("disabled", "");
    }

    let removeTodoButton = createElement(
      "button",
      "remove-todo-button",
      "Remove",
      {
        "data-id": i,
      }
    );

    removeTodoButton.addEventListener("click", clickOnRemoveButton);

    div.append(
      checkboxTodo,
      priorityValue,
      h4,
      p,
      editTodoButton,
      removeTodoButton
    );
    listContainer.appendChild(div);

    checkboxTodo.addEventListener("change", (e) => {
      div.classList.toggle("todo-wrapper");
      let id = e.target.getAttribute("data-id");
      let todo = toDos[id];
      todo.isChecked = e.target.checked;

      editTodoButton.disabled = e.target.checked;

      saveTodosInLocalStorage();
    });
  }
  toDos.length > 0
    ? (sortBySelect.style.display = "block")
    : (sortBySelect.style.display = "none");
}
function createElement(tag, className, content, attribute) {
  let element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.innerHTML = content;
  if (attribute) {
    for (let key in attribute) {
      element.setAttribute(key, attribute[key]);
    }
  }
  return element;
}

function sortSelect() {
  let selectedPriority = sortBySelect.value;

  toDos.sort((a, b) => (a.priority === selectedPriority ? -1 : 1));
  saveTodosInLocalStorage();
  displayTodos();
}
