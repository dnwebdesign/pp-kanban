<template>
  <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
    <ul v-for="todo in todoList.todos">
      <li><input type="checkbox" :checked="todo.done" v-model="todo.done"> {{ todo.content }}</li>
    </ul>
    <button :id="'btn-add-todo-' + todoList._id" class="mt-3 bg-gray-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" @click="addTodoDialog(todoList)">ToDo hinzufügen</button>
    <div class="add-todo hidden" :id="'add-todo-' + todoList._id">
      <textarea></textarea>
      <button class="mt-3 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded" @click="cancelAddTodo(todoList)">Abbrechen</button>
      <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded" @click="addTodo(todoList)">Todo-List hinzufügen</button>
    </div>
  </div>
</template>
<script>

import axios from "axios";

const addToDoURL = 'http://localhost:3000/lists/addTodo';

export default {
  components: {
  },
  props: {
    todoList: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
  },
  data() {
    return {
    }
  },
  methods: {
    addTodoDialog(todoList) {
      document.getElementById("add-todo-" + todoList._id).style.display = "block";
      document.getElementById("btn-add-todo-" + todoList._id).style.display = "none";
      document.querySelector("#add-todo-" + todoList._id + " textarea").focus();
    },
    cancelAddTodo(todoList) {
      document.getElementById("btn-add-todo-" + todoList._id).style.display = "block";
      document.getElementById("add-todo-" + todoList._id).style.display = "none";
    },
    addTodo(todoList) {
      let todo = {
        content: '' + document.querySelector("#add-todo-" + todoList._id + " textarea").value,
      };
      todoList.todos.push(todo);
      axios.put(addToDoURL + "/" + todoList._id, todo)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            if (error.response){
              console.log(error.response);
            } else if(error.request){
              console.log(error.request);
            } else if(error.message){
              console.log(error.message);
            }
          });
    }
  }
};
</script>
