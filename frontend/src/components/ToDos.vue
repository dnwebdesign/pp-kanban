<template>
  <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
    <progress-bar
        :options="options"
        :value="this.progress"
    ></progress-bar>
    <ul v-for="todo in todoList.todos" id="todo-list">
      <li>
        <input :id="todo._id" v-model="todo.done" :checked="todo.done"
               class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
               type="checkbox" @click="countCheckedTodos">
        <label :for="todo._id" class="ml-2 text-gray-900 dark:text-gray-300">{{ todo.content }}</label>
      </li>
    </ul>
    <button :id="'btn-add-todo-' + todoList._id"
            class="mt-3 bg-gray-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            @click="addTodoDialog(todoList)">ToDo hinzufügen
    </button>
    <div :id="'add-todo-' + todoList._id" class="add-todo hidden">
      <textarea></textarea>
      <button class="mt-3 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded" @click="cancelAddTodo(todoList)">
        Abbrechen
      </button>
      <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded" @click="addTodo(todoList)">
        Todo hinzufügen
      </button>
    </div>
  </div>
</template>
<script>

import axios from "axios";
import ProgressBar from 'vuejs-progress-bar';

const addToDoURL = 'http://localhost:3000/lists/addTodo';

export default {
  components: {
    ProgressBar
  },
  props: {
    todoList: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {},
  data() {
    return {
      progress: 0,
      options: {
        text: {
          color: '#FFFFFF',
          shadowEnable: true,
          shadowColor: '#000000',
          fontSize: 10,
          fontFamily: 'Helvetica',
          dynamicPosition: false,
          hideText: false
        },
        progress: {
          color: '#2dbd2d',
          backgroundColor: '#333333',
          inverted: false
        },
        layout: {
          height: 15,
          width: 140,
          verticalTextAlign: 70,
          horizontalTextAlign: 45,
          zeroOffset: 0,
          strokeWidth: 30,
          progressPadding: 0,
          type: 'line'
        }
      }
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
            if (error.response) {
              console.log(error.response);
            } else if (error.request) {
              console.log(error.request);
            } else if (error.message) {
              console.log(error.message);
            }
          });
    },
    countCheckedTodos() {
      let checkboxes = document.querySelectorAll('#todo-list input[type="checkbox"]').length,
          checked = document.querySelectorAll('#todo-list input[type="checkbox"]:checked').length;
      console.log("Checkboxen: ", checkboxes);
      console.log("Checked: ", checked);

      this.progress = Math.round(100 / checkboxes * checked);
    }
  }
};
</script>
