<template>
  <div class="row" :class="{footer: this.isEdit}">
    <template v-if="this.isEdit">  
      <label class="container">
        <input type="checkbox" v-model="inputSelected"/>
        <span class="checkmark"/>
      </label>
      <input class="input_text" placeholder="Текст пункта" v-model="inputText">
      <div class="img_delete" @click="clickDeleteTask()">
        <img src='../assets/image/close.png' title="Удалить"/>
      </div>
    </template>
    <template v-else>
      <label class="container dont-click" @click.prevent="">
        <input type="checkbox" :checked="this.selected"/>
        <span class="checkmark"></span>
        <span class="text">{{ this.text }}</span>
      </label>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: ['task', 'edit', 'index'],
  data(){
    return {
      text: '',
      selected: false,
    }
  },
  created(){
    const task = this.task
    if(task){
      this.text = task.text ? task.text : ''
      this.selected = task.selected ? task.selected : false
    }
  },
  computed: {
    ...mapGetters({
      getTask: 'note/GET_TASK',
    }),
    isEdit(){
      return this.edit !== undefined ? this.edit : false
    },
    inputSelected: {
      get(){
        return this.getTask({
          index: this.index,
          field: 'selected'
        })
      },
      set(newValue){
        const indexTake = this.index
        const oldValue = this.inputSelected ? this.inputSelected : false
        const data = {
          cb: {
            back: _this => {
              _this.editTask({
                index: indexTake,
                field: 'selected',
                value: oldValue
              })
            },
            go: _this => {
              _this.editTask({
                index: indexTake,
                field: 'selected',
                value: newValue
              })
            }
          }
        }
        this.sendParent(data)
        return data.cb.go(this)
      }
    },
    inputText: {
      get(){
        return this.getTask({
          index: this.index,
          field: 'text'
        })
      },
      set(newValue){
        const indexTake = this.index
        const oldValue = this.inputText
        const data = {
          cb: {
            back: _this => {
              _this.editTask({
                index: indexTake,
                field: 'text',
                value: oldValue
              })
            },
            go: _this => {
              _this.editTask({
                index: indexTake,
                field: 'text',
                value: newValue
              })
            }
          }
        }
        this.sendParent(data)
        return data.cb.go(this)
      }
    },
  },
  methods:{
    ...mapMutations({
      setTask: 'note/SET_TASK',
      addChanges: 'note/SET_NEW_UPDATE',
      editTask: 'note/EDIT_ITEM',
      deleteTask: 'note/DELETE_TASK',
    }),
    sendParent(data){
      this.$emit('getChange', data)
    },
    clickDeleteTask(){
      const indexTake = this.index
      const textTake = this.inputText
      const selectedTake = this.inputSelected
      const data = {
        cb: {
          back: _this => {
            _this.addTask({
              index: indexTake,
              text: textTake,
              selected: selectedTake
            })
          },
          go: _this => {
            _this.deleteTask(indexTake)
          }
        }
      }
      this.sendParent(data)
      data.cb.go(this)
    },
  }
}
</script>

<style lang="scss" scoped>
.row{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
  &:last-child{
    background-color: violet;
  }
  &.footer{
    margin-bottom: 10px;
  }
  .container{
    cursor: pointer;
  }
  .dont-click{
    cursor: default;
  }
  .input_text{
    width: 100%;
    padding-bottom: 2px;
    padding-left: 10px;
    border-bottom: 1px solid #E6E6E6;
  }
  .text{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    outline: none;
    -webkit-box-flex: 1;
        -ms-flex: 1 1 0px;
            flex: 1 1 0;
  }
  &:hover .img_delete{
    opacity: 1;
  }
  .img_delete{
    cursor: pointer;
    opacity: 0;
    img{
      display: block;
      height: 18px;
      width: 18px;
      padding: 4px;
    }
    :hover{
      background-color: #e9e9e9;
      border-radius: 50%;
    }
  }
}
</style>