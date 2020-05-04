export default {
  namespaced: true,
  state: {
    keyNote: null,
    titleNote: '',
    taskListNote: [],
    updates: [],
    step: 0,
    notSaveForStep: 0
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
    GET_KEY: state => {
      return state.keyNote !== null ? state.keyNote : -1
    },
    GET_TITLE: state => {
      return state.titleNote
    },
    GET_STEP: state => {
      return state.step
    },
    GET_TASK_LIST: state => {
      return state.taskListNote
    },
    GET_TASK: state => options =>{
      const index = options.index
      if(index !== null){
        const note = state.taskListNote[index]
        return options.field ? note[options.field] : note
      }
      else{
        return ''
      }
    },
    GET_STEP_SAVE: state => {
      return state.notSaveForStep
    },
    GET_LAST_UPDATE: state => options => { // options --> .type + .index
      const updates = state.updates
      for(let i=updates.length;i>=0;i--){
        let update = updates[i]
        if(update && update.type == options.type && update.index == options.index){
          return update.value
        }
      }
      return null
    },
    GET_UPDATES: state => {
      return state.updates
    },
    GET_UPDATE_BY_STEP: (state, getters) => {
      return state.updates[getters.GET_STEP]
    },
    GET_STEP_UPDATE_CB: (state, getters) => type => {
      return type == 'go' ? getters.GET_UPDATE_BY_STEP.cb.go : getters.GET_UPDATE_BY_STEP.cb.back
    },
    GET_CAN_SAVE: (state, getters) => {
      return state.updates.length ? !(getters.GET_STEP == state.notSaveForStep) : false
    },
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
    LOAD_NOTE_FROM_GLOBAL_DATA(state, keyNote){
      const note = this.getters.GET_NOTE_BY_KEY({
        key: keyNote
      })
      if(note){
        state.keyNote = note.key
        state.titleNote = note.title
        state.taskListNote = note.todos.map((b, idx) => Object.assign({ index: idx }, b));
      }
    },
    ADD_CHANGE(state, update){
      let updates = state.updates
      let step = state.step
      if(updates.length != step) updates.splice(step)
      updates.push(update)
      ++state.step
    },
    SET_KEY(state, newKey){
      state.keyNote = newKey
    },
    SET_STEP(state, type) {
      type.toLowerCase() == 'go' ? ++state.step : --state.step
    },
    SET_NOT_SAVE_FOR_STEP(state, indexUpdate){
      state.notSaveForStep = indexUpdate
    },
    SET_TITLE(state, newTitle){
      state.titleNote = newTitle
    },
    SET_TASK(state, options){
      let task = state.taskListNote[options.index]
      const update = options.data
      for(let key in update){
        task[key] = update[key]
      }
    },
    ADD_TASK(state, options){
      if(options.index >= 0) state.taskListNote.splice(options.index, 0, options);
      else state.taskListNote.push(options)
    },
    EDIT_ITEM(state, options){ // options --> .index + .field + .value
      state.taskListNote[options.index][options.field] = options.value
    },
    DELETE_TASK(state, index){
      state.taskListNote.splice(index, 1)
    },
    ALL_CLEAR(state){
      state.userName = '';
      state.keyNote = null;
      state.titleNote = '';
      state.taskListNote = [];
      state.updates = [];
      state.step = 0;
      state.notSaveForStep = 0;
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
    SAVE_NOTE({state, dispatch}){
      return new Promise((data, error) => {
        dispatch('UPDATE_DATA_IN_NOTE', {
          key: state.keyNote,
          title: state.titleNote,
          todos: state.taskListNote
        }, { root: true }).then(
          () => data(),
          () => error()
        )
      })
    }
  }
}