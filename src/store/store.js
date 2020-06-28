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
  successm: null,
  dataChannel: null,
  ncon: null,
  notifs: [],
  currentU: null,
  file: null,
  currentF: [],
  currentFS: 0,
  currentFM: {},
  email: "",
  users: [],
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
  successGetter: state => state.successm,
  dataChannelGetter: state => state.dataChannel,
  nconGetter: state => state.ncon,
  notifsGetter: state => state.notifs,
  currentUGetter: state => state.currentU,
  fileGetter: state => state.file,
  currentFGetter: state => state.currentF,
  currentFSGetter: state => state.currentFS,
  currentFMGetter: state => state.currentFM,
  emailGetter: state => state.email,
  usersGetter: state => state.users,
};

const mutations = {
  send_Cur_User: function (state, cu) {
    state.currentU = cu;
  },
  C_Date: function (state, cdat) {
    if (!state.ws || state.ws.readyState !== 1) return;
    state.cdat = cdat
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
  Your_Connection: function (state, yourCon) {
    state.yourConnection = yourCon
    console.log('yourConnectionnnnnnnnnnnnnnnnnn', state.yourConnection)
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
    return state.ws.send(JSON.stringify(payload));

  },
  Send_Offer_Mutation: function (state, sendo) {
    if (!state.ws || state.ws.readyState !== 1) return;
    if (state.connectedUser !== null) {
      sendo.name = state.connectedUser;
    }
    state.sendState = sendo
    return state.ws.send(JSON.stringify(sendo));

  },
  UserAgent: function (state, payload) {
    state.userAgent = payload;
  },
  Login_Object: function (state, payload) {
    state.objectL = payload;
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
  success_M: function (state, successm) {
    state.successm = successm;
  },
  Data_Channel: function (state, datacha) {
    state.dataChannel = datacha;
    console.log('Data channelllllllllllllllll Ludo', state.dataChannel)
  },
  Send_Con_Notifs: function (state, ncon) {
    state.ncon = ncon;
  },
  Notifs_Tab: function (state, ntab) {
    state.notifs.push({ title: ntab })
    console.log(ntab, 'ntab ntabntab ntab')
  },
  Files: function (state, fil) {
    state.file = fil;
  },
  CurrentFile: function (state, curr) {
    state.currentF = state.currentF.push(atob(curr));
  },
  CurrentFileSize: function (state, curr) {
    state.currentFS = curr;
  },
  CurrentFileMeta: function (state, curr) {
    state.currentFM = curr;
  },
  Email: function (state, email) {
    state.email = email;
  },
  Users: function (state, users) {
    var filtered  = users.filter(function (user) {
        return user != state.currentU;
      })
    state.users = filtered;
    console.log('filtered filtered')
  },
  SendUsers: function (state, sendUsers) {
    if (!state.ws || state.ws.readyState !== 1) return;
    state.ws.send(JSON.stringify(sendUsers));
  },
};

const actions = {
  sendCurUser: ({ commit }, cu) => {
    commit('send_Cur_User', cu);
  },
  cdate: ({ commit }, cdat) => {
    commit('C_Date', cdat);
  },
  addYourStream: (context, payload) => {
    context.commit('AddYourStream', payload);
  },
  addTheirStream: ({ commit }, payload) => {
    commit('Add_Their_Stream', payload);
  },
  yourConnectionAction: ({ commit }, yourCon) => {
    commit('Your_Connection', yourCon);
  },
  connectedUser: (context, payload) => {
    context.commit('Connected_User', payload);
  },
  sendAction: ({ commit }, oblog) => {
    commit('Send_Mutation', oblog);
  },
  sendActionLeave: ({ commit }, oblog) => {
    commit('Send_Mutation_leave', oblog);
  },
  sofferAction: ({ commit }, sendo) => {
    commit('Send_Offer_Mutation', sendo);
  },
  wsAction: (context, ws) => {
    context.commit('Ws', ws);
  },
  userAgent: (context, payload) => {
    context.commit('UserAgent', payload);
  },
  loginA: ({ commit }, sendA) => {
    commit('Login_Object', sendA);
  },
  offerName: ({ commit }, oname) => {
    commit('Offer_Name', oname);
  },
  offerValue: ({ commit }, ovalue) => {
    commit('Offer_Value', ovalue);
  },
  answerValue: ({ commit }, avalue) => {
    commit('answer_Value', avalue);
  },
  candidateValue: ({ commit }, cvalue) => {
    commit('candidate_Value', cvalue);
  },
  successAction: ({ commit }, successm) => {
    commit('success_M', successm);
  },
  dataChannelAction: ({ commit }, datacha) => {
    commit('Data_Channel', datacha);
  },
  sendConNotifs: ({ commit }, ncon) => {
    commit('Send_Con_Notifs', ncon);
  },
  notifsTab: ({ commit }, ntab) => {
    commit('Notifs_Tab', ntab);
  },
  files: ({ commit }, fil) => {
    commit('Files', fil);
  },
  currentFile: ({ commit }, curr) => {
    commit('CurrentFile', curr);
  },
  currentFileSize: ({ commit }, curr) => {
    commit('CurrentFileSize', curr);
  },
  currentFileMeta: ({ commit }, curr) => {
    commit('CurrentFileMeta', curr);
  },
  email: ({ commit }, email) => {
    commit('Email', email);
  },
  users: ({ commit }, users) => {
    commit('Users', users);
  },
  sendUsers: ({ commit }, sendUsers) => {
    commit('SendUsers', sendUsers);
  },
  
};
// export default new Vuex.Store
export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
