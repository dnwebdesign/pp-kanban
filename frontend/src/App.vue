<template>
  <div id="app">
    <div class="flex justify-center">
      <div class="min-h-screen flex overflow-x-scroll py-12">
        <div
            v-for="list in lists"
            :key="list.title"
            class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
        >
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm"></p>
          <label-edit v-bind:text="text" :placeholder="list.title" v-on:text-updated-blur="textUpdateCallbackBlur" v-on:text-updated-enter="textUpdateCallbackEnter"></label-edit>

          <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
          <draggable :list="list.tasks" :animation="200" ghost-class="ghost-card" group="tasks">
            <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
            <task-card
                v-for="(task) in list.tasks"
                :key="task.id"
                :task="task"
                :lists="lists"
                class="mt-3 cursor-move"
                :value="list._id"
                autofocus
            ></task-card>
            <!-- </transition-group> -->
          </draggable>
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

const listsURL = 'http://localhost:3000/lists';
const updateURL = 'http://localhost:3000/lists/update';


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

              let utterThis1 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li+1].title);
              utterThis1.lang = 'en-US';
              synth.speak(utterThis1);

              axios.patch(updateURL + "/" + this.lists[li+1]._id, this.lists[li+1])
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });

              axios.patch(updateURL + "/" + list._id, this.lists[li])
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
          });


        }

        if (event.altKey && event.key == 'ArrowLeft') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if(list._id == listId){
              this.lists[li-1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);

              let utterThis2 = new SpeechSynthesisUtterance('Card: "' + task.title + '"' + ' moved from ' + this.lists[li].title + ' to ' + this.lists[li-1].title);
              utterThis2.lang = 'en-US';
              synth.speak(utterThis2);

              axios.patch(updateURL + "/" + list._id, this.lists[li])
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });

              axios.patch(updateURL + "/" + this.lists[li-1]._id, this.lists[li-1])
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
          });
        }
      });
    },
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
