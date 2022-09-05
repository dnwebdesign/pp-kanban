<template>
  <div>
    <div class="mb-8 mt-1">
      <div :aria-label="'Fortschritt: '+this.progress+' %'" aria-hidden="false" class="text-sm"></div>
      <progress-bar :options="options" :value="this.progress" aria-hidden="true"
      ></progress-bar>
    </div>
    <ul v-for="todo in mutatedTodoList.todos" :id="'todolist-' + mutatedTodoList._id">
      <li>
        <input :id="'todolist-'+todo._id" v-model="todo.done" :checked="todo.done"
               class="w-4 h-4"
               type="checkbox" @click="updateTodo(mutatedTodoList._id, todo, false, $event.target.checked)">
        <label :for="'todolist-'+todo._id" class="ml-1 mr-2 cursor-pointer todo-label">{{ todo.content }}</label>
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

const synth = window.speechSynthesis;

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
      app: this.$parent.$parent.$parent.$parent,
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
          color: '#333',
          backgroundColor: '#999',
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
  mounted() {
  },
  methods: {
    async getTodoList(todoList) {
      await axios.get(getTodoListURL + "/" + todoList._id).then(res => {
        this.mutatedTodoList = res.data;
      }).catch(error => {
        console.log(error);
        if (this.app.soundOn) {
          let getTodoListSpeech = new SpeechSynthesisUtterance('Fehler beim Laden der Todo-Liste.');
          getTodoListSpeech.lang = 'de-DE';
          synth.speak(getTodoListSpeech);
        }
      });
    },
    async addTodo(todoList) {
      let todo = {
        content: this.newTodoValue,
        done: false,
      };
      this.newTodoValue = '';
      await axios.post(addToDoURL + "/" + todoList._id, todo)
          .then((response) => {
            this.mutatedTodoList.todos.push(todo);
            if (this.app.soundOn) {
              let addTodoSpeech = new SpeechSynthesisUtterance('Das Todo ' + todo.content + ' wurde der Todo-Liste ' + todoList.title + ' hinzugefügt.');
              addTodoSpeech.lang = 'de-DE';
              synth.speak(addTodoSpeech);
            }
          })
          .catch((error) => {
            let addTodoErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Hinzufügen des Todos.');
            addTodoErrorSpeech.lang = 'de-DE';

            if (error.response) {
              console.log(error.response);
              if (this.app.soundOn) {
                synth.speak(addTodoErrorSpeech);
              }
            } else if (error.request) {
              console.log(error.request);
              if (this.app.soundOn) {
                synth.speak(addTodoErrorSpeech);
              }
            } else if (error.message) {
              console.log(error.message);
              if (this.app.soundOn) {
                synth.speak(addTodoErrorSpeech);
              }
            }
          });
      this.countCheckedTodos(this.mutatedTodoList._id);
      await this.getTodoList(todoList);
    },
    updateTodo(todoListId, todo, nameChanged, isChecked) {
      todo.done = isChecked;
      if (nameChanged === true) {
        todo.content = this.newTodoValue;
      }
      this.newTodoValue = '';
      axios.patch(updateToDoURL + "/" + todo._id, todo)
          .then((response) => {
            if (this.app.soundOn) {
              let updateTodoSpeech = new SpeechSynthesisUtterance('Das Todo wurde aktualisiert.');
              updateTodoSpeech.lang = 'de-DE';
              synth.speak(updateTodoSpeech);
            }
          })
          .catch((error) => {
            let updateTodoErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Aktualisieren des Todos.');
            updateTodoErrorSpeech.lang = 'de-DE';
            if (error.response) {
              console.log(error.response);
              if (this.app.soundOn) {
                synth.speak(updateTodoErrorSpeech);
              }
            } else if (error.request) {
              console.log(error.request);
              if (this.app.soundOn) {
                synth.speak(updateTodoErrorSpeech);
              }
            } else if (error.message) {
              console.log(error.message);
              if (this.app.soundOn) {
                synth.speak(updateTodoErrorSpeech);
              }
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
        }).then((response) => {
          if (this.app.soundOn) {
            let deleteTodoSpeech = new SpeechSynthesisUtterance('Das Todo ' + todo.content + 'wurde gelöscht .');
            deleteTodoSpeech.lang = 'de-DE';
            synth.speak(deleteTodoSpeech);
          }
        }).catch((error) => {
          let deleteTodoErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Löschen des Todos.');
          deleteTodoErrorSpeech.lang = 'de-DE';
          if (error.response) {
            console.log(error.response);
            if (this.app.soundOn) {
              synth.speak(deleteTodoErrorSpeech);
            }
          } else if (error.request) {
            console.log(error.request);
            if (this.app.soundOn) {
              synth.speak(deleteTodoErrorSpeech);
            }
          } else if (error.message) {
            console.log(error.message);
            if (this.app.soundOn) {
              synth.speak(deleteTodoErrorSpeech);
            }
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
      this.$parent.$parent.countTodos();
    }
  },
};
</script>
