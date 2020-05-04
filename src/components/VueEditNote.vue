<template>
  <div class="main" >
    <div class="head">
      <div v-if="isNew">Новая заметка</div>
      <div v-else>Редактирование заметки</div>
      <img @click="clickCloseNote()" class="close-page" src='../assets/image/close.png' title="К списку заметок"/>
    </div>
    <input class="input_name" type="text" placeholder="Введите заголовок" v-model="noteTitle">
    <div class="list">
      <VueTask
        v-for="(task, index) in this.getTaskList"
        :key="index"
        :index="index"
        :edit="true"
        @getChange="getChange"
      />
      <div class="add">
        <span @click="fixAddNewRow()">Новый пункт</span>
      </div>
    </div>
    <div class="panel">
      <div class="box">
        <div class="button" @click="clickOpenPopup()" v-if="!this.isNew">
          <img class="edit" src='../assets/image/delete.png' title="Удалить"/>
          <div class="text">Удалить</div>
        </div>
      </div>
      <div class="box">
        <div
          class="button"
          :class="{'dont-click': !this.getStep }"
          @click="clickButtonBack()"
        >
          <img class="edit" src='../assets/image/arrow_left.png' title="Отменить"/>
          <div class="text">Отменить</div>
        </div>
      </div>
      <div class="box">
        <div
          class="button"
          :class="{ 'dont-click': this.getAllChanges.length == this.getStep }"
          @click="clickButtonGo()"
        >
          <img class="edit" src='../assets/image/arrow_right.png' title="Повторить"/>
          <div class="text">Повторить</div>
        </div>
      </div>
      <div class="box">
        <div
          class="button"
          :class="{ 'dont-click': !this.statusSaved }"
          @click="clickButtonSave()"
        >
          <img class="edit" src='../assets/image/save.png' title="Сохранить"/>
          <div class="text">Сохранить</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import VueTask from './VueTask.vue'

