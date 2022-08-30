<template>
  <Transition name="modal">
    <div v-if="show" id="cardModal" class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header mb-2">
            <h1 :aria-label="task.title" class="font-semibold text-xl task-title">
              <label-edit :pkey="task._id" :placeholder="task.title" :text="task.title"
                          tabindex="0" v-bind:text="task.title"
                          v-on:text-updated-blur="updateTask(task, $event, null)"></label-edit>
            </h1>
            <div class="text-sm font-medium task-in-list">in Liste <span class="italic">{{ list.title }}</span></div>
          </div>
          <div class="modal-body">
            <label :for="'lists-selection' + task._id" class="inline mb-2 text-sm">Verschieben
              nach: </label>
            <select :id="'lists-selection' + task._id"
                    class="lists-selection mb-6 bg-gray-100 italic border border-gray-300 text-gray-900 text-sm rounded-lg inline py-0.5 px-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    @change="moveCard(task, $event.target.value)">
              <option disabled selected value> -- Ziel auswählen --</option>
              <option v-for="list in lists" v-if="list._id != task.list" :value="list._id">
                {{ list.title }}
              </option>
            </select>

            <label :for="'task-description' + task._id" class="block text-sm">Beschreibung:</label>
            <textarea :id="'task-description' + task._id"
                      class="task-description rounded-lg p-2 mb-6"
                      @change="updateTask(task, null, $event.target.value)">{{ task.description }}</textarea>

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
                @click="deleteTask(task)"
            >Karte löschen
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

const updateTaskURL = 'http://localhost:3000/lists/updateTask',
    deleteTaskURL = 'http://localhost:3000/lists/deleteTask',
    addToDoListURL = 'http://localhost:3000/lists/addTodoList',
    updateToDoListURL = 'http://localhost:3000/lists/updateTodoList',
    deleteToDoListURL = 'http://localhost:3000/lists/deleteTodoList';

const synth = window.speechSynthesis;

