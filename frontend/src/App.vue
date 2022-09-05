<template>
  <div id="app">
    <div class="flex flex-col items-center">
      <div class="mt-4 py-4 bg-gray-100 rounded-lg px-3 flex leading-none">
        <button aria-hidden="false" class="mr-4 hover:cursor-pointer focus:outline outline-2 btn-manual"
                @click="this.readManual">
          <PhBookOpen aria-hidden="true" class="inline"/>
          Handbuch vorlesen
        </button>
        <input id="turnSoundOn" alt="Sound aktivieren" class="w-4 h-4 mr-1 hover:cursor-pointer"
               type="checkbox"
               @change="toggleSound"/>
        <label class="hover:cursor-pointer input-sound" for="turnSoundOn">Sprachausgabe aktivieren</label>
      </div>
      <div class="flex pt-4 pb-2">
        <div
            v-for="list in lists"
            :key="list.title"
            class="flex flex-col bg-gray-100 rounded-lg px-3 pt-6 pb-2 column-width rounded mr-4 list"
        >
          <label :for="list._id" class="text-gray-700 font-semibold font-sans tracking-wide text-sm">Liste</label>
          <h1 :aria-label="list.title + ': Klicke zum Bearbeiten'" class="list__title font-semibold">
            <label-edit :id="list._id" :pkey="list._id" :text="list.title" placeholder="Kein Titel"
                        tabindex="0" v-bind:text="list.title"
                        v-on:text-updated-blur="updateList(list, $event)"></label-edit>
          </h1>

          <draggable :animation="200" :list="list.cards" ghost-class="ghost-card" group="cards"
                     @change="updateLists(lists)">
            <card
                v-for="card in list.cards"
                :key="card.id"
                :card="card"
                :list="list"
                :lists="lists"
                :todos="card.todos"
                class="mt-3 cursor-move"
            ></card>
          </draggable>
          <quick-edit v-model="newCardValue" buttonCancelText="Abbrechen" buttonOkText="Karte speichern"
                      class="mt-3 mb-10 add-card"
                      @input="addCard(list)">
            Karte hinzufügen
          </quick-edit>
          <button class="inline text-sm link-delete mt-auto ml-auto" @click="deleteList(list)">Liste löschen</button>
        </div>
        <div class="bg-gray-100 rounded-lg px-3 pt-2 pb-2 column-width rounded mr-4 new-list list">

          <quick-edit v-model="newListValue" buttonCancelText="Abbrechen" buttonOkText="Liste speichern"
                      class="add-list"
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
import Card from "./components/Card.vue";
import axios from "axios";
import LabelEdit from 'label-edit';
import QuickEdit from 'vue-quick-edit';
import {PhBookOpen} from "phosphor-vue";
import Vue from 'vue';

Vue.component('quick-edit', QuickEdit);

const listsURL = 'http://localhost:3000/lists',
    newURL = 'http://localhost:3000/lists/new',
    updateURL = 'http://localhost:3000/lists/update',
    deleteURL = 'http://localhost:3000/lists/delete',
    addCardURL = 'http://localhost:3000/lists/addCard';

const synth = window.speechSynthesis;


