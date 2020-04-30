import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  yourStream: undefined,
  theirStream: undefined,
  yourConnection: undefined,
  connectedUser: '',
  ws: undefined,
  sendState: undefined,
};

const getters = {
  ws: state => state.ws,
  sendState: state => state.sendState,
  yourConnection: state => state.yourConnection,
  yourStream: state => state.yourStream,
  theirStream: state => state.theirsStream,
  connectedUser: state => state.connectedUser,
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
    if (state.connectedUser) {
      payload.name = state.connectedUser;
    }
    state.sendState = state.ws.send(JSON.stringify(payload));
    return state.sendState;
  },
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
  sendAction: (context, payload) => {
    context.commit('SendMutation', payload);
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
  strict: process.env.NODE_ENV === 'production'
});
