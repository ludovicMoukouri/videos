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
    state.sendState = payload;
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
  async sendAction: (context, payload) => {
    if (state.connectedUser) {
      payload.name = state.connectedUser;
    }
    context.commit('SendMutation', payload);
    return await state.ws.send(JSON.stringify(payload));
  },
  wsAction: (context, payload) => {
    context.commit('Ws', payload);
  },
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