export default {
  name: "App",
  components: {
    draggable,
    Card,
    LabelEdit,
    PhBookOpen,
  },
  data() {
    return {
      lists: [],
      newCardValue: "",
      newListValue: "",
      soundOn: false,
    };
  },

  created() {
    this.focusChanged();
    this.getLists();
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.key === 'Dead' || event.altKey && event.key === 'n' || event.altKey && event.key === 'N') {
        document.querySelector('.add-list .vue-quick-edit__link ').click();
      }
    });
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.key == 'ArrowUp') {
        if (document.getElementById("turnSoundOn").checked) {
          document.getElementById("turnSoundOn").checked = false;
        } else {
          document.getElementById("turnSoundOn").checked = true;
        }
        this.toggleSound();
      }
    });
  },
  methods: {
    readManual() {
      let manualSpeech = new SpeechSynthesisUtterance('Willkommen im Kanban-Board! Hinweise zur Bedienung: Mit dem Schalter "Sprachausgabe" oder dem Tastaturkürzel Alt+S+Aufwärtspfeil können Sie die Sprachausgabe aktivieren oder deaktivieren. Mit den Tastaturkürzeln Alt+Rechtspfeil beziehungsweise Alt+Linkspfeil können Sie eine ausgewählte Karte in die nächste beziehungsweise vorherige Liste verschieben. Mit der Tabulator-Taste können Sie durch die Steuerelemente navigieren. Mit Tabulator + Shift navigieren Sie zurück. Ende des Bedienhandbuchs.');
      manualSpeech.lang = 'de-DE';
      synth.speak(manualSpeech);
    },
    toggleSound() {
      let soundOnSpeech = new SpeechSynthesisUtterance('Sprachausgabe wurde aktiviert.'),
          soundOffSpeech = new SpeechSynthesisUtterance('Sprachausgabe wurde deaktiviert.');
      soundOnSpeech.lang = 'de-DE';
      soundOffSpeech.lang = 'de-DE';
      if (this.soundOn === false) {
        this.soundOn = true;
        synth.speak(soundOnSpeech);
      } else {
        this.soundOn = false;
        synth.speak(soundOffSpeech);
      }
    },
    async getLists() {
      let tempList = [];

      axios.get(listsURL).then(res => {
        tempList = res.data;
        this.lists = tempList;
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
            this.getLists();
            if (this.soundOn) {
              let addListSpeech = new SpeechSynthesisUtterance('Die neue Liste ' + list.title + " wurde angelegt.");
              addListSpeech.lang = 'de-DE';
              synth.speak(addListSpeech);
              this.newListValue = '';
            }
          })
          .catch((error) => {
            console.log(error);
            if (this.soundOn) {
              let addListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Erstellen der Liste.');
              addListErrorSpeech.lang = 'de-DE';
              synth.speak(addListErrorSpeech);
            }
          });
    },
    addCard(list) {
      let card = {
        title: this.newCardValue,
        description: "",
      };
      axios.post(addCardURL + "/" + list._id, card)
          .then((response) => {
            this.getLists();
            if (this.soundOn) {
              let addCardSpeech = new SpeechSynthesisUtterance('Die neue Karte ' + card.title + " wurde zur Liste " + list.title + " hinzugefügt.");
              addCardSpeech.lang = 'de-DE';
              synth.speak(addCardSpeech);
              this.newCardValue = '';
            }
          })
          .catch((error) => {
            console.log(error);
            if (this.soundOn) {
              let addCardErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Erstellen der Karte.');
              addCardErrorSpeech.lang = 'de-DE';
              synth.speak(addCardErrorSpeech);
            }
          });
    },
    async updateLists(lists) {
      await lists.forEach((list) => {
        this.updateList(list, null);
      });
    },
    updateList(list, listTitle) {
      let oldTitle = list.title;
      if (listTitle != null) {
        list.title = listTitle;
      }
      axios.patch(updateURL + "/" + list._id, list)
          .then((response) => {
            if (listTitle != null && this.soundOn) {
              let updateListSpeech = new SpeechSynthesisUtterance('Die Liste ' + oldTitle + ' wurde in ' + list.title + ' umbenannt.');
              updateListSpeech.lang = 'de-DE';
              synth.speak(updateListSpeech);
            }
          })
          .catch((error) => {
            console.log(error);
            if (this.soundOn) {
              let updateListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Aktualisieren der Liste.');
              updateListErrorSpeech.lang = 'de-DE';
              synth.speak(updateListErrorSpeech);
            }
          });
    },
    deleteList(list) {
      if (confirm("Willst du die Liste " + list.title + " wirklich löschen? Achtung: Dadurch werden auch alle Karten in der Liste gelöscht.")) {
        const indexOfObject = this.lists.findIndex(object => {
          return object._id === list._id;
        });
        this.lists.splice(indexOfObject, 1);
        axios.delete(deleteURL + "/" + list._id)
            .then((response) => {
              this.getLists();
              if (this.soundOn) {
                let deleteListSpeech = new SpeechSynthesisUtterance('Die Liste ' + list.title + " wurde gelöscht.");
                deleteListSpeech.lang = 'de-DE';
                synth.speak(deleteListSpeech);
              }
            })
            .catch((error) => {
              let deleteListErrorSpeech = new SpeechSynthesisUtterance('Fehler beim Löschen der Liste.');
              deleteListErrorSpeech.lang = 'de-DE';
              if (error.response) {
                console.log(error.response);
                if (this.soundOn) {
                  synth.speak(deleteListErrorSpeech);
                }
              } else if (error.request) {
                console.log(error.request);
                if (this.soundOn) {
                  synth.speak(deleteListErrorSpeech);
                }
              } else if (error.message) {
                console.log(error.message);
                if (this.soundOn) {
                  synth.speak(deleteListErrorSpeech);
                }
              }
            });
      }
    },
    focusChanged() {
      window.addEventListener('keydown', (event) => {
        if (event.altKey && event.key == 'ArrowRight') {
          let listId = event.target.attributes['value'].value,
              card = event.target.__vue__.card;
          this.lists.forEach(async (list, li) => {
            if (list._id == listId) {
              this.lists[li + 1].cards.push(card);
              this.lists[li].cards.splice(this.lists[li].cards.indexOf(card), 1);

              if (this.soundOn) {
                let cardMovedSpeech = new SpeechSynthesisUtterance('Die Karte ' + card.title + ' wurde von der Liste ' + this.lists[li].title + ' in die Liste ' + this.lists[li + 1].title + ' verschoben.');
                cardMovedSpeech.lang = 'de-DE';
                synth.speak(cardMovedSpeech);
              }
              await this.updateLists(this.lists);
            }
          });
        }

        if (event.altKey && event.key == 'ArrowLeft') {
          let listId = event.target.attributes.value.value,
              card = event.target.__vue__.card;
          this.lists.forEach(async (list, li) => {
            if (list._id == listId) {
              this.lists[li - 1].cards.push(card);
              this.lists[li].cards.splice(this.lists[li].cards.indexOf(card), 1);

              if (this.soundOn) {
                let cardMovedSpeech = new SpeechSynthesisUtterance('Die Karte ' + card.title + ' wurde von der Liste ' + this.lists[li].title + ' in die Liste ' + this.lists[li - 1].title + ' verschoben.');
                cardMovedSpeech.lang = 'de-DE';
                synth.speak(cardMovedSpeech);
              }
              await this.updateLists(this.lists);
            }
          });
        }
      });
    },
  },
}
</script>
<style lang="scss">
@import 'assets/styles/general.scss';
@import 'assets/styles/app.scss';
</style>
