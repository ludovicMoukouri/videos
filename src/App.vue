<template>
  <v-app id="inspire">
    <v-card
    color="grey lighten-5"
    flat
    style="padding:.5% 0 0 0"
    height="12%"
    tile
    >
    <v-toolbar
    color="grey lighten-4">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <router-link v-bind:to="{ name: 'Hello' }" class="side_bar_link">
      <v-toolbar-title>Tsuips</v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
    <v-btn id="user_email" flat v-if="current_user" class="side_bar_link">{{
    current_user.fullname }}</v-btn>

    <router-link v-bind:to="{ name: 'Register' }" v-if="!current_user"
    id="register_btn" class="side_bar_link">
  <v-btn icon>
    <v-icon color="blue darken-2">save_alt</v-icon>
  </v-btn>
  Sign up
</router-link>
<router-link v-bind:to="{ name: 'Login' }" v-if="!current_user"
  id="login_btn" class="side_bar_link">
  <v-btn icon>
    <v-icon color="blue darken-2">mdi-login</v-icon>
  </v-btn>
  Sign in
</router-link>

<!-- <router-link v-bind:to="{ name: 'Login' }" v-if="current_user"
  id="logout_btn"  @click="logout" class="side_bar_link">
  <v-btn icon>
    <v-icon color="blue darken-2">mdi-logout</v-icon>
  </v-btn>
  Log out
</router-link> -->

  <v-btn id="logout_btn" flat v-if="current_user" class="side_bar_link"
  @click="logout" color="blue darken-2">Logout</v-btn>
</v-toolbar-items>

<!-- <v-btn icon>
  <v-icon>mdi-dots-vertical</v-icon>
</v-btn> -->
</v-toolbar>
</v-card>
<v-content>
  <v-container fluid>
    <div id="app">
      <router-view />
    </div>
  </v-container>
</v-content>
<v-footer color="grey lighten-4" app>
  <span class="black--text" style="text-align: center">&copy; 2018</span>
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
    logout() {
      return axios({
        method: 'get',
        url: '/api/logout',
      })
        .then(() => {
          bus.$emit('refreshUser');
          this.$router.push({ name: 'Hello' });
        })
        .catch(() => {
        });
    },
  },
};
</script>

