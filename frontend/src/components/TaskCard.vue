<template>
  <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white" :value="task._id" tabindex="0" @keydown.enter="showModal = true" @keydown.esc="showModal = false">
    <Modal :show="showModal" @close="showModal = false" :task="task" :list="list" :lists="lists"/>
    <div @click="showModal = true">
      <div class="flex justify-between">
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{task.title}}</p>

        <img
          class="w-6 h-6 rounded-full ml-3"
          src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
          alt="Avatar"
        >
      </div>
      <div class="flex mt-4 justify-between items-center">
      </div>
    </div>
  </div>
</template>
<script>
import Badge from "./Badge.vue";
import Modal from './Modal.vue';

export default {
  components: {
    Badge,
    Modal
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
    }
  },
  methods: {
    openModal() {


    },
    closeModal() {

    }
  }
};
</script>