export default {
  components: {
    VueTask
  },
  data(){
    return {
      keyNote: null,
      isNew: true,
    }
  },
  created(){
    const urlKey = this.$route.params.id

    if(urlKey === 'new'){
      this.isNew = true
      this.setKey(Math.round(Date.now()/1000))
    }
    else{
      this.isNew = false
      this.keyNote = +urlKey
    }
    this.cloneNote(this.keyNote)

    if(!(this.getKey > -1 || this.isNew)){
      this.$emit('openPopup', {
        textHead: 'Ошибка',
        textBody: 'Такой заметки не существует ...',
        canClose: false,
        timeOut:{
          delay: 2000,
          cb: popup => {
            this.$router.push({ name: 'notes' })
            popup.close(true)
          }
        }
      });
    }
  },
  computed: {
    noteTitle: {
      get(){
        return this.getTitle
      },
      set(newValue){
        const oldValue = this.noteTitle
        this.addChange({
          cb: {
            back: _this => _this.setTitle(oldValue),
            go: _this => _this.setTitle(newValue)
          },
        })
        return this.setTitle(newValue)
      }
    },
    ...mapGetters({
      g_getNoteByKey: 'GET_NOTE_BY_KEY',
      statusSaved: 'note/GET_CAN_SAVE',
      stepSave : 'note/GET_STEP_SAVE',
      getKey: 'note/GET_KEY',
      getTitle: 'note/GET_TITLE',
      getStep: 'note/GET_STEP',
      getAllChanges: 'note/GET_UPDATES',
      getTaskList: 'note/GET_TASK_LIST',
      getLastChange: 'note/GET_LAST_UPDATE',
      getStepChange: 'note/GET_STEP_UPDATE_CB',
    }),
  },
  methods: {
    ...mapMutations({
      setStep: 'note/SET_STEP',
      setTask: 'note/SET_TASK',
      setKey: 'note/SET_KEY',
      setTitle: 'note/SET_TITLE',
      addChange: 'note/ADD_CHANGE',
      cloneNote: 'note/LOAD_NOTE_FROM_GLOBAL_DATA',
      addTask: 'note/ADD_TASK',
      deleteTask: 'note/DELETE_TASK',
      setDontSaveForStep: 'note/SET_NOT_SAVE_FOR_STEP',
      clearNote: 'note/ALL_CLEAR',
      editTask: 'note/EDIT_ITEM'
    }),
    ...mapActions({
      g_deleteNote: 'DELETE_NOTE_BY_KEY',
      saveNote: 'note/SAVE_NOTE'
    }),
    processDeleteNote(){
      this.$emit('openPopup', {
        textHead: 'Подождите',
        textBody: `Удаление заметки ...`,
        canClose: false,
      })

      this.g_deleteNote(this.keyNote).then(
        newNotes => {
          this.$emit('openPopup', {
            textHead: 'Удалена',
            textBody: 'Заметка успешно удалена!',
            timeOut:{
              delay: 1500,
              cb: thisPopup => {
                thisPopup.$store.commit('SET_DATA', newNotes)
                thisPopup.close()
                this.$router.push({ name: 'notes' })
              }
            }
          });
        },
        () => {
          this.$emit('openPopup', {
            textHead: 'Ошибка',
            textBody: 'Сервер не смог удалить заметку.',
            buttons: {
              go: {
                text: 'Повторить',
                cb: () => this.processDeleteNote(this.keyNote)
              },
              back: {
                text: 'Отмена',
                cb: thisPopup => thisPopup.close()
              }
            }
          })
        }
      )
    },
    clickOpenPopup(){
      this.$emit('openPopup', {
        textHead: 'Удалить заметку?',
        textBody: 'Данная заметка будет удалена без возможности восстановления.',
        buttons: {
          go: {
            text: 'Удалить',
            cb: () => this.processDeleteNote()
          },
          back: {
            text: 'Отмена',
            cb: thisPopup => thisPopup.close()
          }
        }
      })
    },
    fixTitle(){
      const options = {
        key: this.keyNote,
        field: 'title'
      }
      const oldValue = this.getLastChange(options) || this.g_getNoteByKey(options)
      const newValue = this.noteTitle

      if(oldValue != newValue){
        this.addChange({
          cb: {
            back: thisVueNote => thisVueNote.noteTitle = oldValue,
            go: thisVueNote => thisVueNote.noteTitle = newValue
          },
          value: this.noteTitle,
          field: 'title'
        })
      }
    },
    fixAddNewRow(){
      const data = {
        cb: {
          back: thisVueNote => thisVueNote.deleteTask(thisVueNote.getTaskList.length - 1),
          go: thisVueNote => {
            thisVueNote.addTask({
              index: thisVueNote.getTaskList.length,
              selected: false,
              text: ''
            })
          }
        },
      }
      this.addChange(data)
      data.cb.go(this)
    },
    clickButtonBack(){
      if(this.getStep > 0){
        this.setStep('back')
        this.getStepChange('back')(this)
      }
    },
    clickButtonGo(){
      if(this.getAllChanges.length != this.getStep){
        this.getStepChange('go')(this)
        this.setStep('go')
      }
    },
    clickButtonSave(){
      if(this.statusSaved){
        
        this.$emit('openPopup', {
          textHead: 'Подождите',
          textBody: 'Сохранение данных ...',
          canClose: false,
        })

        this.saveNote().then(
          () => {
            this.setDontSaveForStep(this.getStep)

            this.$emit('openPopup', {
              textHead: 'Сохранено',
              textBody: 'Данные успешно сохранены на сервере!',
              timeOut:{
                delay: 1500,
                cb: thisPopup => thisPopup.close()
              }
            });
          },
          () => {
            this.$emit('openPopup', {
              textHead: 'Ошибка',
              textBody: 'Данные не загрузились на сервер.',
              buttons: {
                go: {
                  text: 'Повторить',
                  cb: () => this.clickButtonSave()
                },
                back: {
                  text: 'Отмена',
                  cb: thisPopup => thisPopup.close()
                }
              }
            })
          }
        )
      }
    },
    clickCloseNote(){
      if(this.getAllChanges.length != this.stepSave){
        this.$emit('openPopup', {
          textHead: 'Закрыть без сохранения?',
          textBody: 'В этом случае, все изменения которые вы внесли будут утеряны. Продолжить?',
          buttons: {
            go: {
              text: 'Да',
              cb: popup => {
                popup.close()
                this.clearNote()
                this.$router.push({ name: 'notes' })
              }
            },
            back: {
              text: 'Нет',
              cb: popup => popup.close()
            }
          }
        })
      }
      else{
        this.clearNote()
        this.$router.push({ name: 'notes' })
      }
    },
    getChange(value){
      this.addChange(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  margin: 20px 40px;
}
.close-page{
  opacity: .4;
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:hover{
    opacity: 1;
  }
}
.head{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 1.3rem;
  margin-bottom: 15px;
}
.input_name{
  padding: 10px;
  border-bottom: 1px solid #ccc;
  width: 100%;
  font-size: 1.2rem;
  &:focus{
    border-bottom: 1px solid $mainColor;
  }
}
.list{
  margin-top: 25px;  
  .add{
    margin-top: 25px;
    text-align: center;
    span{
      padding: 5px 10px;
      font-size: 1.2rem;
      cursor: pointer;
      -webkit-user-select: none;
         -moz-user-select: none;
          -ms-user-select: none;
              user-select: none;
      color: silver;
      &::before{
        content: '+';
        margin-right: 10px;
        font-size: 1.5rem;
        color: gray;
      }
      &:hover{
        color: gray;
      }
    }
  }
}
.panel{
  margin-top: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
  img{
    width: 20px;
    height: 20px;
  }
  .text{
    margin-top: 5px;
    font-size: .8em;
  }
  .box{
    width: 25%;
    height: 50px;
    padding: 0 2px;
    margin-bottom: 4px;
    opacity: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  .button{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    width: 30%;
    cursor: pointer;
  }
  .dont-click{
    cursor: not-allowed;
    opacity: .4;
  }
}
</style>