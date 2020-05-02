<template>
	<nav>
		<v-toolbar flat app>
			<v-app-bar-nav-icon class="grey--text" 
			@click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>
				<router-link v-bind:to="{ name: 'Hello' }" class="side_bar_link">
					<v-toolbar-title>Tsuips</v-toolbar-title>
				</router-link>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-sm-and-down">
				<v-btn id="user_email" flat v-if="currentuser" class="side_bar_link">{{
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
		<v-btn id="logout_btn" flat v-if="currentuser" class="side_bar_link"
		@click="logout">Logout</v-btn>
	</v-toolbar-items>
</v-toolbar>

<v-navigation-drawer flat app v-model="drawer" class="aside_left">
	<p>
		<v-btn id="user_email" flat v-if="currentuser" class="side_bar_link">{{
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
	<v-btn id="logout_btn" flat v-if="currentuser" class="side_bar_link"
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
			require: true,
		},
	},
	mounted() {
		this.normalizedSize()
	},
	computed: {
		normalizedSize: function () {
    return this.currentuser.trim().toLowerCase()
  }
	},
	methods: {
		async logout() {
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
	}
};
</script>
