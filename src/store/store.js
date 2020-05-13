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
  Add_Their_Stream: function (state, payload) {
    state.theirStream = payload;
  },
  Your_Connection: function (state, configur, connection_peer) {
    state.yourConnection = new RTCPeerConnection(configur, connection_peer)
  },
  Connected_User: function (state, payload) {
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
  Send_Mutation_leave: function (state, payload) {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser !== null) {
      payload.name = state.connectedUser;
    }
    state.sendState = payload
    console.log(payload, 'payload payload')
    return state.ws.send(JSON.stringify(payload));
    
  },
  Send_Offer_Mutation: function (state, sendo) {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser !== null) {
      sendo.name = state.connectedUser;
    }
    state.sendState = sendo
    console.log(sendo, 'sendo sendo')
    return state.ws.send(JSON.stringify(sendo));
    
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
  yourConnectionAction: ({commit}, configur) => {
    commit('Your_Connection', configur);
  },
  connectedUser: (context, payload) => {
    context.commit('Connected_User', payload);
  },
  sendAction: ({commit}, oblog) => {
    commit('Send_Mutation', oblog);
  },
  sendActionLeave: ({commit}, oblog) => {
    commit('Send_Mutation_leave', oblog);
  },
  sofferAction: ({commit}, sendo) => {
    commit('Send_Offer_Mutation', sendo);
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
