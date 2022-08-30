<template>
  <div :value="list._id" class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white" tabindex="0"
       @keydown.enter="showModal = true" @keydown.esc="showModal = false">

    <keep-alive>
      <Modal :list="list" :lists="lists" :show="showModal" :task="task" tabindex="-1"
             @close="showModal = false"/>
    </keep-alive>
    <div aria-hidden="false" @click="showModal = true">
      <div class="flex justify-between">
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{ task.title }}</p>
        <img alt="Avatar"
             aria-hidden="true"
             class="w-6 h-6 rounded-full ml-3" src="https://placeimg.com/90/60/people" tabindex="-1">
      </div>
      <div class="flex mt-4 justify-between items-center">
        <div v-if="totalTodos != 0" id="todosProgress" class="text-sm">
          <PhCheckSquare aria-hidden="true" class="inline mr-1"/>
          <span :aria-label="checkedTodos + ' von ' + totalTodos + ' Todos erledigt.'" aria-hidden="false">
            <span aria-hidden="true">{{
                checkedTodos
              }} / {{ totalTodos }}
            </span>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Badge from "./Badge.vue";
import Modal from './Modal.vue';
import {PhCheckSquare} from "phosphor-vue";

export default {
  components: {
    Badge,
    Modal,
    PhCheckSquare
  },
  props: {
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
  computed: {
    badgeColor() {
      const mappings = {
        Design: "purple",
        "Feature Request": "teal",
        Backend: "blue",
        QA: "green",
        default: "teal"
      };
      return mappings[this.task.type] || mappings.default;
    }
  },
  data() {
    return {
      showModal: false,
      todoLists: [],
      totalTodos: 0,
      checkedTodos: 0,
    }
  },
  mounted() {
    this.countTodos();
  },
  methods: {
    countTodos() {
      this.todoLists = [];
      this.task.todoLists.forEach((tdl) => {
        this.todoLists.push(tdl);
      });

      let totalTodos = 0,
          checkedTodos = 0;

      this.todoLists.forEach((tdl) => {
        tdl.todos.forEach((todo) => {
          totalTodos++;
          if (todo.done === true) {
            checkedTodos++;
          }
        });
      });
      this.totalTodos = totalTodos;
      this.checkedTodos = checkedTodos;

      /*
      if (this.checkedTodos < this.totalTodos) {
        document.querySelector('#todosProgress').style.color = "#000";
      } else {
        document.querySelector('#todosProgress').style.color = "#228f75";
      }
       */
    }
  },
};
</script>
