<template>
  <div class="sheet-list">
    <div class="contant-list">
      <div class="head-list">
        <input
          class="add-contact-text"
          placeholder="Введите имя контакта"
          type="text"
          v-model="newContactName"
        />
        <input
          class="add-contact-btn"
          :disabled="!newContactName"
          type="button"
          @click="createContact(newContactName)"
          value="Создать"
        />
      </div>
      <div v-if="ALL_CONTACTS.length" class="row-list">
        <div
          class="contact-list"
          v-for="contact of ALL_CONTACTS"
          :key="contact.id"
        >
          <div class="name-contact-list list-item">
            {{ contact["Имя"] }}
          </div>
          <div class="link-contact-list list-item">
            <router-link :to="{ path: '/contact', query: { id: contact.id } }">Подробнее</router-link>
          </div>
          <div class="delete-contact-list list-item">
            <input
              class="delete-contact-btn"
              type="button"
              v-on:click="deleteContact(contact.id)"
              value="Удалить контакт"
            />
          </div>
        </div>
      </div>
      <div v-else><h3>Список контактов пуст!</h3></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      newContactName: "",//Имя нового контакта
    };
  },
  methods: {
    ...mapActions(["CREATE_CONTACTS"]),
    //Удаление контакта
    deleteContact(contactId) {
      let confirmDelete = confirm(
        "Вы действительно хотите удалить этот контакт?"
      );
      if (confirmDelete == true) {
        const contactIndex = this.ALL_CONTACTS.findIndex((contact) => contact.id == contactId);
        let newContacts = this.ALL_CONTACTS;
        newContacts.splice(contactIndex, 1);
        this.CREATE_CONTACTS(newContacts);
      }
    },
    //Создание нового контакта 
    createContact(newContactName) {
      const newIdValue =
        Math.max.apply(null, this.ALL_CONTACTS.map((contact) => Number(contact.id))) + 1;
      let contacts = this.ALL_CONTACTS;
      const newContact = {
        Имя: newContactName,
        id: newIdValue,
      };
      contacts.push(newContact);
      this.CREATE_CONTACTS(contacts);
      this.newContactName = "";
    },
  },
  computed: {
    ...mapGetters(["ALL_CONTACTS"]),
  },
};
</script>

<style scoped>
.sheet-list {
  width: 100%;
  display: flex;
  justify-content: center;
}
.add-contact-btn,
.add-contact-text {
  padding: 5px 10px;
  margin: 10px 15px;
}
.contant-list {
  width: 960px;
  background: #eee;
}
.contact-list {
  padding: 10px;

  display: flex;
  flex-direction: row;
}
.contact-list:hover {
  background: #ddd;
}
.name-contact-list {
  display: flex;
  flex-grow: 1;
}
.link-contact-list,
.delete-contact-list {
  margin: 0 10px 0 20px;
}
.delete-contact-btn {
  padding: 5px 10px;
  margin: -5px 0 0 0;
}
</style>
