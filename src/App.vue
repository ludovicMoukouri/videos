<template>
  <v-app id="inspire">
    <Navbar 
    :currentuser="current_user" />
<v-content>
  <v-container fluid>
    <div id="app">
      <router-view />
    </div>
  </v-container>
</v-content>

<v-footer color="grey lighten-4" app>
  <span class="black--text" style="text-align: center">&copy; 2020</span>
</v-footer>

</v-app>
</template>

<script>
import axios from 'axios';
import '@/assets/stylesheets/main.css';
import bus from './bus';
// import '@/assets/javascript/main.js';

export default {
  data: () => ({
    current_user: null,
  }),
  props: {
    source: String,
  },
  mounted() {
    this.fetchUser();
    this.listenToEvents();
  },
  methods: {
    listenToEvents() {
      bus.$on('refreshUser', () => {
        this.fetchUser();
      });
    },
    async fetchUser() {
      return axios({
        method: 'get',
        url: '/api/current_user',
      })
        .then((response) => {
          this.current_user = response.data.current_user;
        })
        .catch(() => {
        });
    },
  },
};
</script>