export default {
  components: {
    ToDos,
    LabelEdit,
  },
  data() {
    return {
      app: this.$parent.$parent.$parent,
      todoLists: [],
      newTodolistValue: '',
      newTaskTitleValue: '',
      newTaskDescriptionValue: '',
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
      default: () => ([])
    },
  },
  watch: {
    show: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        if (this.show === true) {
          setTimeout(function () {
            const focusableElements =
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                modal = document.querySelector('#cardModal'), // select the modal by it's id
                firstFocusableElement = modal.querySelectorAll(focusableElements)[0], // get first element to be focused inside modal
                focusableContent = modal.querySelectorAll(focusableElements),
                lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

            document.addEventListener('keydown', function (e) {
              let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

              if (!isTabPressed) {
                return;
              }

              if (e.shiftKey) { // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableElement) {
                  lastFocusableElement.focus(); // add focus for the last focusable element
                  e.preventDefault();
                }
              } else { // if tab key is pressed
                if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                  firstFocusableElement.focus(); // add focus for the first focusable element
                  e.preventDefault();
                }
              }
            });
            firstFocusableElement.focus();
          }, 500);
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    moveCard(task, targetListId) {
      let currentListId = '',
          currentList = [],
          targetList = [];

      currentListId = task.list;

      currentList = this.lists.find(list => list._id === currentListId);
      targetList = this.lists.find(list => list._id === targetListId);

      targetList.tasks.push(task);
      currentList.tasks.splice(this.lists.find(list => list._id == currentListId).tasks.indexOf(task), 1);

      task.list = targetListId;

      this.updateTask(task, null, null);

      this.app.updateLists(this.lists);

      if (this.app.soundOn) {
        let cardMovedSpeech = new SpeechSynthesisUtterance('Die Karte ' + task.title + ' wurde von der Liste "' + currentList.title + '" in die Liste ' + targetList.title + ' verschoben.');
        cardMovedSpeech.lang = 'de-DE';
        synth.speak(cardMovedSpeech);
      }
    },
    updateTask(task, taskTitle, taskDescription) {
      let oldTitle = task.title;
      if (taskTitle != null) {
        task.title = taskTitle;
      }
      if (taskDescription != null) {
        task.description = taskDescription;
      }
      axios.patch(updateTaskURL + "/" + task._id, task)
          .then((response) => {
            console.log(response);
            this.app.getLists();
            if (taskTitle != null && this.app.soundOn) {
              let updateTaskTitleSpeech = new SpeechSynthesisUtterance('Die Karte ' + oldTitle + ' wurde in ' + task.title + ' umbenannt.');
              updateTaskTitleSpeech.lang = 'de-DE';
              synth.speak(updateTaskTitleSpeech);
            }
            if (taskDescription != null && this.app.soundOn) {
              let updateTaskDescSpeech = new SpeechSynthesisUtterance('Die Beschreibung der Karte ' + task.title + ' wurde aktualisiert.');
              updateTaskDescSpeech.lang = 'de-DE';
              synth.speak(updateTaskDescSpeech);
            }
          })
          .catch((error) => {
            let updateTaskErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Aktualisieren der Karte.');
            updateTaskErrorSpeech.lang = 'de-DE';
            if (error.response) {
              console.log(error.response);
              if (this.app.soundOn) {
                synth.speak(updateTaskErrorSpeech);
              }
            } else if (error.request) {
              console.log(error.request);
              if (this.app.soundOn) {
                synth.speak(updateTaskErrorSpeech);
              }
            } else if (error.message) {
              console.log(error.message);
              if (this.app.soundOn) {
                synth.speak(updateTaskErrorSpeech);
              }
            }
          });
    },
    deleteTask(task) {
      if (confirm("Willst du die Karte " + task.title + " wirklich löschen? Achtung: Dadurch werden auch alle Daten auf der Karte wie Beschreibung, Todo-Listen und so weiter gelöscht.")) {
        const indexOfObject = this.list.tasks.findIndex(object => {
          return object._id === this.list._id;
        });
        this.list.tasks.splice(indexOfObject, 1);
        axios.delete(deleteTaskURL + "/" + task._id)
            .then((response) => {
              this.app.updateLists(this.lists);
              if (this.app.soundOn) {
                let deleteCardSpeech = new SpeechSynthesisUtterance('Die Karte ' + task.title + " wurde gelöscht.");
                deleteCardSpeech.lang = 'de-DE';
                synth.speak(deleteCardSpeech);
              }
            })
            .catch((error) => {
              let deleteCardErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Löschen der Karte.');
              deleteCardErrorSpeech.lang = 'de-DE';
              if (error.response) {
                console.log(error.response);
                if (this.app.soundOn) {
                  synth.speak(deleteCardErrorSpeech);
                }
              } else if (error.request) {
                console.log(error.request);
                if (this.app.soundOn) {
                  synth.speak(deleteCardErrorSpeech);
                }
              } else if (error.message) {
                console.log(error.message);
                if (this.app.soundOn) {
                  synth.speak(deleteCardErrorSpeech);
                }
              }
            });
      }
    },
    addTodoList(task) {
      let todoList = {
        title: this.newTodolistValue,
      };
      axios.post(addToDoListURL + "/" + task._id, todoList)
          .then((response) => {
            this.app.getLists();
            if (this.app.soundOn) {
              let addTodoListSpeech = new SpeechSynthesisUtterance('Die Todo-Liste ' + todoList.title + ' wurde der Karte "' + task.title + ' hinzugefügt.');
              addTodoListSpeech.lang = 'de-DE';
              synth.speak(addTodoListSpeech);
            }
          })
          .catch((error) => {
            let addTotoListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Erstellen der Todo-Liste.');
            addTotoListErrorSpeech.lang = 'de-DE';
            if (error.response) {
              console.log(error.response);
              if (this.app.soundOn) {
                synth.speak(addTotoListErrorSpeech);
              }
            } else if (error.request) {
              console.log(error.request);
              if (this.app.soundOn) {
                synth.speak(addTotoListErrorSpeech);
              }
            } else if (error.message) {
              console.log(error.message);
              if (this.app.soundOn) {
                synth.speak(addTotoListErrorSpeech);
              }
            }
          });
    },
    updateTodoList(todoList) {
      let oldTitle = '';
      oldTitle = todoList.title;
      todoList.title = this.newTodolistValue;
      axios.patch(updateToDoListURL + "/" + todoList._id, todoList)
          .then((response) => {
            this.app.getLists();
            if (this.app.soundOn) {
              let updateTodoListSpeech = new SpeechSynthesisUtterance('Die Todo-Liste wurde von ' + oldTitle + ' in "' + todoList.title + ' umbenannt.');
              updateTodoListSpeech.lang = 'de-DE';
              synth.speak(updateTodoListSpeech);
            }
          })
          .catch((error) => {
            let updateTotoListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Aktualisieren der Todo-Liste.');
            updateTotoListErrorSpeech.lang = 'de-DE';
            if (error.response) {
              console.log(error.response);
              if (this.app.soundOn) {
                synth.speak(updateTotoListErrorSpeech);
              }
            } else if (error.request) {
              console.log(error.request);
              if (this.app.soundOn) {
                synth.speak(updateTotoListErrorSpeech);
              }
            } else if (error.message) {
              console.log(error.message);
              if (this.app.soundOn) {
                synth.speak(updateTotoListErrorSpeech);
              }
            }
          });
    },
    deleteTodoList(todoList) {
      if (confirm("Willst du die Todo-Liste " + todoList.title + " wirklich löschen? Achtung: Dadurch werden auch alle To-Dos in der Todo-Liste gelöscht.")) {
        const indexOfObject = this.task.todoLists.findIndex(object => {
          return object._id === todoList._id;
        });
        this.task.todoLists.splice(indexOfObject, 1);
        axios.delete(deleteToDoListURL + "/" + todoList._id, todoList)
            .then((response) => {
              if (this.app.soundOn) {
                let deleteTodoListSpeech = new SpeechSynthesisUtterance('Die Todo-Liste ' + todoList.title + ' wurde gelöscht.');
                deleteTodoListSpeech.lang = 'de-DE';
                synth.speak(deleteTodoListSpeech);
              }
            })
            .catch((error) => {
              let deleteTotoListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Löschen der Todo-Liste.');
              deleteTotoListErrorSpeech.lang = 'de-DE';
              if (error.response) {
                console.log(error.response);
                if (this.app.soundOn) {
                  synth.speak(deleteTotoListErrorSpeech);
                }
              } else if (error.request) {
                console.log(error.request);
                if (this.app.soundOn) {
                  synth.speak(deleteTotoListErrorSpeech);
                }
              } else if (error.message) {
                console.log(error.message);
                if (this.app.soundOn) {
                  synth.speak(deleteTotoListErrorSpeech);
                }
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
