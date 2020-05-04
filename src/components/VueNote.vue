<template>
  <div class="note">
    <div class="title">{{ note.title }}</div>
    <div class="details">
      <VueTask
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        :edit="false"
      />
      <div class="footer">
        <span class="more" v-if="this.isMore">...</span>
        <div class="panel">
          <router-link
            :to="{
              name: 'note',
              params: { note_data: note, id: note.key },
            }">
            <img class="edit" src='../assets/image/edit.png' title="Редактировать"/>
          </router-link>
          <img
            class="delete"
            src='../assets/image/delete.png'
            @click="showPopup(note)"
            title="Удалить"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTask from './VueTask.vue'

export default {
  props: ['note'],
  components: {
    VueTask
  },
  data(){
    return {
      tasks: [],
      isDone: false,
      taskList: this.note.todos,
      isMore: false,
    }
  },
  created(){
    if(this.taskList && this.taskList.length > 3){
      this.isMore = true
      this.tasks = this.note.todos.slice(0,3)
    }
    else{
      this.tasks = this.note.todos
    }
  },
  methods: {
    processDeleteNote(keyNote){
      this.$emit('openPopup', {
        textHead: 'Подождите',
        textBody: `Удаление заметки ...`,
        canClose: false,
      })

      this.$store.dispatch('DELETE_NOTE_BY_KEY', keyNote)
      .then(
        newNotes => {
          this.$emit('openPopup', {
            textHead: 'Удалена',
            textBody: 'Заметка успешно удалена!',
            timeOut:{
              delay: 1500,
              cb: _this => {
                _this.$store.commit('SET_DATA', newNotes)
                _this.close()
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
                cb: () => this.processDeleteNote(keyNote)
              },
              back: {
                text: 'Отмена',
                cb: _this => _this.close()
              }
            }
          })
        }
      )
    },
    showPopup(note){
      const titleNote = note.title.length ? `"<b>${note.title}</b>"` : ``
      const vm = this
      this.$emit('openPopup', {
        textHead: 'Удалить заметку?',
        textBody: `Заметка ${titleNote} будет удалена без возможности восстановления.`,
        buttons: {
          go: {
            text: 'Удалить',
            cb: () => vm.processDeleteNote(note.key)
          },
          back: {
            text: 'Отмена',
            cb: _this => _this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.note{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  border: 1px solid $mainColor;
  border-radius: $bdRadius;
  padding: 12px 15px;
  margin: 16px 16px 0px 0px;
  width: 208px;
  &:hover .panel{
    opacity: 1;
  }
}
.more{
  margin-left: 9px;
}
.title{
  font-weight: bold;
  margin-bottom: 15px;
}
.todo{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  margin: 5px 0px;
  &.empty label{
    cursor: default !important;
  }
}
.footer{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  margin-top: 10px;
  a{
    line-height: 0;
  }
  .panel{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
        -ms-flex-pack: end;
            justify-content: flex-end;
    opacity: 0;
    width: 100%;
    img{
      height: 18px;
      width: 18px;
      opacity: .4;
      cursor: pointer;
      &:hover{
        opacity: 1;
      }
    }
    .edit{
      margin-right: 5px;
    }
  }
}
</style>