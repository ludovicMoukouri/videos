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
  userAgent: undefined,
  objectL: null,
};

const getters = {
  ws: state => state.ws,
  sendState: state => state.sendState,
  yourConnection: state => state.yourConnection,
  yourStream: state => state.yourStream,
  theirStream: state => state.theirsStream,
  connectedUser: state => state.connectedUser,
  objectTodo: state => state.objectL,
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
	Send_Mutation: function (state, payload) {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser) {
      payload.name = state.connectedUser;
    }
    state.sendState = payload
    return state.ws.send(JSON.stringify(payload));
    
  },
  UserAgent: function (state, payload) {
    state.userAgent = payload;
  },
  Login_Object: function (state, payload) {
    state.objectL = payload;
    console.log('jkjkjjkj', payload)
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
  sendAction: ({commit}, oblog) => {
    commit('Send_Mutation', oblog);
  },
  wsAction: (context, payload) => {
    context.commit('Ws', payload);
  },
  userAgent: (context, payload) => {
    context.commit('UserAgent', payload);
  },
  loginA: ({commit}, sendA) => {
    commit('Login_Object', sendA);
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
