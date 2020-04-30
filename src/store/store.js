import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);

const state = {
  yourStream: undefined,
  theirStream: undefined,
  yourConnection: undefined,
  connectedUser: '',
  ws: ws,
  sendState: undefined,
  socket: null,
  message: null,
};

const getters = {
  ws: state => state.ws,
  sendState: state => state.sendState,
  yourConnection: state => state.yourConnection,
  yourStream: state => state.yourStream,
  theirStream: state => state.theirsStream,
  connectedUser: state => state.connectedUser,
  socket: state => state.socket,
  message: state => state.message,
};

const mutations = {
  Ws: function (state, payload) {
    state.ws = payload;
  },
	AddYourStream: function (state, payload) {
    state.yourStream = payload;
  },
	AddTheirStream: function (state, payload) {
    state.theirStream = payload;
  },
	Your_Connection: function (state, payload) {
    state.yourConnection = new RTCPeerConnection(payload)
  },
	ConnectedUser: function (state, payload) {
    state.connectedUser = payload;
  },
	SendMutation: function (state, payload) {
    state.sendState = payload;
  },
  SET_SOCKET: function (state, socket) {
    state.socket = socket;
  },
  SET_MESSAGE: function (state, message) {
    state.message = message;
  }
};

const actions = {
  addYourStream: (context, payload) => {
    context.commit('AddYourStream', payload);
  },
  addTheirStream: (context, payload) => {
    context.commit('AddTheirStream', payload);
  },
  yourConnectionAction: (context, payload) => {
    context.commit('Your_Connection', payload);
  },
  connectedUser: (context, payload) => {
    context.commit('ConnectedUser', payload);
  },
  sendAction ({commit}, payload) {
    return new Promise((resolve, reject) =>{

      if (state.connectedUser) {
      payload.name = state.connectedUser;
    }
    // commit('SendMutation', payload);
    state.ws.send(JSON.stringify(payload));
    resolve();
    })
  },
  wsAction: (context, payload) => {
    context.commit('Ws', payload);
  },
  // Socket: ({commit, dispatch}, url) => {
  //   const ws = new Websocket('ws://localhost:8081')
  //   ws.onopen = () => dispatch('ONOPEN')
  //   ws.onmessage = e => dispatch('ONMESSAGE', e.data)
  //   ws.onclose = () => dispatch('ONCLOSE')
  //   commit('SET_SOCKET', ws)
  // },
  // ONOPEN (state) {
  //   console.log('ws connected')
  // },
  // ONMESSAGE ({commit}, message) {
  //   try {
  //     message = JSON.parse(message)
  //   } catch (e) {
  //     //
  //   }
  //   commit('SET_MESSAGE', message)
  // },
  // ONCLOSE (state) {
  //   console.log('ws disconnected')
  // }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
