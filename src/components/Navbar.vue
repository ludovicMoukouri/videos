<template>
	<nav>
		<v-toolbar fixed text app>
			<v-app-bar-nav-icon hidden class="btn_sign grey--text" 
			@click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>
				<router-link v-bind:to="{ name: 'Hello' }" class="side_bar_link">
					<v-toolbar-title>Tsuips</v-toolbar-title>
				</router-link>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">

<drop-down v-if="currentuser" class="nav-item"
                     title="5 Notifications"
                     title-classes="nav-link"
                     icon="mdi-bell-ring">
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </drop-down>

				<v-btn id="user_email" text v-if="currentuser" class="side_bar_link">{{
				currentuser.fullname }}</v-btn>

				<router-link v-bind:to="{ name: 'Register' }" v-if="!currentuser"
				id="register_btn" class="side_bar_link">
				<v-btn icon>
					<v-icon color="blue darken-2">save_alt</v-icon>
				</v-btn>
				Sign up
			</router-link>
			<router-link class="nav_head" v-bind:to="{ name: 'Login' }" v-if="!currentuser"
			id="login_btn" class="side_bar_link">
			<v-btn icon>
				<v-icon color="blue darken-2">mdi-login</v-icon>
			</v-btn>
			Sign in
		</router-link>
		<v-btn id="logout_btn" text v-if="currentuser" class="side_bar_link"
		@click="logout">Logout</v-btn>
	</v-toolbar-items>
</v-toolbar>

<v-navigation-drawer text app v-model="drawer" class="aside_left">
	<p>
		<v-btn id="user_email" text v-if="currentuser" class="side_bar_link">{{
		currentuser.fullname }}</v-btn>
	</p>
	<p>
		<router-link v-bind:to="{ name: 'Register' }" v-if="!currentuser"
		id="register_btn" class="side_bar_link">
		<v-btn icon>
			<v-icon color="blue darken-2">save_alt</v-icon>
		</v-btn>
		Sign up
	</router-link>
</p>

<p>
	<router-link class="nav_head" v-bind:to="{ name: 'Login' }" v-if="!currentuser"
	id="login_btn" class="side_bar_link">
	<v-btn icon>
		<v-icon color="blue darken-2">mdi-login</v-icon>
	</v-btn>
	Sign in
</router-link>
</p>

<p>
	<v-btn id="logout_btn" text v-if="currentuser" class="side_bar_link"
	@click="logout" color="blue darken-2">Logout</v-btn>
</p>


</v-navigation-drawer>
</nav>
</template>

<script>
import axios from 'axios';
import bus from './../bus';

export default {
	data() {
		return {
			drawer: false,
		}
	},
	props: {
		currentuser: {
			type: String,
			required: true,
		},
	},
	mounted() {
		this.normalizedSize()
	},
	computed: {
		normalizedSize: function () {
			const self = this
    return self.currentuser.fullname.trim().toLowerCase()
  }
	},
	methods: {
		async logout() {
      return axios({
        method: 'get',
        url: '/api/logout',
      })
        .then(() => {
          bus.$on('refreshUser');
          bus.$emit('refreshLogout');
          // this.$router.push({ name: 'Hello' });
          return document.location.href = '/' // is use for reloading Page
        })
        .catch(() => {
        });
    },
	}
};
</script>
