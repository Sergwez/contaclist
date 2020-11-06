//Массив позициями в корзине
export default {
    actions:{
      async CREATE_CONTACTS(ctx, newContacts){
        let contacts = newContacts
        ctx.commit('UPDATE_CONTACTS', contacts)
      }
    },
    mutations:{
      UPDATE_CONTACTS(state, contacts){
        state.contacts = contacts
      }
    },
    state:{
        contacts:[
            {
                id:"1",
                Имя:"Василий",
                Фамилия:"Васильев",
                Телефон:"3-344-343-43-43",
                eMail:"qwerty@qwe.qw",
              },
              {
                id:"2",
                Имя:"Иван",
                Фамилия:"Иванов",
                Телефон:"3-344-343-43-43",
                eMail:"qwerty@qwe.qw",
              }
        ],
    },
    getters:{
      ALL_CONTACTS(state){
        return state.contacts
      }
    },
  }
  