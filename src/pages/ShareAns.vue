<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">HIIIIII</div>
      <div class="col-md-6" class="page">
        <h2>File Sharing</h2>
        <div :class="[ready ? divDesk : divMobil]">Ready!</div>
        <br />
        <br />
        <b-form-file 
        multiple
        v-model="files"
        :state="Boolean(files)"
        placeholder="Choose a fole or drop it here."
        drop-placeholder="Drop file here ..."
        ></b-form-file>
        <!-- <div class="mt-3">Selected file: {{ files[0] ? files[0].name : ''}}</div> -->
        

      <btn
      label="Send Files"
      :disabled="!ready"
      style="background-color:#0000ff21;width:100%!important"
      @click="uploadFiles"
      />
      <div class="progress" id="status" style="visibility:hidden">
        </div>
    </div>
    <div class="col-md-3">
      <div style="background-color:#dedeff">
        <br />
        <v-text-field
        outlined
        class="v-textfield"
        dense
        label="remote User"
        v-model="remoteusername"
        required
        ></v-text-field>
        <btn
        label="Connect"
        style="background-color:#0000ff21;margin:0px 2% 0px 0px"
        :loading="loading"
        :disabled="ready"
        @click="connectButton"
        />
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
      <h5 id="conection_name2" style="color:white;font-size:bold"></h5>
      <br />
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
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import bus from "./../bus";
const HOSTSHARE = location.origin.replace(/^http/, "ws");
const wsshare = new WebSocket(HOSTSHARE);
// const ws = new WebSocket(`ws://v-video.herokuapp.com:21279`);

