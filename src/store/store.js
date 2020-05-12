import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  yourStream: undefined,
  theirStream: undefined,
  yourConnection: undefined,
  connectedUser: null,
  ws: undefined,
  sendState: undefined,
  userAgent: undefined,
  objectL: null,
  config: null,
};

const getters = {
  ws: state => state.ws,
  sendState: state => state.sendState,
  yourConnection: state => state.yourConnection,
  yourStream: state => state.yourStream,
  theirStream: state => state.theirsStream,
  connectedUser: state => state.connectedUser,
  objectTodo: state => state.objectL,
  config: state => state.config,
};

const mutations = {
  Ws: function (state, payload) {
    state.ws = payload;
  },
  AddYourStream: function (state, payload) {
    state.yourStream = payload;
  },
  Add_Their_Stream: function (state, payload) {
    state.theirStream = payload;
  },
  Your_Connection: function (state, configur, connection_peer) {
    state.config = new configur
  },
  Connected_User: function (state, payload) {
    state.connectedUser = payload;
  },
  Send_Mutation: function (state, payload) {
    state.sendState = payload    
  },
  Send_Mutation_leave: function (state, payload) {
    state.sendState = payload 
  },
  Send_Offer_Mutation: function (state, sendo) {
    state.sendState = payload
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
  addTheirStream: ({commit}, payload) => {
    commit('Add_Their_Stream', payload);
  },
  yourConnectionAction: ({commit, state}, configur) => {
    state.yourConnection = new RTCPeerConnection(configur)
    commit('Your_Connection', configur);
  },
  connectedUser: (context, payload) => {
    context.commit('Connected_User', payload);
  },
  sendAction: ({commit, state}, oblog) => {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser) {
      oblog.name = state.connectedUser;
    }
    commit('Send_Mutation', oblog);
    return state.ws.send(JSON.stringify(oblog));
  },
  sendActionLeave: ({commit, state}, oblog) => {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser !== null) {
      oblog.name = state.connectedUser;
    }
    commit('Send_Mutation_leave', oblog);
    return state.ws.send(JSON.stringify(oblog));
  },
  sofferAction: ({commit, state}, sendo) => {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser !== null) {
      sendo.name = state.connectedUser;
    }
    commit('Send_Offer_Mutation', sendo);
    return state.ws.send(JSON.stringify(sendo));
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
// export default new Vuex.Store
export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
