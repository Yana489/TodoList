const inputTitle = document.getElementById('input-title');
const inputText = document.getElementById('input-text');
const listContainer = document.getElementById('list-container');
const addTaskButton = document.getElementById('add-task-button');

document.getElementById('todo__input').addEventListener('keydown', (e) =>{
   if(e.key === 'Enter') {
      addTask()
   };
});
addTaskButton.addEventListener('click', addTask) 

   function addTask() {
   if(inputTitle.value === '' && inputText.value === ''){
      return;
   }
   else{
      let div = document.createElement('div');
      listContainer.appendChild(div);
      let h4 = document.createElement('h4');
      h4.innerHTML = inputTitle.value;
      div.appendChild(h4);
      let p = document.createElement('p');
      p.innerHTML = inputText.value;
      div.appendChild(p);
      let removeTaskButton = document.createElement('button');
      removeTaskButton.classList.add('remove-task-button');
      removeTaskButton.innerHTML = 'Delete';
      div.appendChild(removeTaskButton);
      let editTaskButton = document.createElement('button');
      editTaskButton.classList.add('edit-task-button');
      editTaskButton.innerHTML = 'Edit';
      div.appendChild(editTaskButton);
   }
   inputTitle.value = '';
   inputText.value = '';
   saveTask();
};

listContainer.addEventListener('click', (e) => {
   if(e.target.closest('.remove-task-button')) {
      e.target.parentElement.remove();
      saveTask();
   };
});

function saveTask(){
   localStorage.setItem('task', listContainer.innerHTML)
}

listContainer.innerHTML = localStorage.getItem('task');
