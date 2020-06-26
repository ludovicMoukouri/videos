import axios from 'axios';
import Vue from 'vue';
const url = 'http://localhost:8081';
const token = localStorage.getItem('auth');
const headers = { headers: { 'Content-Type': 'application/json'} }
const headers_token = { headers: { Authorization:`JWT ${token}`,'Content-Type': 'application/json'} }

export default {
	signup(credentials, headers) {
		return axios
		.post(`/users/register`, credentials)
		.then(response => response.data);
	},

	login(credentials, headers) {
		return axios
		.post(`/users/login`, credentials)
		.then(response => response.data);
	},

	getUsersConnect(email) {
		return axios
		.get(`/users/usersConnect/${email}`)
		.then(response => response.data);
	},

	getusersConnected() {
		return axios
		.get(`/users/userConnected`)
		.then(response => response.data);
	},

	updateConnected(credentials, headers) {
		return axios
		.put(`/users/updateConnected`, credentials)
		.then(response => response.data);
	},
}