export default {
  name: "HelloWorld",
  data: () => ({
    remoteusername: "",
    isFiles: false,
    files: [],
    ready: false,
    divDesk: 'divDesk',
    divMobil: 'divMobil',
    modalOpen: false,
    loggin: false,
    msg: "Sorry but you should loggin first",
    loadr: undefined,
    cdate: null,
    CHUNK_MAX: 50000,
    currentFileSize: 0,
    currentFile: [],
    currentFileMeta: {},
    binary: null,
    nbool: false,
    curUser: "",
    typ: "",
    start: 0,
    end: 0,
    last: false,
    buffer: [],
    nam: "",
    items: [],
    data: null,
    fileRecords: [],
    uploadUrl: 'http://localhost:8081/share',
    uploadHeaders: { 'X-Test-Header': 'vue-file-agent' },
    fileRecordsForUpload: [],
    // notifs: [],
  }),
  created() {
    this.$store.dispatch("wsAction", wsshare);
    const _this = this;
    wsshare.onopen = function() {
      console.log("Connected");
    };
    wsshare.onmessage = function(message) {
      console.log("Got message", message.data);
      var data = JSON.parse(message.data);
      switch (data.type) {
        case "login":
        _this.$store.dispatch("successAction", data.success);
        _this.onLogin;
        break;
        case "offer":
        _this.$store.dispatch("offerName", data.name);
        _this.$store.dispatch("offerValue", data.offer);
        _this.onOffer;
        break;
        case "answer":
        _this.$store.dispatch("answerValue", data.answer);
        _this.onAnswer;
        break;
        case "candidate":
        _this.$store.dispatch("candidateValue", data.candidate);
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
    wsshare.onerror = function(err) {
      console.error("Got error observed: ", err);
    };
    wsshare.onclose = function(event) {
      console.log("deconnection");
      // setTimeout(function timeout() {
      //   console.log(_this.wsGetters, 'wssssssssssssssssssssss')
      //   _this.created()
      // }, 1000);
    }
  },
  mounted() {
    this.loadresponsive;
    this.listenToEvents();
    this.fetchUser();
  },
  computed: {
    ...mapGetters([
      "yourStream",
      "theirStream",
      "yourConnection",
      "connectedUser",
      "wsGetters",
      "sendState",
      "offName",
      "offValue",
      "ansValue",
      "canValue",
      "cdatGetters",
      "successGetter",
      "dataChannelGetter",
      "nconGetter",
      "notifsGetter",
      "currentUGetter",
      "fileGetter",
      "currentFGetter",
      "currentFSGetter",
      "currentFMGetter"
      ]),
    loadresponsive() {
      return this.$router.go(1);
    },
    keepServerActive: function() {
      const self = this;
      const cdate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
      this.cdate = cdate;
      setInterval(function() {
        self.$store.dispatch("cdate", { type: "cdate", cdate: cdate });
      }, 5000);
    },
    loadwindow() {
      this.loadr = window.location.reload();
      return this.loadr;
    },
    loadLogout() {
      return this.$router.go(1);
    },
    onLeave: function() {
      const self = this;
      self.$store.dispatch("connectedUser", null);
      self.yourConnection.close();
      self.yourConnection.onicecandidate = null;
      self.setupPeerConnection();
      // console.log(self.connectedUser, ' Leave Connection')
    },
    onLogin: function() {
      const self = this;
      this.nbool = !this.nbool;
      var webrtcDetectedBrowser = "";
      var configuration = {};
      var connection_peer = {
        optional: []
        // optional: [{ DtlsSrtpKeyAgreement: true }, { RtpDataChannels: true }]
      };
      configuration = webrtcDetectedBrowser === "firefox" ? {
        iceServers: [
        { urls: "stun:23.21.150.121"},
        { url: "stun:127.0.0.1:8081" }
        ]
      }
          : // IP address
          {
            iceServers: [
            { urls: "stun:stun.1.google.com:19302" },
            { url: "stun:127.0.0.1:8081" }
            ]
          };
          self.$store.dispatch("yourConnectionAction", configuration, connection_peer);

          if (self.successGetter === false) {
            alert("Login unsuccessful, please try a different name.");
          } else {
            self.startConnection;
          }
        },
        setupPeerConnection: function() {
          const self = this;

      // Setup ice handling
      self.yourConnection.onicecandidate = function(event) {
        self.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
      }
      // self.yourConnection.ondatachannel = function(ev){
      //   console.log('Data channel ids create!');
      //   ev.channel.onopen = function() {
      //     console.log('Data channel is open and ready to be used.')
      //   }
      // }
      self.openDataChannel();
    },
    onOffer: function() {
      const _this = this;
      _this.$store.dispatch("connectedUser", _this.offName);
      _this.yourConnection.setRemoteDescription(
        new RTCSessionDescription(_this.offValue)
        );
      _this.yourConnection.createAnswer(
        function(answer) {
          _this.yourConnection.setLocalDescription(answer);
          _this.$store.dispatch("sendAction", {
            type: "answer",
            answer: answer
          });
        },
        function(error) {
          alert("An error has occurred");
        }
        );
    },
    onAnswer: function() {
      const self = this;
      self.yourConnection.setRemoteDescription(
        new RTCSessionDescription(self.ansValue)
        );
    },
    onCandidate: function() {
      const self = this;
      self.yourConnection.addIceCandidate(new RTCIceCandidate(self.canValue));
    },
    hasUserMedia: function() {
      navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
      return !!navigator.getUserMedia;
    },
    hasRTCPeerConnection: function() {
      window.RTCPeerConnection =
      window.RTCPeerConnection ||
      window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection;
      window.RTCSessionDescription =
      window.RTCSessionDescription ||
      window.webkitRTCSessionDescription ||
      window.mozRTCSessionDescription;
      window.RTCIceCandidate =
      window.RTCIceCandidate ||
      window.webkitRTCIceCandidate ||
      window.mozRTCIceCandidate;
      return !!window.RTCPeerConnection;
    },
    hasFileApi: function() {
      return window.File && window.FileReader && window.FileList && window.Blob;
    },
  
startConnection: function() {
  var val = this;
  if (val.hasRTCPeerConnection) {
    val.setupPeerConnection;
  } else {
    alert("Sorry, your browser does not support WebRTC.");
  }
},

startPeerConnection: function() {
  const _this = this;

  _this.$store.dispatch("connectedUser", _this.remoteusername);
      // Begin the offer
      _this.yourConnection.createOffer(
        function(offer) {
          _this.$store.dispatch("sofferAction", {
            type: "offer",
            offer: offer
          });
          _this.yourConnection.setLocalDescription(offer);
        },
        function(error) {
          alert("An error has occurred.");
        }
        );
      setTimeout(function() {
        _this.uploadFiles();
      }, 1000);
    }
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
    ...mapActions([
      "wsAction",
      "sendAction",
      "connectedUser",
      "yourConnectionAction",
      "addTheirStream",
      "addYourStream",
      ]),
    deleteUploadedFile: function (fileRecord) {
        // Using the default uploader. You may use another uploader instead.
        this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
      },
      filesSelected: function (fileRecordsNewlySelected) {
        var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
        this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
      },
      onBeforeDelete: function (fileRecord) {
        var i = this.fileRecordsForUpload.indexOf(fileRecord);
        if (i !== -1) {
          this.fileRecordsForUpload.splice(i, 1);
        } else {
          if (confirm('Are you sure you want to delete?')) {
            this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
          }
        }
      },
      fileDeleted: function (fileRecord) {
        var i = this.fileRecordsForUpload.indexOf(fileRecord);
        if (i !== -1) {
          this.fileRecordsForUpload.splice(i, 1);
        } else {
          this.deleteUploadedFile(fileRecord);
        }
      },
      
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
    connectButton() {
      const theirusernameInput = this.remoteusername;
      const self = this;
      if (theirusernameInput.length > 0) {
        self.startPeerConnection;
        this.ready = !this.ready
      }
    },
    openDataChannel() {
      const self = this;
      var dataChannelOptions = {
        ordered: true,
        reliable: true,
        negotiated: true,
        id: 1
      };
      const dataChannel = this.yourConnection.createDataChannel("myShare", dataChannelOptions);
      self.$store.dispatch("dataChannelAction", dataChannel);

      dataChannel.onerror = function(error) {
        console.log("Data Channel Error:", error);
      };
      dataChannel.onmessage = function(event) {
        
        try {
          var message = JSON.parse(event.data);
          switch (message.mtype) {
            case "notification":
            self.$store.dispatch("notifsTab", data.msge);
            bus.$emit("refreshnotif");
            break;
            case "start":
            self.currentFile = []
            self.currentFileSize = 0;
            self.$store.dispatch("currentFileMeta", message.data);
            self.currentFileMeta = message.data;
            self.ready = true
            self.typ = message.data_type;
            self.nam = message.data_name;
            self.siz = message.data_size;
            self.data = {type:message.data_type, name:message.data_name}
            
            console.log("Receiving file", message.data_size);
            break;
            case "end":
            self.saveFile({type:self.typ,name:self.nam}, self.currentFile);
            console.log("end end end", self.currentFile)
            break;
            case "buffer":
            console.log("Got Data Channel Message:", message.arrbuf);
          self.currentFile.push(atob(message.arrbuf));
          console.log(self.currentFile.length, ' longueur longueur longueur')
          self.currentFileSize += self.currentFile[self.currentFile.length - 1].length;
      
      var percentage = Math.floor((self.currentFileSize / self.siz) * 100),
      statusText = document.querySelector('#status'), div;
      statusText.style.visibility = 'visible'
      div = document.createElement("div")
      div.setAttribute("class","progress-bar")
      div.setAttribute("role","progressbar")
      div.style.width = percentage+'%' 
      div.setAttribute("aria-valuenow", percentage)
      div.setAttribute("aria-valuemin", 0)
      div.setAttribute("aria-valuemax", 100)
      
      statusText.appendChild(div)
      console.log('onmessage error catch', e)
            break;
          } 
        } catch (e) {
          // self.$store.dispatch("currentFile", event.data);
          
        }
      };
      dataChannel.onopen = function() {
        self.dataChannelGetter.send(self.currentUGetter + " has connected.");
      };
      dataChannel.onclose = function() {
        console.log("Data channel has been closed.");
      };
    },
    sendFile(file) {
      var reader = new FileReader();
      self = this
      console.log("last boolean value sendFile", file)

      reader.onloadend = function(evt) {
        console.log("last boolean value reader.onloadend")
        if (evt.target.readyState == FileReader.DONE) {
          var buffer = reader.result,
          start = 0,
          end = 0,
          last = false;

          function sendChunk() {
            console.log("last boolean value chunk")

            end = start + self.CHUNK_MAX;

        if (end > file.size) {
          end = file.size;
          last = true;
        }
           
            var percentage = Math.floor((end / file.size) * 100),
            statusText = document.querySelector('#status'), div;
            statusText.style.visibility = 'visible'
            div = document.createElement("div")
            div.setAttribute("class","progress-bar")
            div.setAttribute("role","progressbar")
            div.style.width = percentage+'%' 
            div.setAttribute("aria-valuenow", percentage)
            div.setAttribute("aria-valuemin", 0)
            div.setAttribute("aria-valuemax", 100)
            statusText.appendChild(div)
        // statusText.innerHTML = "Sending... " + percentage + "%";
        self.dataChannelGetter.send(
          JSON.stringify({mtype:"buffer", arrbuf: self.arrayBufferToBase64(buffer.slice(start, end))}));
        // If this is the last chunk send our end message, otherwise keep sending
        
        console.log('this.last this.last', last)
        if (last) {
          console.log("last boolean value")
          self.dataChannelGetter.send(JSON.stringify({
            mtype: "end"
          }));
        } else {
          start = end;
          // Throttle the sending to avoid flooding
          setTimeout(function () {
            sendChunk();
          }, 100);
        }
          }
      sendChunk();
    }
  };
  reader.readAsArrayBuffer(file);
},
      arrayBufferToBase64 (buffer) {
        var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa(binary);
    },

    saveFile(meta, data) {
      const self = this
      var blob = self.base64ToBlob(data, meta.type);
      console.log('blob blob blob', blob)
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = self.nam;
      link.click();
  
    },
    base64ToBlob(b64Data, contentType) {
      contentType = contentType || '';
      console.log('contentType contentType', contentType)

      var byteArrays = [], byteNumbers, slice;

      console.log(' b64Data.length ', b64Data.length)
      for (var i = 0; i < b64Data.length; i++) {
        slice = b64Data[i];

        byteNumbers = new Array(slice.length);
        for (var n = 0; n < slice.length; n++) {
          byteNumbers[n] = slice.charCodeAt(n);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
      console.log(byteArrays, ' byteArrays byteArrays')
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    },
    uploadFiles() {
      const self = this;
console.log(this.files.length, "this.files[0]")
      if (this.files.length > 0) {
        // self.dataChannelGetter.send(
        //   JSON.stringify({ mtype: "notification",
        //     msge: "You are connected with " + this.curUser }));

        // const fi = this.files[0]
        // this.files
        // this.$store.dispatch("files", fi);

        self.dataChannelGetter.send(
          JSON.stringify({
            mtype: "start",
            data_type: self.files[0].type,
            data_name: self.files[0].name,
            data_size: self.files[0].size,
            data: self.files[0]
          }));

        this.sendFile(self.files[0]);
        
      } 
    },
    
    

    listenToLogout() {
      const self = this;
      bus.$on("refreshLogout", () => {
        this.$store.dispatch("sendActionLeave", { type: "leave" });
      });
    },
    listenToEvents() {
      bus.$on("refreshUser", () => {
        this.loadwindow();
      });
    },
    async fetchUser() {
      return axios({
        method: "get",
        url: "/api/current_user"
      })
      .then(response => {
        const nameval = response.data.current_user.fullname;
        this.curUser = nameval;
        const email = response.data.current_user.email;
        var dataval = {
          fullname: nameval,
          email: email
        };
        console.log(nameval, 'nameval nameval nameval')
        this.fetchUsersConnect(dataval);
        this.$store.dispatch("sendCurUser", nameval);
        const self = this;
        this.$store.dispatch("sendAction", { type: "login", name: nameval });
      })
      .catch((e) => {console.log(e, 'fetchUser error')});
    },
    async fetchUsersConnect(dataval) {
      return axios({
        method: "post",
        url: "/users/usersConnect",
        data: dataval,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.msg = response.data.message;
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
    }
  }
};
</script>

