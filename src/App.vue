<template>
  <div id="app">
    <router-view v-if="this.showPage" @openPopup="openPopup"/>
    <VuePopup
      v-if="this.showPopup"
      :options="this.options"
      @closePopup="closePopup()"
    />
  </div>
</template>

<script>
import VuePopup from './components/VuePopup'

export default {
  name: 'App',
  data(){
    return {
      showPopup: true,
      showPage: false,
      options: null
    }
  },
  components: {
    VuePopup
  },
  methods: {
    closePopup(){
      this.showPopup = false
    },
    openPopup(options){
      this.options = options
      this.showPopup = true
    }
  },
  created() {
    this.openPopup({
      textBody: 'Соединение с сервером ...',
      canClose: false
    });

    this.$store.dispatch('runServer').then(
      () => {
        this.openPopup({
          textHead: 'Готово!',
          textBody: 'Данные с сервера получены',
          timeOut: {
            delay: 1000,
            cb: popup => {
              popup.close()
              this.showPage = true
            }
          }
        });
      },
      () => {
        this.openPopup({
          textHead: 'Ошибка',
          textBody: `Приносим свои извинения, но в данный момент сервер не отвечает.<br>
            Попробуйте зайти на сайт позже ...`,
          canClose: false
        });    
      }
    )
  }
}
</script>