const inputTitle = document.getElementById("input-title");
const inputText = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
const addTodosButton = document.getElementById("add-todos-button");
const prioritySelect = document.getElementById("priority");
const sortBySelect = document.getElementById("sort-by");

document.addEventListener("DOMContentLoaded", getTodos);
addTodosButton.addEventListener("click", addTodos);
listContainer.addEventListener("click", clickOnButtons);
sortBySelect.addEventListener("change", sortSelect);

let toDos = [];

function getTodos() {
  toDos = JSON.parse(localStorage.getItem("toDos")) || [];
  sortSelect();
  displayTodos();
}

document.getElementById("todo__input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodos();
  }
});

function addTodos() {
  const taskText = inputText.value;
  if (inputTitle.value === "" && inputText.value === "") {
    return;
  } else {
    let toDo = {
      title: inputTitle.value,
      text: inputText.value,
      value: prioritySelect.value,
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
  }

  if (e.target.closest(".edit-todos-button")) {
    let id = e.target.getAttribute("data-id");
    let todo = toDos[id];
    inputTitle.value = todo.title;
    inputText.value = todo.text;
    addTodosButton.innerHTML = "Save";

    addTodosButton.addEventListener("click", function () {
      let todoIndex = toDos.indexOf(todo);
      addTodosButton.innerHTML = "Add";
      saveTodosInLocalStorage();
    });
  }

  displayTodos();
}

function saveTodosInLocalStorage() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function displayTodos() {
  listContainer.innerHTML = "";

  for (let i = 0; i < toDos.length; i++) {
    let div = document.createElement("div");
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
  }
}

function sortSelect() {
  let selectedValue = sortBySelect.value;

  switch (selectedValue) {
    case "1":
      console.log("hallo");
      toDos.sort((a, b) => a.value - b.value);
      break;
    case "2":
      break;
    case "3":
      toDos.sort((a, b) => b.value - a.value);
      break;
  }
  saveTodosInLocalStorage();
}

// function editTodos(todo) {
//   toDos = JSON.parse(localStorage.getItem("toDos"));
//   inputText.value = todo.text;
//   inputTitle.value = todo.title;
//   addTodosButton.innerHTML = "Save";

//   // let todoIndex = toDos.indexOf(todo);
//   // console.log(todoIndex)
//   // toDos[todoIndex] = inputText.value;
//   saveTodosInLocalStorage();
// }
