<template>
  <div class="hello">
    <div id="call-page" class="page">
      <video id="yours" :srcObject.prop="yourStream" autoplay></video>
      <video :srcObject.prop="theirStream" id="theirs" autoplay></video>
      <input v-model="theirusername" />
      {{ streamStore }}
      <btn 
      label="Call"
      style="background-color:#0000ff21;margin:0 0 0 2%" 
      @click="callButton" />
      <btn id="hang-up">Hang Up</btn>
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
    msg: 'Sorry but you should loggin first'
  }),
  mounted() {
    this.listenToEvents()
    this.fetchUser()
  },
  created() {
    const _this = this;
    this.$store.dispatch('wsAction', ws)
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
  },
  computed: {
    ...mapGetters(['yourStream', 'theirStream', 'yourConnection', 'connectedUser', 'ws', 'sendMessage']),
    onLogin: function (success) {
      if (success === false) {
        alert("Login unsuccessful, please try a different name.");
      } else {
        this.startConnection;
      }
    },
    setupPeerConnection: function (stream) {
      this.yourConnection.addStream(stream);
      this.yourConnection.onaddstream = function (e) {
        this.$store.dispatch("addTheirStream", e.stream);
      };
      // Setup ice handling
      this.yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
    //       if (this.connectedUser) {
    //   ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, 
    //     name: this.connectedUser }));
    // } else {ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));}
    
          this.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
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
        _this.$store.dispatch("sendAction", { type: 'answer', answer: answer });
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
    hasUserMedia () {
      navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
      return !!navigator.getUserMedia;
    },
    hasRTCPeerConnection () {
      window.RTCPeerConnection = window.RTCPeerConnection ||
      window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      window.RTCSessionDescription = window.RTCSessionDescription ||
      window.webkitRTCSessionDescription ||
      window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.RTCIceCandidate ||
      window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
      return !!window.RTCPeerConnection;
    },
    startConnection () {
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
        _this.$store.dispatch("sendAction", { type: 'offer', offer: offer });
        _this.yourConnection.setLocalDescription(offer);
      }, function (error) {
        alert("An error has occurred.");
      });
    },
  },
  methods: {
    // ...mapActions (['wsAction', 'sendAction', 'connectedUser', 'yourConnectionAction', 
    //   'addTheirStream', 'addYourStream']),
    callButton() {
      const theirusernameInput = this.theirusername;
      if (theirusernameInput.length > 0) {
        this.startPeerConnection();
      }
    },
    listenToEvents() {
      bus.$on('refreshUser', () => {
        this.fetchUser();
        this.loggin = 'true'
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
        ws.send(JSON.stringify({ type: 'login', name: nameval }))
        // this.sendAction({ type: 'login', name: nameval })
        // this.$store.dispatch("sendAction", { type: 'login', name: nameval });
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

