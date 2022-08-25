<template>
  <div>
    <div class="mb-8 mt-1">
      <span class="text-sm">Fortschritt: </span>
      <progress-bar :options="options" :value="this.progress"
      ></progress-bar>
    </div>
    <ul v-for="todo in mutatedTodoList.todos" :id="'todolist-' + mutatedTodoList._id">
      <li>
        <input :id="'todolist-'+todo._id" v-model="todo.done" :checked="todo.done"
               class="w-4 h-4"
               type="checkbox" @click="updateTodo(mutatedTodoList._id, todo, false, $event.target.checked)">
        <label :for="'todolist-'+todo._id" class="ml-1 mr-2 cursor-pointer">{{ todo.content }}</label>
        <div class="todo-buttons inline-block">
          <quick-edit v-model="newTodoValue" buttonCancelText="Abbrechen" buttonOkText="Speichern" class="inline"
                      @input="updateTodo(mutatedTodoList._id, todo, true, todo.done, $event.target)"
                      @show="newTodoValue = todo.content">
            Editieren
          </quick-edit>
          <button class="link-delete inline text-sm" @click="deleteTodo(todo)">Löschen</button>
        </div>
      </li>
    </ul>
    <quick-edit v-model="newTodoValue" buttonCancelText="Abbrechen" buttonOkText="Speichern"
                @input="addTodo(mutatedTodoList)"
                @show="newTodoValue = ' '">
      To-Do hinzufügen
    </quick-edit>
  </div>
</template>
<script>

import axios from "axios";
import ProgressBar from 'vuejs-progress-bar';

const addToDoURL = 'http://localhost:3000/lists/addTodo',
    updateToDoURL = 'http://localhost:3000/lists/updateTodo',
    deleteToDoURL = 'http://localhost:3000/lists/deleteTodo',
    getTodoListURL = 'http://localhost:3000/lists/getTodoList';

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
  data: function () {
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
          color: '#29a3a3',
          backgroundColor: '#a33987',
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
      },
      newTodoValue: '',
      mutatedTodoList: this.todoList,
    }
  },
  activated() {
    this.countCheckedTodos(this.mutatedTodoList._id);
  },
  methods: {
    async getTodoList(todoList) {
      await axios.get(getTodoListURL + "/" + todoList._id).then(res => {
        this.mutatedTodoList = res.data;
      }).catch(error => {
        console.log(error)
      });
    },
    async addTodo(todoList) {
      let todo = {
        content: this.newTodoValue,
        done: false,
      };
      this.newTodoValue = '';
      this.mutatedTodoList.todos.push(todo);
      await axios.put(addToDoURL + "/" + todoList._id, todo)
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
      this.countCheckedTodos(this.mutatedTodoList._id);
      this.getTodoList(todoList);
    },
    updateTodo(todoListId, todo, nameChanged, isChecked, val) {
      console.log("val is: ", val);
      todo.done = isChecked;
      if (nameChanged === true) {
        todo.content = this.newTodoValue;
      }
      this.newTodoValue = '';
      axios.patch(updateToDoURL + "/" + todo._id, todo)
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
      this.countCheckedTodos(todoListId);
    },
    deleteTodo(todo) {
      if (confirm("Willst du " + todo.content + " wirklich löschen?")) {
        const indexOfObject = this.mutatedTodoList.todos.findIndex(object => {
          return object._id === todo._id;
        });
        this.mutatedTodoList.todos.splice(indexOfObject, 1);
        axios.delete(deleteToDoURL + "/" + todo._id, {
          data: todo
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          if (error.response) {
            console.log(error.response);
          } else if (error.request) {
            console.log(error.request);
          } else if (error.message) {
            console.log(error.message);
          }
        });
      }
      this.countCheckedTodos(this.mutatedTodoList._id);
    },
    countCheckedTodos(todoListId) {
      let checkboxes = document.querySelectorAll('#todolist-' + todoListId + ' input[type="checkbox"]').length,
          checked = document.querySelectorAll('#todolist-' + todoListId + ' input[type="checkbox"]:checked').length;

      if (checked === 0) {
        this.progress = 0;
      } else {
        this.progress = Math.round(100 / checkboxes * checked);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/styles/todos.scss';
</style>
