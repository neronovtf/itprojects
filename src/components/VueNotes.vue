<template>
  <div class="main">
    <div class="new-note">
      <router-link
        :to="{
          name: 'note',
          params: { id: 'new' },
        }">
        Новая заметка
      </router-link>
    </div>
    <div class="grid">
      <VueNote
        class="note"
        v-for="note in this.$store.state.getData"
        :key = "note.key"
        :note = "note"
        @openPopup="transfer"
      />
    </div>
  </div>
</template>

<script>
import VueNote from './VueNote.vue'

export default {
  components: {
    VueNote
  },
  methods: {
    transfer(value){
      this.$emit('openPopup', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  margin: 16px 40px;
}
.new-note{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  a{
    text-decoration: none;
    background-color: $mainColor;
    color: white;
    font-size: 1.2em;
    padding: 10px;
    border-radius: $bdRadius;
  }
}
.note{
  width: 240px;
  min-height: 50px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.grid{
  margin-left: auto;
  margin-right: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

@media (min-width: 1344px){
  .grid{
    @include grid(5);
  }
}
@media (min-width: 1101px) and (max-width: 1343px) {
  .grid{
    @include grid(4);
  }
}
@media (min-width: 849px) and (max-width: 1100px) {
  .grid{
    @include grid(3);
  }
}
@media (min-width: 593px) and (max-width: 848px) {
  .grid{
    @include grid(2);
  }
}

@media (min-width: 100px) and (max-width: 592px) {
  .grid{
    @include grid(1);
  }
}
</style>