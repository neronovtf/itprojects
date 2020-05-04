<template>
  <div class="main" @click.self="close()">
    <div class="popup">
      <div class="head">
        <div class="title">
          <div v-if="this.text.head.length">
            {{ this.text.head }}
          </div>
        </div>
        <img
          class="img-close"
          src='../assets/image/close.png'
          @click.self="close()"
          title="Закрыть"
          v-if="this.canClose"
          />
      </div>
      <div class="body" v-if="this.text.body.length" v-html="this.text.body"/>
      <div class="buttons">
        <div
          class="button__cancel"
          @click="clickButton('back')"
          v-if="this.buttonBack.text.length"
          >
            {{ this.buttonBack.text.toUpperCase() }}
          </div>
        <div
          class="button__go"
          @click="clickButton('go')"
          v-if="this.buttonGo.text.length"
          >
            {{ this.buttonGo.text.toUpperCase() }}
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['note', 'options'],
  data(){
    return {
      canClose: true,
      timeOut: 0,
      buttonGo: {
        text: '',
        cb: () => {}
      },
      buttonBack: {
        text: '',
        cb: () => {}
      },
      text: {
        head: '',
        body: '',
      }
    }
  },
  computed: {},
  created(){
    this.getOptions()
  },
  watch: {
    options(){
      this.getOptions()
    }
  },
  methods: {
    close(root = false){
      if(this.canClose || root){
        this.$emit('closePopup')
      }
    },
    clickButton(type){
      const vm = this
      type == 'go' ? this.buttonGo.cb(vm) : this.buttonBack.cb(vm)
    },
    getOptions(){
      const options = this.options
      this.text.head = options.textHead || ''
      this.text.body = options.textBody || ''
      this.canClose = ('canClose' in options) ? options.canClose : true

      if(options.timeOut){
        const timeOut = options.timeOut
        this.timer(timeOut.delay, timeOut.cb)
      }

      if(options.buttons){
        if(options.buttons.go){
          this.buttonGo.text = options.buttons.go.text
          this.buttonGo.cb = options.buttons.go.cb
        }
        if(options.buttons.back){
          this.buttonBack.text = options.buttons.back.text
          this.buttonBack.cb = options.buttons.back.cb
        }
      }
      else{
        this.buttonGo.text = ''
        this.buttonBack.text = ''
      }
    },
    timer(delay, cb){
      setTimeout(cb, delay, this);
    }
  },
}
</script>

<style lang="scss" scoped>
img{
  height: 25px;
  width: 25px;
  opacity: .4;
}
.main{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}
.popup{
  border-radius: $bdRadius;
  background-color: white;
  min-width: 240px;
  margin: 0px 20px;
  padding: 20px;
}
.head{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  .title div{
    padding-bottom: 15px;
  }
  .img-close{
    padding-bottom: 15px;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    cursor: pointer;
    opacity: .5;
    &:hover{
      opacity: 1;
    }
  }
}
.body{
  font-size: 1.1rem;
}
.buttons{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
      -ms-flex-pack: end;
          justify-content: flex-end;
  div{
    margin-top: 20px;
    cursor: pointer;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  .button__go{
    color: $mainColor;
    margin-left: 25px;
  }
}
</style>