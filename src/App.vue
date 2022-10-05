<template>
  <div class="container pt-3" id="app" v-cloak>
    <h1 class="text-white">Книга контактів</h1>

    <form class="form-inline my-5 mx-5" @submit.prevent="addContact" v-cloak>
      <div class="form-group mr-5 w-50">
        <label for="name" class="mr-3 text-white"
          ><b>{{ labelName }}</b></label
        >
        <input
          type="text"
          class="form-control"
          id="name"
          :placeholder="placeholderName"
          v-model="form.name"
        />
      </div>
      <div class="form-group mr-5 w-50 mt-3">
        <label for="email" class="mr-3 text-white"
          ><b>{{ labelEmail }}</b></label
        >
        <input
          type="text"
          class="form-control"
          id="email"
          :placeholder="placeholderEmail"
          v-model="form.email"
        />
      </div>
      <div class="form-group mr-5 w-50 mt-3">
        <label for="phone" class="mr-3 text-white"
          ><b>{{ labelPhone }}</b></label
        >
        <input
          type="text"
          class="form-control"
          id="phone"
          :placeholder="placeholderPhone"
          v-model="form.phone"
        />
      </div>
      <button class="btn btn-primary mt-3" type="submit" :disabled="!canAdd">
        Створити контакт
      </button>
    </form>

    <div v-if="loading">
      <div class="loader d-flex justify-content-center align-items-center">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div
      class="d-flex flex-wrap justify-content-evenly"
      v-else-if="contacts.length"
      v-cloak
    >
      <div
        class="card text-center mb-3 w-auto align-items-center"
        v-for="contact in contacts"
        :key="contact.id"
      >
        <div
          class="card-body rounded"
          :style="{ backgroundColor: contact.marked ? 'lightblue' : 'black' }"
        >
          <h5
            class="card-title"
            :style="{ color: contact.marked ? 'black' : 'white' }"
          >
            {{ contact.name }}
          </h5>
          <p
            class="card-text"
            :style="{ color: contact.marked ? 'black' : 'white' }"
          >
            {{ contact.email }}
          </p>
          <p
            class="card-text"
            :style="{ color: contact.marked ? 'black' : 'white' }"
          >
            {{ contact.phone }}
          </p>
          <button
            class="btn btn-primary me-3"
            @click="markContact(contact.id)"
            :disabled="contact.marked"
          >
            Відмітити
          </button>
          <button class="btn btn-danger" @click="deleteContact(contact.id)">
            Видалити
          </button>
        </div>
      </div>
    </div>
    <p v-else>Книга контактів пуста. Додайте перший контакт!</p>
  </div>
</template>

<script>
const API_URL = 'http://localhost:2222/contacts';
export default {
  data() {
    return {
      labelName: 'Ім`я',
      labelEmail: 'Ел. пошта',
      labelPhone: 'Номер телефону',
      placeholderName: 'Ваше Ім`я',
      placeholderEmail: 'Ваша ел. пошта',
      placeholderPhone: 'Ваш номер телефону',
      loading: false,
      form: {
        name: '',
        email: '',
        phone: '',
      },
      contacts: [],
    };
  },
  computed: {
    canAdd() {
      return (
        this.form.name.trim() &&
        this.form.email.trim() &&
        this.form.phone.trim()
      );
    },
  },
  methods: {
    addContact() {
      console.log(this.contact);
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.contact),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map((detail) => detail.contact)
              .join('. ');
            this.error = error;
          } else {
            this.error = '';
            this.contacts.push(result);
          }
        });
    },
    // async addContact() {
    //   const { ...contact } = this.form;
    // const newContact = await req('/api/contacts', 'POST', contact);
    // this.contacts.push(newContact);
    // const id = parseInt(this.contacts[this.contacts.length - 1].id) + 1;
    // this.contacts.push({
    //   ...contact,
    //   id: `${id}`,
    //   // id: Date.now(),
    //   marked: false,
    // });
    //   this.form.name = this.form.email = this.form.phone = '';
    // },
    markContact(id) {
      const contact = this.contacts.find((contact) => contact.id === id);
      contact.marked = true;
    },
    deleteContact(id) {
      this.contacts = this.contacts.filter((contact) => contact.id !== id);
    },
  },
  async mounted() {
    this.loading = true;
    fetch(API_URL)
      .then((response) => response.json())
      .then((result) => {
        this.contacts = result;
      });
    this.loading = false;
    // this.loading = true;
    // this.contacts = await req('/api/contacts');
    // this.loading = false;
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
