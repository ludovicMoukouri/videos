import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  yourStream: null,
  theirStream: null,
  yourConnection: undefined,
  connectedUser: null,
  ws: undefined,
  sendState: undefined,
  userAgent: undefined,
  objectL: null,
  offname: null,
  offvalue: null,
  ansvalue: null,
  canvalue: null,
  cdat: null,
};

const getters = {
  wsGetters: state => state.ws,
  sendState: state => state.sendState,
  yourConnection: state => state.yourConnection,
  yourStream: state => state.yourStream,
  theirStream: state => state.theirStream,
  connectedUser: state => state.connectedUser,
  objectTodo: state => state.objectL,
  offName: state => state.offname,
  offValue: state => state.offvalue,
  ansValue: state => state.ansvalue,
  canValue: state => state.canvalue,
  cdatGetters: state => state.cdat,
};

const mutations = {
  C_Date: function (state, cdat) {
    if (!state.ws || state.ws.readyState !== 1) return;
    state.cdat = cdat
    console.log(cdat, 'cdat cdat')
    return state.ws.send(JSON.stringify(cdat));
  },
  Ws: function (state, ws) {
    state.ws = ws;
  },
  AddYourStream: function (state, payload) {
    state.yourStream = payload;
  },
  Add_Their_Stream: function (state, payload) {
    state.theirStream = payload;
  },
  Your_Connection: function (state, configur) {
    state.yourConnection = new RTCPeerConnection(configur)
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
  Offer_Name: function (state, oname) {
    state.offname = oname;
  },
  Offer_Value: function (state, ovalue) {
    state.offvalue = ovalue;
  },
  answer_Value: function (state, avalue) {
    state.ansvalue = avalue;
  },
  candidate_Value: function (state, cvalue) {
    state.canvalue = cvalue;
  },
};

const actions = {
  cdate: ({commit}, cdat) => {
    commit('C_Date', cdat);
  },
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
  wsAction: (context, ws) => {
    context.commit('Ws', ws);
  },
  userAgent: (context, payload) => {
    context.commit('UserAgent', payload);
  },
  loginA: ({commit}, sendA) => {
    commit('Login_Object', sendA);
  },
  offerName: ({commit}, oname) => {
    commit('Offer_Name', oname);
  },
  offerValue: ({commit}, ovalue) => {
    commit('Offer_Value', ovalue);
  },
  answerValue: ({commit}, avalue) => {
    commit('answer_Value', avalue);
  },
  candidateValue: ({commit}, cvalue) => {
    commit('candidate_Value', cvalue);
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
