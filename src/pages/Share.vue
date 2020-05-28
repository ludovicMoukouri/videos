<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-md-3">HIIIIII</div>
      <div class="col-md-6">
        <v-layout row wrap>
        <v-flex md1 xs12></v-flex>
        <v-flex md7 xs8>
         <v-text-field
         class="v-textcall-video"
         outlined
         dense
         label="Remote user"
         v-model="theirusername"
         required
         ></v-text-field>
       </v-flex>
       <v-flex md4 xs3>
         <btn 
         label="Call"
         style="background-color:#0000ff21;margin:0 0 0 10%" 
         @click="callButton" />
       </v-flex>
     </v-layout>
      <ul id="received">
          <li v-for="item in items" :key="item.messages">
            {{ item.messages }}
          </li>
        </ul>
      <v-text-field
       class="v-textcall-video"
       outlined
       dense
       label="add chat message"
       v-model="messageds"
       required
       ></v-text-field>
      <btn 
       label="Send Message"
       style="background-color:#0000ff21;width:100%!important" 
       @click="sendData" />
      </div>
      <div class="col-md-3">
      <div style="background-color:grey">
      <div id="ready">Ready!</div>
      <br />
      <v-file-input small-chips multiple label="File Input gGgg"></v-file-input>
  <p id="enbas"></p>
  <div class="progress" id="status" style="visibility:hidden">
  </div><br />
  <input type="text" id="their-username" />
  <button id="connect">Connect</button>
</div>
</div>
    </div>

 <div class="row">
  <div>
    <h2 style="text-align:center">Sharing Files</h2>
  </div>
</div>
  <div class="row">
    <div class="col-md-2"></div>
    
<div class="col-md-5">
  <h5 id="conection_name" style="color:white;font-size:bold"></h5><br />
</div>
</div>


</div>
</template>
<!-- <template v-else>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template> -->

<script>
import axios from 'axios';
import { mapGetters, mapActions  } from 'vuex'
import bus from './../bus';
const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);
// const ws = new WebSocket(`ws://v-video.herokuapp.com:21279`);

