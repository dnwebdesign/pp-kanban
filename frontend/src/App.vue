<template>
  <div id="app">
    <div class="flex justify-center">
      <div class="min-h-screen flex overflow-x-scroll py-12">
        <div
            v-for="list in lists"
            :key="list.title"
            class="bg-gray-100 rounded-lg px-3 py-10 column-width rounded mr-4"
        >
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm"></p>
          <label-edit v-bind:text="list.title" :placeholder="list.title"  :pkey="list._id" tabindex="0" v-on:text-updated-blur="textUpdated()"></label-edit>

          <draggable :list="list.tasks" :animation="200" ghost-class="ghost-card" group="tasks" @change="updateLists">
            <task-card
                v-for="(task) in list.tasks"
                :key="task.id"
                :task="task"
                :list="list"
                :lists="lists"
                :todos="task.todos"
                class="mt-3 cursor-move"
                :value="list._id"
                autofocus
            ></task-card>
          </draggable>
          <button :id="'btn-add-task-' + list._id" class="mt-3 bg-gray-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" @click="addTaskDialog($event, list)">Aufgabe hinzufügen</button>
          <div class="add-task-to-list hidden" :id="'add-task-to-list-' + list._id">
            <textarea></textarea>
            <button class="mt-3 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded" @click="cancelAddTask(list)">Abbrechen</button>
            <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded" @click="addTask(list)">Aufgabe hinzufügen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import './assets/css/tailwind.css';
import draggable from "vuedraggable";
import TaskCard from "./components/TaskCard.vue";
import axios from "axios";
import LabelEdit from 'label-edit';

const listsURL = 'http://localhost:3000/lists',
      updateURL = 'http://localhost:3000/lists/update',
      newTaskURL = 'http://localhost:3000/lists/addTask';

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
    };
  },

  created() {
    this.focusChanged();
    axios.get(listsURL).then(res => {
      this.lists = res.data;
    }).catch(error => {
      console.log(error)
    });
  },
  methods: {
    addTaskDialog: function($event, list){
      document.getElementById("add-task-to-list-" + list._id).style.display = "block";
      document.getElementById("btn-add-task-" + list._id).style.display = "none";
      document.querySelector("#add-task-to-list-" + list._id + " textarea").focus();

    },
    cancelAddTask(list) {
      document.getElementById("btn-add-task-" + list._id).style.display = "block";
      document.getElementById("add-task-to-list-" + list._id).style.display = "none";
    },
    addTask(list) {
      let task = {
        title: '' + document.querySelector("#add-task-to-list-" + list._id + " textarea").value,
      };
      list.tasks.push(task);
      axios.post(newTaskURL + "/" + list._id, task)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    updateLists() {
      this.lists.forEach((list, li) => {
        axios.patch(updateURL + "/" + list._id, list)
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
      });
    },
    textUpdated: function(text){
      console.log("text with id "+ this.$vnode.key + " updated: " + text);
    },
    focusChanged () {
      window.addEventListener('keydown', (event) => {
        let synth = window.speechSynthesis;

        if (event.altKey && event.key == 'ArrowRight') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if(list._id == listId){
              this.lists[li+1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);

              if(soundOn) {
                let utterThis1 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li+1].title);
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
            if(list._id == listId){
              this.lists[li-1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);

              if(soundOn) {
                let utterThis2 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li-1].title);
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
  watch: {
  },
};
</script>

<style>
.moving-task {
  opacity: 0.5;
  background: #F7FAFC;
  border: 1px solid #4299e1;
}
</style>
