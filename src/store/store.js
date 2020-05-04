import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vue from 'vue'
import note from './modules/note'
import * as Request from '../request'

Vue.use(Vuex, VueRouter)

export default new Vuex.Store({
  strict: true,
  modules: {
    note
  },
  state: {
    getData: [],
  },
  //               _   _                
  //              | | | |               
  //     __ _  ___| |_| |_ ___ _ __ ___ 
  //    / _` |/ _ \ __| __/ _ \ '__/ __|
  //   | (_| |  __/ |_| ||  __/ |  \__ \
  //    \__, |\___|\__|\__\___|_|  |___/
  //     __/ |                          
  //    |___/                            
  getters: {
    GET_NOTES: state => {
      return state
    },
    GET_NOTE_BY_KEY: state => options => { // options --> .key + .field
      for (let i = 0; i < state.getData.length; i++) {
        let note = state.getData[i]
        if(note.key == options.key){
          return options.field ? note[options.field] : note
        }
      }
      return null
    }
  },
  //                    _        _   _                 
  //                   | |      | | (_)                
  //    _ __ ___  _   _| |_ __ _| |_ _  ___  _ __  ___ 
  //   | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
  //   | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
  //   |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/
  //                                                   
  //                                                    
  mutations: {
    SET_DATA(state, data){
      state.getData = data
    },
    UPDATE_NOTE(state, note){
      let currentNote = note.current
      const updateNote = note.updatedNote
      currentNote.key = updateNote.key
      currentNote.title = updateNote.title
      currentNote.todos = updateNote.todos.map((b, idx) => Object.assign({ index: idx }, b));
    },
    ADD_NEW_NOTE(state, newNote){
      state.getData.push(newNote)
    }
  },
  //               _   _                 
  //              | | (_)                
  //     __ _  ___| |_ _  ___  _ __  ___ 
  //    / _` |/ __| __| |/ _ \| '_ \/ __|
  //   | (_| | (__| |_| | (_) | | | \__ \
  //    \__,_|\___|\__|_|\___/|_| |_|___/
  //                                     
  //                                      
  actions: {
    runServer({commit}) {
      return new Promise((resolve, reject) => {
        Request.getNotes().then(
          data => {
            commit('SET_DATA', data)
            resolve()      
          },
          () => reject()   
        )
      })
    },
    DELETE_NOTE_BY_KEY({state}, keyNote){
      return new Promise((sendData, sendError) => {
        let remainNotes = []
        const notes = state.getData
        for(let index in notes){
          let note = notes[index]
          if(note && note.key != keyNote){
            remainNotes.push(note)
          }
        }

        Request.setNotes({'notes' : remainNotes}).then(
          () => sendData(remainNotes),
          () => sendError()
        )
      })
    },
    UPDATE_DATA_IN_NOTE(global, updatedNote){
      return new Promise((advance, error) => {
        const currentNote = global.getters.GET_NOTE_BY_KEY({
          key: updatedNote.key
        })
        if(currentNote){
          global.commit('UPDATE_NOTE', {
            current: currentNote,
            updatedNote: updatedNote
          })
        }
        else{
          global.commit('ADD_NEW_NOTE', updatedNote)
        }
        
        Request.setNotes({'notes' : global.state.getData}).then(
          () => advance(),
          () => error(),
        )
      })
    }
  },
});