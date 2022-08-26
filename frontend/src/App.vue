<template>
  <div id="app">
    <div class="flex justify-center">
      <div class="flex py-10 pb-2">
        <div
            v-for="list in lists"
            :key="list.title"
            class="flex flex-col bg-gray-100 rounded-lg px-3 pt-6 pb-2 column-width rounded mr-4 list"
        >
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm"></p>
          <label-edit :pkey="list._id" :placeholder="list.title" :text="list.title"
                      tabindex="0" v-bind:text="list.title"
                      v-on:text-updated-blur="updateList(list, $event)"></label-edit>

          <draggable :animation="200" :list="list.tasks" ghost-class="ghost-card" group="tasks" @change="updateLists">
            <task-card
                v-for="(task) in list.tasks"
                :key="task.id"
                :list="list"
                :lists="lists"
                :task="task"
                :todos="task.todos"
                :value="list._id"
                autofocus
                class="mt-3 cursor-move"
            ></task-card>
          </draggable>
          <quick-edit v-model="newTaskValue" buttonOkText="Aufgabe speichern" class="mt-3 add-task-buttons"
                      @input="addTask(list)">
            Aufgabe hinzufügen
          </quick-edit>
          <button class="inline text-sm link-delete mt-auto ml-auto" @click="deleteList(list)">Liste löschen</button>
        </div>
        <div class="bg-gray-100/75 rounded-lg px-3 pt-2 pb-2 column-width rounded mr-4 new-list list">

          <quick-edit v-model="newListValue" buttonOkText="Liste speichern" class="add-list"
                      @input="addList()">
            Neue Liste hinzufügen
          </quick-edit>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import './assets/styles/tailwind.css';
import draggable from "vuedraggable";
import TaskCard from "./components/TaskCard.vue";
import axios from "axios";
import LabelEdit from 'label-edit';
import QuickEdit from 'vue-quick-edit';
import Vue from 'vue';

Vue.component('quick-edit', QuickEdit);

const listsURL = 'http://localhost:3000/lists',
    newURL = 'http://localhost:3000/lists/new',
    updateURL = 'http://localhost:3000/lists/update',
    deleteURL = 'http://localhost:3000/lists/delete',
    addTaskURL = 'http://localhost:3000/lists/addTask';

let soundOn = false;


export default {
  name: "App",
  components: {
    draggable,
    TaskCard,
    LabelEdit,
  },
  data() {
    return {
      lists: [],
      newTaskValue: "",
      newListValue: "",
    };
  },

  created() {
    this.focusChanged();
    this.getLists();
  },
  methods: {
    getLists() {
      axios.get(listsURL).then(res => {
        this.lists = res.data;
      }).catch(error => {
        console.log(error)
      });
    },
    addList() {
      let list = {
        title: this.newListValue,
      };
      axios.post(newURL, list)
          .then((response) => {
            console.log(response);
            this.getLists();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    addTask(list) {
      let task = {
        title: this.newTaskValue,
      };
      axios.post(addTaskURL + "/" + list._id, task)
          .then((response) => {
            console.log(response);
            this.getLists();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    updateLists() {
      this.lists.forEach((list) => {
        this.updateList(list, null);
      });
    },
    updateList: function (list, listTitle) {
      if (listTitle != null) {
        list.title = listTitle;
      }
      axios.patch(updateURL + "/" + list._id, list)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    },
    deleteList(list) {
      if (confirm("Willst du die Liste " + list.title + " wirklich löschen? Achtung: Dadurch werden auch alle Aufgaben in der Liste gelöscht.")) {
        const indexOfObject = this.lists.findIndex(object => {
          return object._id === list._id;
        });
        this.lists.splice(indexOfObject, 1);
        axios.delete(deleteURL + "/" + list._id, list)
            .then(async (response) => {
              console.log(response);
              this.getLists();
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
    }
    ,
    focusChanged() {
      window.addEventListener('keydown', (event) => {
        let synth = window.speechSynthesis;

        if (event.altKey && event.key == 'ArrowRight') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if (list._id == listId) {
              this.lists[li + 1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);

              if (soundOn) {
                let utterThis1 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li + 1].title);
                utterThis1.lang = 'en-US';
                synth.speak(utterThis1);
              }
            }
          });
          this.updateLists();
        }

        if (event.altKey && event.key == 'ArrowLeft') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if (list._id == listId) {
              this.lists[li - 1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);

              if (soundOn) {
                let utterThis2 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li - 1].title);
                utterThis2.lang = 'en-US';
                synth.speak(utterThis2);
              }
            }
          });
          this.updateLists();
        }
      });
    },
  },
  watch: {}
  ,
}
;
</script>
<style lang="scss">
@import 'assets/styles/general.scss';
@import 'assets/styles/app.scss';
</style>
