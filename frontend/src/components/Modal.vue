<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <slot name="header">{{ task.title }}</slot>
          </div>

          <div class="modal-body">
            Verschieben nach:
            <select>
              <option v-for="list in lists" :value="list.title">
                {{ list.title }}
              </option>
            </select>

            <quick-edit v-model="newTodolistValue" buttonOkText="Todo-Liste speichern"
                        @input="addTodoList(task)">
              Todo-Liste hinzufügen
            </quick-edit>

            <div v-for="todoList in task.todoLists">
              <h1>{{ todoList.title }}</h1>
              <quick-edit v-model="newTodolistValue" buttonOkText="Umbenennung speichern"
                          @input="updateTodoList(todoList)">
                Umbenennen
              </quick-edit>
              <button @click="deleteTodoList(todoList)">Löschen</button>
              <keep-alive>
                <to-dos :key="todoList._id" :todoList="todoList"></to-dos>
              </keep-alive>
            </div>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button
                  class="modal-default-button mt-3 bg-gray-400 hover:bg-blue-500 text-black py-1 px-3 rounded"
                  @click="$emit('close')"
              >Zurück zum Board
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import ToDos from './ToDos';
import axios from "axios"
import LabelEdit from 'label-edit';

const addToDoListURL = 'http://localhost:3000/lists/addTodoList',
    updateToDoListURL = 'http://localhost:3000/lists/updateTodoList',
    deleteToDoListURL = 'http://localhost:3000/lists/deleteTodoList';

export default {
  components: {
    ToDos,
    LabelEdit,
  },
  data() {
    return {
      todoLists: [],
      newTodolistValue: '',
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
  methods: {
    addTodoList(task) {
      let todoList = {
        title: this.newTodolistValue,
      };
      this.task.todoLists.push(todoList);
      axios.put(addToDoListURL + "/" + task._id, todoList)
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
    updateTodoList(todoList) {
      todoList.title = this.newTodolistValue;
      axios.patch(updateToDoListURL + "/" + todoList._id, todoList)
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
    deleteTodoList(todoList) {
      if (confirm("Willst du " + todoList.title + " wirklich löschen? Dadurch werden auch alle Aufgaben in der Todo-Liste gelöscht.")) {
        const indexOfObject = this.task.todoLists.findIndex(object => {
          return object._id === todoList._id;
        });
        this.task.todoLists.splice(indexOfObject, 1);
        axios.patch(deleteToDoListURL + "/" + todoList._id, todoList)
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
      }
    },
  },
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  display: table;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  transition: all 0.3s ease;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
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
