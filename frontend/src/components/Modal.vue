<script>
import ToDos from './ToDos';
import axios from "axios";

const addToDoListURL = 'http://localhost:3000/lists/addTodoList';

export default {
  components: {
    ToDos
  },
  data() {
    return {
      todoLists: [],
    };
  },
  props: {
    show: Boolean,
    task: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Object,
      default: () => ({})
    },
    lists: {
      type: Array,
      default: () => ({})
    },
  },
  created() {
  },
  methods: {
    addTodoListDialog(task) {
      document.getElementById("add-todolist-" + task._id).style.display = "block";
      document.getElementById("btn-add-todolist-" + task._id).style.display = "none";
      document.querySelector("#add-todolist-" + task._id + " textarea").focus();
    },
    cancelAddTodoList(task) {
      document.getElementById("btn-add-todolist-" + task._id).style.display = "block";
      document.getElementById("add-todolist-" + task._id).style.display = "none";
    },
    addTodoList(task) {
      let todoList = {
        title: '' + document.querySelector("#add-todolist-" + task._id + " textarea").value,
      };
      task.todoLists.push(todoList);
      axios.put(addToDoListURL + "/" + task._id, todoList)
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
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <slot name="header">{{task.title}}</slot>
          </div>

          <div class="modal-body">
            Verschieben nach:
            <select>
              <option v-for="list in lists" :value="list.title">
                {{ list.title }}
              </option>
            </select>

            <button :id="'btn-add-todolist-' + task._id" class="mt-3 bg-gray-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" @click="addTodoListDialog(task)">Todo-Liste hinzufügen</button>
            <div class="add-todolist hidden" :id="'add-todolist-' + task._id">
              <textarea></textarea>
              <button class="mt-3 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded" @click="cancelAddTodoList(task)">Abbrechen</button>
              <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded" @click="addTodoList(task)">Todo-List hinzufügen</button>
            </div>
            <div v-for="todoList in task.todoLists">
              {{ todoList.title }}
              <to-dos :todoList="todoList"></to-dos>
            </div>
          </div>

          <div class="modal-footer">

            <slot name="footer">
              <button
                  class="modal-default-button"
                  @click="$emit('close')"
              >OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
