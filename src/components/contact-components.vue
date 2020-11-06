<template>
  <div class="sheet-contact">
    <div class="info-contact">
      <div class="head-contact" v-if="Object.keys(getContact).length != 0">
        <router-link class="link-home" :to="{ path: '/' }">К списку контактов</router-link>
        <div v-if="showFieldAddAtr == false">
          <input
            class="new-attribute-btn"
            type="button"
            v-on:click="showFieldAddAtr = true"
            value="Добавить новое поле"
          />
        </div>
        <div v-else>
          <input
            class="new-attribute-btn"
            type="text"
            v-on:click="showFieldAddAtr = true"
            placeholder="Название поля"
            v-model.trim="newAtr.name"
          />
          <input
            class="new-attribute-btn"
            type="text"
            v-on:click="showFieldAddAtr = true"
            placeholder="Значение поля"
            v-model.trim="newAtr.value"
          />
          <input
            v-if="newAtr.name || newAtr.value"
            :disabled="getContact[newAtr.name]"
            class="new-attribute-btn"
            type="button"
            v-on:click="addNewAtr()"
            value="Сохранить"
          />
          <input
            v-else
            class="new-attribute-btn"
            type="button"
            v-on:click="showFieldAddAtr = false"
            value="Отменить"
          />
        </div>
        <input
          class="step-back-btn"
          type="button"
          :disabled="stepBack[1] == 0 || previousStepDisable"
          v-on:click="previousStep()"
          value="Отменить последнее действие"
        />
      </div>

      <div v-for="(value, name, index) in getContact" :key="name">
        <div class="atr-contact" v-if="name != 'id'">
          <div class="name-contact-atr">
            <p v-if="atr.index != index">{{ name }}</p>
            <input
              v-else
              class="change-atribut-name"
              type="text"
              v-model.trim="atr.name"
            />
          </div>
          <div class="value-contact-atr">
            <p v-if="atr.index != index">{{ value }}</p>
            <input
              v-else
              class="change-atribut-name"
              type="text"
              v-model.trim="atr.value"
            />
          </div>
          <div class="change-field">
            <input
              v-if="atr.index != index"
              class="change-field-btn"
              type="button"
              v-on:click="changeAtr(value, name, index)"
              value="Изменить поле"
            />
            <input
              v-if="atr.index == index && atr.name == name && atr.value == value"
              class="change-field-btn"
              type="button"
              v-on:click="atr = ''"
              value="Отменить"
            />
            <input
              v-if="
                (atr.index == index && atr.name != name) ||
                (atr.index == index && atr.value != value)
              "
              class="change-field-btn"
              type="button"
              v-on:click="saveChange(name)"
              value="Сохранить"
            />
          </div>
          <div class="delete-field">
            <input
              class="delete-field-btn"
              type="button"
              v-on:click="deleteAtr(name)"
              value="Удалить поле"
            />
          </div>
        </div>
      </div>
      <div class="empty-field" v-if="Object.keys(getContact).length == 1">
        <h3>У данного контакта нет полей!</h3>
      </div>
      <div class="empty-field" v-if="Object.keys(getContact).length == 0">
        <h3>Данного контакта не существует!</h3>
        <router-link :to="{ path: '/'}">Перейти на главную страницу</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      showFieldAddAtr: false, //Показ полей при измении существующего поля
      atr: "", //Объект с данными для изменения существующего поля
      newAtr: {}, //Объект с данными для создания нового поля
      previousStepDisable: true, // Отключение кнопки востановления предыдущего значения, если нечего востанавливать
      stepBack: [0, 0], // Массив где во втором элементе хранится версия контакта перед поседним изменением, а в первом текущая
    };
  },
  methods: {
    ...mapActions(["CREATE_CONTACTS"]),
    //Добавление нового поля
    addNewAtr() {
      let contacts = this.ALL_CONTACTS;
      let changedContactIndex = contacts.findIndex((contact) => contact.id == this.$route.query.id);
      contacts[changedContactIndex][this.newAtr.name] = this.newAtr.value;
      this.savePreviousValue();
      this.CREATE_CONTACTS(contacts);
      this.newAtr.name = "";
      this.newAtr.value = "";
      this.atr = "";
    },
    //Сохранение копии данных выбраного поля
    changeAtr(value, name, index) {
      this.atr = {
        value,
        name,
        index,
      };
    },
    //Удаление поля
    deleteAtr(atrName) {
      let confirmDelete = confirm("Вы действительно хотите удалить это поле?");
      if(confirmDelete == true){
        let contacts = this.ALL_CONTACTS;
        let changedContactIndex = contacts.findIndex((contact) => contact.id == this.$route.query.id);
        delete contacts[changedContactIndex][atrName];
        this.savePreviousValue();
        this.CREATE_CONTACTS(contacts);
        this.atr = "";
      }
    },
    //Внесение  и сохранение изменений при редактировании полей. Удаляем объект и создаем новый, либо перезаписываем существующий, если ключ был не изменен
    saveChange(oldAtrName) {
      let contacts = this.ALL_CONTACTS;
      let thisContact = this.getContact;
      let changedContactIndex = contacts.findIndex(
        (contact) => contact.id == this.$route.query.id
      );
      if (oldAtrName != this.atr.name) {
        delete thisContact[oldAtrName];
      }
      thisContact[this.atr.name] = this.atr.value;
      contacts.splice(changedContactIndex, 1, thisContact);
      this.CREATE_CONTACTS(contacts);
      this.savePreviousValue();
      this.atr = "";
    },
    //Сохранение последнего измения в массив из двух элементов. JSON используется, что бы удалить ссылку на объект 
    savePreviousValue() {
      let oldHistory = JSON.parse(JSON.stringify(this.getContact));
      this.stepBack.unshift(oldHistory);
      this.stepBack.splice(2, 1);
      this.previousStepDisable = false;
    },
    //Возврат на шаг назад. Данные для востановления берутся из второго элемента массива
    previousStep() {
      let contacts = this.ALL_CONTACTS;
      let changedContactIndex = contacts.findIndex(
        (contact) => contact.id == this.$route.query.id
      );
      contacts.splice(changedContactIndex, 1, this.stepBack[1]);
      this.CREATE_CONTACTS(contacts);
      this.savePreviousValue();
      this.previousStepDisable = true;
    },
  },
  computed: {
    ...mapGetters(["ALL_CONTACTS"]),
    //Получение данных контакта при помощи id из query параметров страницы
    getContact() {
      if (this.ALL_CONTACTS.filter((contact) => contact.id == this.$route.query.id)[0] != undefined) {
        return this.ALL_CONTACTS.filter((contact) => contact.id == this.$route.query.id)[0];
      } else {
        return "";
      }
    },
  },
  // Сохраняем данные для при загрузке страницы
  mounted() {
    this.savePreviousValue();
  },
};
</script>

