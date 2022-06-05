<template>
  <div id="app">
    <div class="flex justify-center">
      <div class="min-h-screen flex overflow-x-scroll py-12">
        <div
            v-for="list in lists"
            :key="list.title"
            class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
        >
          <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{list.title}}</p>
          <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
          <draggable :list="list.tasks" :animation="200" ghost-class="ghost-card" group="tasks">
            <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
            <task-card
                v-for="(task) in list.tasks"
                :key="task.id"
                :task="task"
                :lists="lists"
                class="mt-3 cursor-move"
                :value="list.id"
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

export default {
  name: "App",
  components: {
    draggable,
    TaskCard,
  },
  created() {
    this.focusChanged();
  },
  data() {
    return {
      lists: [
        {
          id: 1,
          title: "Backlog",
          tasks: [
            {
              id: 1,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            },
            {
              id: 2,
              title: "Provide documentation on integrations",
              date: "Sep 12",
            },
            {
              id: 3,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design",
            },
            {
              id: 4,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            },
            {
              id: 5,
              title: "Test checkout flow",
              date: "Sep 15",
              type: "QA",
            }
          ]
        },
        {
          id: 2,
          title: "In Progress",
          tasks: [
            {
              id: 6,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design",
            },
            {
              id: 7,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            },
            {
              id: 8,
              title: "Provide documentation on integrations",
              date: "Sep 12",
              type: "Backend",
            }
          ]
        },
        {
          id: 3,
          title: "Review",
          tasks: [
            {
              id: 9,
              title: "Provide documentation on integrations",
              date: "Sep 12",
            },
            {
              id: 10,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design",
            },
            {
              id: 11,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            },
            {
              id: 12,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design",
            },
            {
              id: 13,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            }
          ]
        },
        {
          id: 4,
          title: "Done",
          tasks: [
            {
              id: 14,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            },
            {
              id: 15,
              title: "Design shopping cart dropdown",
              date: "Sep 9",
              type: "Design",
            },
            {
              id: 16,
              title: "Add discount code to checkout page",
              date: "Sep 14",
              type: "Feature Request",
            }
          ]
        }
      ],
    };
  },
  methods: {
    focusChanged () {
      window.addEventListener('keyup', (event) => {

        if (event.altKey && event.key == 'ArrowRight') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if(list.id == listId){
              this.lists[li+1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);
            }
          });
        }

        if (event.altKey && event.key == 'ArrowLeft') {
          const listId = event.target.attributes.value.value,
              task = event.target.__vue__.task;
          this.lists.forEach((list, li) => {
            if(list.id == listId){
              this.lists[li-1].tasks.push(task);
              this.lists[li].tasks.splice(this.lists[li].tasks.indexOf(task), 1);
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
