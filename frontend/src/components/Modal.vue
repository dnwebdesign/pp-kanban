<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header mb-2">
            <h1 class="font-semibold text-xl task-title">{{ task.title }}</h1>
            <div class="text-sm font-medium task-in-list">in Liste <span class="italic">{{ list.title }}</span></div>
          </div>
          <div class="modal-body">
            <label class="inline mb-2 text-sm" for="lists-selection">Verschieben
              nach: </label>
            <select id="lists-selection"
                    class="lists-selection mb-6 bg-gray-100 italic border border-gray-300 text-gray-900 text-sm rounded-lg inline py-0.5 px-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <option v-for="list in lists" :value="list.title">
                {{ list.title }}
              </option>
            </select>

            <label class="block text-sm" for="task-description">Beschreibung:</label>
            <textarea id="task-description" class="task-description rounded-lg p-2 mb-6">
              {{ task.description }}
            </textarea>

            <quick-edit v-model="newTodolistValue" buttonCancelText="Abbrechen" buttonOkText="Speichern" class="mb-6"
                        @input="addTodoList(task)">
              Todo-Liste hinzufügen
            </quick-edit>

            <div v-for="todoList in task.todoLists"
                 class="block p-4 max-w bg-white rounded-lg border border-gray-200 mb-4">
              <span class="text-sm block">Todo-Liste</span>
              <h2 class="text-xl inline mr-3">{{ todoList.title }}</h2>
              <quick-edit v-model="newTodolistValue" buttonCancelText="Abbrechen" buttonOkText="Speichern"
                          class="inline"
                          @input="updateTodoList(todoList)">
                Umbenennen
              </quick-edit>
              <button class="inline text-sm link-delete" @click="deleteTodoList(todoList)">Löschen</button>
              <keep-alive>
                <to-dos :key="todoList._id" :todoList="todoList"></to-dos>
              </keep-alive>
            </div>
          </div>

          <div class="modal-footer mt-3">
            <button
                class="block modal-default-button mt-3 text-black py-1 px-3 rounded"
                @click="$emit('close')"
            >Zurück zum Board
            </button>

            <button
                class="block modal-default-button mt-3 text-black py-1 px-3 rounded btn-delete"
                @click="$emit('close')"
            >Aufgabe löschen
            </button>
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
      axios.post(addToDoListURL + "/" + task._id, todoList)
          .then((response) => {
            console.log(response);
            this.$parent.$parent.$parent.getLists();
          })
          .catch((error) => {
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
          .then((response) => {
            console.log(response);
            this.$parent.$parent.$parent.getLists();
          })
          .catch((error) => {
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
      if (confirm("Willst du " + todoList.title + " wirklich löschen? Achtung: Dadurch werden auch alle Aufgaben in der Todo-Liste gelöscht.")) {
        const indexOfObject = this.task.todoLists.findIndex(object => {
          return object._id === todoList._id;
        });
        this.task.todoLists.splice(indexOfObject, 1);
        axios.delete(deleteToDoListURL + "/" + todoList._id, todoList)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
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
<style lang="scss">
@import '../assets/styles/modal.scss';
</style>