export default {
  name: 'HelloWorld',
  data: () => ({
    theirusername: '',
    modalOpen: false,
    loggin: false,
    msg: 'Sorry but you should loggin first',
    loadr: undefined,
    cdate: null,
    messageds: '',
    nbool: false,
    curUser: '',
    items: [],
    // notifs: [],
  }),
  created() {
    this.$store.dispatch('wsAction', ws)
    const _this = this;
    ws.onopen = function () {
      console.log("Connected");
    };
    ws.onmessage = function (message) {
      console.log("Got message", message.data);
      var data = JSON.parse(message.data);
      switch(data.type) {
        case "login":
        _this.onLogin;
        _this.$store.dispatch("successAction", data.success)
        break;
        case "offer":
        _this.$store.dispatch("offerName", data.name)
        _this.$store.dispatch("offerValue", data.offer)
        _this.onOffer;
        break;
        case "answer":
        _this.$store.dispatch("answerValue", data.answer)
        _this.onAnswer;
        break;
        case "candidate":
        _this.$store.dispatch("candidateValue", data.candidate)
        _this.onCandidate;
        break;
        case "leave":
        _this.onLeave;
        break;
        default:
        break;
      }
    };
    _this.keepServerActive;
    ws.onerror = function (err) {
      console.error("Got error observed: ", err);
    }
    // ws.onclose = function (event) {
    //   console.log("deconnection");
    //   // setTimeout(function timeout() {
    //   //   console.log(_this.wsGetters, 'wssssssssssssssssssssss')
    //   //   _this.created()
    //   // }, 1000);
    // }
  },
  mounted() {
      // this.loadresponsive();
      this.listenToEvents();
      this.fetchUser();
    },
    beforeUpdate() {
      const _this = this;
    // this.openDataChannel()
    // _this.fetchUser()
  },
  computed: {
    ...mapGetters(['yourStream', 'theirStream', 'yourConnection', 'connectedUser', 'wsGetters', 'sendState', 'offName', 'offValue', 'ansValue', 'canValue', 'cdatGetters', 'successGetter', 'dataChannelGetter', 'nconGetter', 'notifsGetter', 'currentUGetter']),
    // loadresponsive() {
    //   return this.$router.go(1)
    // },
    keepServerActive: function () {
      const self = this
      const cdate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
      this.cdate = cdate
      setInterval(function () {
        self.$store.dispatch("cdate", { type: 'cdate', cdate: cdate });
      }, 5000);
    },
    loadwindow() {
      this.loadr = window.location.reload()
      return this.loadr
    },
    loadLogout() {
      return this.$router.go(1)
    },
    onLeave: function () { 
      const self = this 
      self.$store.dispatch("connectedUser", null);
  self.yourConnection.close();  
  self.yourConnection.onicecandidate = null; 
  self.setupPeerConnection(); 
  // console.log(self.connectedUser, ' Leave Connection')
},
onLogin: function () {
  const self = this

  if (self.successGetter === false) {
    alert("Login unsuccessful, please try a different name.");
  } else {
    self.startConnection;
    this.nbool = !this.nbool
  }
},
setupPeerConnection: function () {
  const self = this;
  
  var dataChannelOptions = {
    ordered: true,
    reliable: false,
    negotiated: true,
    id: 0
  }
      self.$store.dispatch("dataChannelAction", dataChannelOptions);
      // Setup ice handling
      self.yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
        self.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
      };
    };
      self.openDataChannel()
    },
    onOffer: function () {
      const _this = this
      // console.log(_this.offName, 'Onoffer connection nameeeeee')
      _this.$store.dispatch("connectedUser", _this.offName);
      _this.yourConnection.setRemoteDescription(new RTCSessionDescription(_this.offValue));
      _this.yourConnection.createAnswer(function (answer) {
        _this.yourConnection.setLocalDescription(answer);
        _this.$store.dispatch("sendAction", { type: 'answer', answer: answer });
      }, function (error) {
        alert("An error has occurred");
      });
    },
    onAnswer: function () {
      const self = this
      self.yourConnection.setRemoteDescription(new
        RTCSessionDescription(self.ansValue));
    },
    onCandidate: function () {
      const self = this
      self.yourConnection.addIceCandidate(new RTCIceCandidate(self.canValue));
    },
    hasUserMedia: function () {
      navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
      return !!navigator.getUserMedia;
    },
    hasRTCPeerConnection: function () {
      window.RTCPeerConnection = window.RTCPeerConnection ||
      window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      window.RTCSessionDescription = window.RTCSessionDescription ||
      window.webkitRTCSessionDescription ||
      window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.RTCIceCandidate ||
      window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
      return !!window.RTCPeerConnection;
    },
    hasFileApi: function () {
      return window.File && window.FileReader && window.FileList && window.Blob;
    },
    startConnection: function () {
      var val = this
      var webrtcDetectedBrowser = ''
      var configuration = {}
      var connection_peer = {optional: [{RtpDataChannels: true}]}
      configuration = webrtcDetectedBrowser === 'firefox' ?  
      {'iceServers':[{'url':'stun:23.21.150.121'},{ "url": 'stun:127.0.0.1:8081' }]} :
  // IP address  
  {'iceServers': [{'urls': 'stun:stun.1.google.com:19302'},{ "url": 'stun:127.0.0.1:8081' }]}
  val.$store.dispatch("yourConnectionAction", configuration, connection_peer);
      if (val.hasUserMedia) {
        navigator.getUserMedia({ video: true, audio: false }, function
          (myStream) {
            val.$store.dispatch("addYourStream", myStream);
            if (val.hasRTCPeerConnection) {
              val.setupPeerConnection;
            } else {
              alert("Sorry, your browser does not support WebRTC.");
            }
          }, function (error) {
            console.log(error);
          });
      } else {
        alert("Sorry, your browser does not support WebRTC.");
      }
    },

    startPeerConnection: function () {
      const _this = this;
      _this.$store.dispatch("connectedUser", _this.theirusername)
      // Begin the offer
      _this.yourConnection.createOffer(function (offer) {

        _this.$store.dispatch("sofferAction", { type: 'offer', offer: offer });
        _this.yourConnection.setLocalDescription(offer);
      }, function (error) {
        alert("An error has occurred.");
      });
      setTimeout(function() {
        _this.sendData()
      }, 3000);
    },
  },
  watch: {
    loadresponsive() {
      this.fetchUser();
    },
    loadLogout() {
      this.listenToLogout();
    }
  },
  methods: {
    ...mapActions (['wsAction', 'sendAction', 'connectedUser', 'yourConnectionAction', 
      'addTheirStream', 'addYourStream']),
  //   checkAgent(){
  //     const mobile = {
  //     video: {
  //       mandatory: {
  //         maxWidth: 640,
  //         maxHeight: 360
  //       }
  //     },
  //     audio: false
  //   };
  //   const desktop = {
  //     video: {
  //       mandatory: {
  //         minWidth: 1280,
  //         minHeight: 720
  //       }
  //     },
  //     audio: false
  //   };
  //   if(/Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  //     this.$store.dispatch("userAgent", desktop);
  // } else {
  //   this.$store.dispatch("userAgent", mobile);
  // }
  //   },
  callButton() {
    const theirusernameInput = this.theirusername;
    const self = this
    // this.$store.dispatch("sendConNotifs", { type: 'notif', data: 'You are connected with '+this.curUser });
    if (theirusernameInput.length > 0) {
      self.startPeerConnection;
    }
  },
  openDataChannel() {
    const self = this 
    
    this.dataChannelGetter.onopen = function () { 
      self.dataChannelGetter.send(self.currentUGetter + " has connected."); 
    }
    this.dataChannelGetter.onerror = function (error) {    
      console.log("Data Channel Error:", error);  
    }
    this.dataChannelGetter.onmessage = function (event) {
      console.log("Got Data Channel Message:", event.data);
      
      var data = JSON.parse(event.data);
      try{
        if(data.mtype === 'notification') {
         self.$store.dispatch("notifsTab", data.msge);
         bus.$emit('refreshnotif');
       }else {
        self.items.push({messages: "recv: " + data.msge})
      }
    } catch(e) {
      alert(e)
    }
      // self.$store.dispatch("sendConNotifs", null);
    }
    this.dataChannelGetter.onclose = close()
  },
  sendData() {
    const self = this
    const messageds = this.messageds
    if(this.nbool){ 
      console.log(this.dataChannelGetter, ' this.dataChannellllllllllll share')
      self.dataChannelGetter.send(JSON.stringify({mtype: 'notification', msge: 'You are connected with '+this.curUser}));
      this.nbool = !this.nbool
    }else {
      const messageSender = "Sender: "+this.messageds
      this.items.push({messages: messageSender})
      this.dataChannelGetter.send(JSON.stringify({ mtype: 'datamess', msge: messageds}));
    }
  },
  listenToLogout() {
    const self = this
    bus.$on('refreshLogout', () => {
      this.$store.dispatch("sendActionLeave", { type: 'leave' });
    });
  },
  listenToEvents() {
    bus.$on('refreshUser', () => {
      this.loadwindow();
    });
  },
  async fetchUser() {
    return axios({
      method: 'get',
      url: '/api/current_user',
    })
    .then((response) => {
      const nameval = response.data.current_user.fullname;
      this.curUser = nameval
      const email = response.data.current_user.email;
      var dataval = {
        fullname: nameval,
        email: email,
      }
      this.fetchUsersConnect(dataval)
      this.$store.dispatch("sendCurUser", nameval);
      const self = this
      self.$store.dispatch("sendAction", { type: 'login', name: nameval });
    })
    .catch(() => {
    });
  },
  async fetchUsersConnect(dataval) {
    return axios({
      method: 'post',
      url: '/users/usersConnect',
      data: dataval,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      this.msg = response.data.message;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  },
},
};
</script>

