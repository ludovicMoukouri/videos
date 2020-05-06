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
       </v-flex>
       <v-flex md4 xs12>
         <btn 
         label="Call"
         style="background-color:#0000ff21;margin:0 0 0 2%" 
         @click="callButton" />
         <btn id="hang-up">Hang Up</btn>
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
    loadhref: undefined,
  }),
  beforeCreate() {
    this.$store.dispatch('wsAction', ws)
    _this.listenToLogout()
  },
  beforeUpdate() {
    const _this = this;
    _this.fetchUser()
  },
  created() {
    const _this = this;
    ws.onopen = function () {
      console.log("Connected");
    };
    ws.onmessage = function (message) {
      console.log("Got message", message.data);
      var data = JSON.parse(message.data);
      switch(data.type) {
        case "login":
        _this.onLogin(data.success);
        break;
        case "offer":
        _this.onOffer(data.offer, data.name);
        break;
        case "answer":
        _this.onAnswer(data.answer);
        break;
        case "candidate":
        _this.onCandidate(data.candidate);
        break;
        case "leave":
        _this.onLeave();
        break;
        default:
        break;
      }
    };
    ws.onclose = function () {
      console.log("deconnection");
    };
    console.log(ws, 'wssssssssssssssssssssss')
  },
  mounted() {
    this.listenToEvents()
    this.fetchUser();
  },
  computed: {
    ...mapGetters(['yourStream', 'theirStream', 'yourConnection', 'connectedUser', 'ws', 'sendState']),
    loadr() {
      this.loadr = location.reload()
      this.loadhref = location.href
      return this.loadr
    },
    onLeave: function () { 
    const self = this 
  self.connectedUser = null;  
  self.theirStream.src = null;  
  self.yourConnection.close();  
  self.yourConnection.onicecandidate = null;  
  self.yourConnection.onaddstream = null;  
  self.setupPeerConnection(self.yourStream); 
  console.log(self.connectedUser, ' Leave Connection')
},
    ping: function () {
        ws.send('__ping__');
        tm = setTimeout(function (){
    }, 5000);
},
    onLogin: function (success) {
      if (success === false) {
        alert("Login unsuccessful, please try a different name.");
      } else {
        this.startConnection;
      }
    },
    setupPeerConnection: function (stream) {
      this.yourConnection.addStream(this.yourStream);
      this.yourConnection.onaddstream = function (e) {
        this.$store.dispatch("addTheirStream", e.stream);
      };
      // Setup ice handling
      this.yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
          if (this.connectedUser) {
            ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, 
              name: this.connectedUser }));
          } else {ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));}

          // this.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
        }
      };
    },
    onOffer: function (offer, name) {
      const _this = this
      this.$store.dispatch("connectedUser", name);
      this.yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

    //   this.yourConnection.createOffer(function(offer) {
    // this.yourConnection.setLocalDescription(new RTCSessionDescription(offer))
    //   },function (error) {
    //     alert("An error has occurred");
    //   });

    this.yourConnection.createAnswer(function (answer) {
      this.yourConnection.setLocalDescription(answer);
      if (this.connectedUser) {
        ws.send(JSON.stringify({ type: 'answer', answer: answer, 
          name: this.connectedUser }));
      } else {ws.send(JSON.stringify({ type: 'answer', answer: answer }));}

      // _this.$store.dispatch("sendAction", { type: 'answer', answer: answer });
    }, function (error) {
      alert("An error has occurred");
    });
  },
  onAnswer: function (answer) {
    this.yourConnection.setRemoteDescription(new
      RTCSessionDescription(answer));
  },
  onCandidate: function (candidate) {
    this.yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
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
    if (val.hasUserMedia) {
      navigator.getUserMedia({ video: true, audio: false }, function
        (myStream) {
          val.$store.dispatch("addYourStream", myStream);
          if (val.hasRTCPeerConnection) {
            val.setupPeerConnection(myStream);
          } else {
            alert("Sorry, your browser does not support WebRTC.");
          }
        }, function (error) {
          console.log(error);
        });
    } else {
      alert("Sorry, your browser does not support WebRTC.");
    }
    var configuration = {
      "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
    };
    val.$store.dispatch("yourConnectionAction", configuration);
  },

  startPeerConnection: function (user) {
    const _this = this;
    console.log(this.theirusername,'startPeerConnection LLLLLLLLLLLLLLLLLLLLLLLL')
    _this.$store.dispatch("connectedUser", this.theirusername)
      // Begin the offer
      _this.yourConnection.createOffer(function (offer) {
        if (this.connectedUser) {
          ws.send(JSON.stringify({ type: 'offer', offer: offer, 
            name: this.connectedUser }));
        } else {ws.send(JSON.stringify({ type: 'offer', offer: offer }));}

        // _this.$store.dispatch("sendAction", { type: 'offer', offer: offer });
        _this.yourConnection.setLocalDescription(offer);
      }, function (error) {
        alert("An error has occurred.");
      });
    },
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
    if (theirusernameInput.length > 0) {
      this.startPeerConnection();
    }
  },
  listenToLogout() {
    bus.$on('refreshLogout', () => {
      this.$store.dispatch("sendAction", { type: 'leave' });
    });
  },
  listenToEvents() {
    bus.$on('refreshUser', () => {
      this.fetchUser();
      this.loadr();
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
        this.$store.dispatch("sendAction", { type: 'login', name: nameval });
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

