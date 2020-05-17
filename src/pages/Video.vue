<template>
  <div class="hello">
    <div id="call-page" class="page">
      <video id="yours" :srcObject.prop="yourStream" autoplay></video>
      <video :srcObject.prop="theirStream" id="theirs" autoplay></video>
      <v-layout row wrap>
        <v-flex md1 xs12></v-flex>
        <v-flex md6 xs12>
         <v-text-field
         class="v-textcall-video"
         outlined
         dense
         label="Remote user"
         v-model="theirusername"
         required
         ></v-text-field>
         <v-text-field
         class="v-textcall-video"
         outlined
         dense
         id="message"
         label="message send"
         v-model="message"
         required
         ></v-text-field>
         <div id="received">{{ messag }}</div>

       </v-flex>
       <v-flex md4 xs12>
         <btn 
         label="Call"
         style="background-color:#0000ff21;margin:0 0 0 2%" 
         @click="callButton" />
         <btn 
         label="Send"
         style="background-color:#0000ff21;margin:0 0 0 2%" 
         @click="send" />
         <btn 
         label="Hang Up"
         style="background-color:#0000ff21;margin:0 0 0 2%" 
         @click="hang-up" />
       </v-flex>
     </v-layout>
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
    loggin: false,
    msg: 'Sorry but you should loggin first',
    loadr: undefined,
    cdate: null,
    messag: '',
  }),
  beforeUpdate() {
    const _this = this;
    // _this.fetchUser()
  },
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
        _this.$store.dispatch("successAction", data.success)
        _this.onLogin;
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
    _this.todo;
    ws.onerror = function (event) {
      console.error("WebSocket error observed:", event);
    }
    ws.onclose = function (event) {
      console.log("deconnection");
      // setTimeout(function timeout() {
      //   console.log(_this.wsGetters, 'wssssssssssssssssssssss')
      //   _this.created()
      // }, 1000);
    }
  },
  mounted() {
      // this.loadresponsive();
    this.listenToEvents();
    this.fetchUser();
  },
  computed: {
    ...mapGetters(['yourStream', 'theirStream', 'yourConnection', 'connectedUser', 'wsGetters', 'sendState', 'offName', 'offValue', 'ansValue', 'canValue', 'cdatGetters', 'successGetter']),
    // loadresponsive() {
    //   return this.$router.go(1)
    // },
    todo: function () {
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
  self.$store.dispatch("addTheirStream", null) 
  self.connectedUser = null; 
  // self.theirStream.src = null;  
  self.yourConnection.close();  
  self.yourConnection.onicecandidate = null;  
  self.yourConnection.onaddstream = null;  
  self.setupPeerConnection(self.yourStream); 
  console.log(self.connectedUser, ' Leave Connection')
},
    onLogin: function (success) {
      const self = this
      if (self.successGetter === false) {
        alert("Login unsuccessful, please try a different name.");
      } else {
        self.startConnection;
      }
    },
    setupPeerConnection: function () {
      const self = this;
      // console.log('Your Connectionnnnnnnn', self.yourConnection)
      self.yourConnection.addStream(self.yourStream);
      self.yourConnection.onaddstream = function (e) {
        self.$store.dispatch("addTheirStream", e.stream);
      };
      // Setup ice handling
      self.yourConnection.onicecandidate = function (event) {
          self.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
        };
        self.openDataChannel()
    },
    openDataChannel() {
  var dataChannelOptions = {
    ordered: true,
    reliable: true,
    negotiated: true,
    id: 0
  }
  dataChannel = yourConnection.createDataChannel("myLabel", dataChannelOptions);

  dataChannel.onerror = function (error) {    
    console.log("Data Channel Error:", error);  
  }
  dataChannel.onmessage = function (event) {
console.log("Got Data Channel Message:", event.data);
this.messag = event.data
}
  dataChannel.onopen = function () { 
    dataChannel.send(name + " has connected."); 
  }
  dataChannel.onclose = close()
 },
      onOffer (offer,name) {
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
  onAnswer: function (answer) {
    const self = this
    self.yourConnection.setRemoteDescription(new
      RTCSessionDescription(self.ansValue));
  },
  onCandidate: function (candidate) {
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
  startConnection: function () {
    var val = this
    var webrtcDetectedBrowser = ''
  var configuration = {}
  var connection_peer = {optional: []}
  configuration = webrtcDetectedBrowser === 'firefox' ?  
  {'iceServers':[{'url':'stun:23.21.150.121'},{ "url": "stun:127.0.0.1:8081" }]} : 
  // IP address  
  {'iceServers': [{'urls': 'stun:stun.1.google.com:19302'},{ "url": "stun:127.0.0.1:8081" }]}
  

    val.$store.dispatch("yourConnectionAction", configuration);
    if (val.hasUserMedia) {
      navigator.getUserMedia({ video: true, audio: true }, function
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
      // console.log(_this.sendState, '_this.sendStateeeeeee')
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
    if (theirusernameInput.length > 0) {
      self.startPeerConnection();
    }
  },
  listenToLogout() {
    const self = this
    bus.$on('refreshLogout', () => {
      self.$store.dispatch("sendActionLeave", { type: 'leave' });
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
      const email = response.data.current_user.email;
      var dataval = {
        fullname: nameval,
        email: email,
      }
      this.fetchUsersConnect(dataval)

      // ws.send(JSON.stringify({ type: 'login', name: nameval }))
      //   this.sendAction({ type: 'login', name: nameval })
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