<style scoped>
.sheet-contact {
  width: 100%;
  display: flex;
  justify-content: center;
}

.info-contact {
  width: 960px;
  background: #eee;
}
.head-contact {
  display: flex;
  justify-content: space-between;
  background: #eee;
  margin: 15px 0;
}
.link-home {
  margin: 0 10px;
}
.step-back-btn {
  padding: 5px 10px;
  margin: 0 10px;
}
.new-attribute-btn {
  padding: 5px 10px;
  margin: 0 10px;
}
.atr-contact {
  display: flex;
  flex-direction: row;
  padding: 10px;
}
.atr-contact:hover {
  background: #ddd;
}
.name-contact-atr,
.value-contact-atr {
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}
.name-contact-atr p,
.value-contact-atr p {
  text-align: left;
}
.change-atribut-name {
  padding: 5px 10px;
  margin: 0 10px 0 0;
  max-width: 250px;
}
.delete-field,
.change-field {
  display: flex;
  margin: 11px 0 10px 15px;
  width: 200px;
  flex-direction: column;
  justify-content: center;
}
.delete-field-btn {
  padding: 5px 10px;
  margin: 0 10px;
}
.change-field-btn {
  padding: 5px 10px;
}
.empty-field {
  margin: 40px 0;
}
</style>
