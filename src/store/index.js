import { createStore } from "vuex";
import allContacts from './modules/allContacts'



export default createStore({
    modules:{
        allContacts
      }
});