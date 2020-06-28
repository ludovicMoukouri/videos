<template>
  <div class="container-fluid">
    <div class="row">
      <span v-for="user in usersGetter" class="username-display-mobil">
            <button
          style="background-color:#dedeff;margin:0px 4% 2% 0px"
          :disabled="ready"
          class="username-connected-lud"
          @click="connectButton(user)"
          > <img :src="imagesProfil.profilImg" width="40px" height="40px" class="rounded-circle"> {{ user }}</button>
          </span>
    </div>
    <div class="row" v-if="login">
      <div class="col-md-2">
        
        <div style="background-color:#dedeff" class="username-display">
          <div :class="[ready ? divDesk : divMobil]">Ready!</div>
          <br />
          
          <!-- <btn
          label="Connect"
          style="background-color:#0000ff21;margin:0px 2% 0px 0px"
          :loading="loading"
          :disabled="ready"
          @click="connectButton"
          /> -->
          <div v-for="user in usersGetter">
            <button
          style="background-color:#dedeff;margin:0px 2% 2% 0px"
          :disabled="ready"
          @click="connectButton(user)"
          > <img :src="imagesProfil.profilImg" width="40px" height="40px" class="rounded-circle"> {{ user }}</button>
          </div>
        </div>

      </div>
      <div class="col-md-7">
        <h2>File Sharing</h2>
        <br />
        <!-- <b-form-file 
        multiple
        v-model="files"
        :state="Boolean(files)"
        placeholder="Choose a fole or drop it here."
        drop-placeholder="Drop file here ..."
        ></b-form-file> -->
        <!-- <div class="mt-3">Selected file: {{ files[0] ? files[0].name : ''}}</div> -->
        
        <template>
          <VueFileAgent
          ref="vueFileAgent"
          :theme="'default'"
          :multiple="true"
          :state="Boolean(files)"
          :deletable="true"
          :meta="true"
          :editable="true"
          :accept="'image/*,.zip,.docx,.exe,.pdf'"
          :maxSize="'50GB'"
          :maxFiles="3"
          :disabled="!ready"
          :helpText="'Choose files to send'"
          :errorText="{
          type: 'Invalid file type. Only images or zip Allowed',
          size: 'Files should not exceed 10MB in size',
        }"
        @select="filesSelected($event)"
        @beforedelete="onBeforeDelete($event)"
        @delete="fileDeleted($event)"
        v-model="files"
        ></VueFileAgent>
          <!-- <button :disabled="!fileRecordsForUpload.length" @click="uploadFiles()">
            Upload {{ fileRecordsForUpload.length }} files
          </button> -->
        </template>

        <btn
        label="Send Files"
        :disabled="!ready"
        style="background-color:#0000ff21;width:100%!important"
        @click="uploadFiles"
        />
        <div class="row" id="nameRow" style="display:none">

          <div class="col-md-3">

            <div id="name" class="file-name-upload" style="visibility:hidden">
            </div>

          </div>

          <div class="col-md-9">

            <div class="progress" id="status" style="visibility:hidden">
            </div>

          </div>
        </div>

        <div class="row" id="name2Row" style="display:none">

          <div class="col-md-3">

            <div id="name2" class="file-name-upload" style="visibility:hidden">
            </div>

          </div>

          <div class="col-md-9">

            <div class="progress" id="status2" style="visibility:hidden">
            </div>

          </div>
        </div>

        <div class="row" id="name3Row" style="display:none">

          <div class="col-md-3 file-name-upload">

            <div id="name3" class="file-name-upload" style="visibility:hidden">
            </div>

          </div>

          <div class="col-md-9">

            <div class="progress" id="status3" style="visibility:hidden">
            </div>

          </div>
        </div>

        
        
      </div>
      <div class="col-md-3">
        <div class="panel panel-default username-display">
          <div class="panel-heading">Lynkgo</div>
          <div class="panel-body">
            <div style="height:150px" class="imgLogin2">Lynkgo publicite</div>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading">Francis Njoh</div>
          <div class="panel-body">
            <div style="height:150px">
              <img width="100%" :src="images.banniere" class="imgLogin2">
              <!-- <carousel :data="data" direction="up">
              </carousel> -->
              
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="row" style="margin: 15% 0 0 0" v-else>
      <div class="col-md-3"></div>
      <div class="col-md-6">


        <h2 style="text-align:center">Connectez vous</h2>
      </div>
      <div class="col-md-4"></div>
      <div>
        <h2 style="text-align:center"></h2>
      </div>
    </div>
  <!-- <div class="row">
    <div class="col-md-2"></div>

    <div class="col-md-5">
      <h5 id="conection_name2" style="color:white;font-size:bold"></h5>
      <br />
    </div>
  </div> -->
</div>
</template>
<!-- <template v-else>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template> -->

<script>
import axios from "axios";
import services from '@services';
import { mapGetters, mapActions } from "vuex";
import bus from "./../bus";
const HOSTSHARE = location.origin.replace(/^http/, "ws");
const wsshare = new WebSocket(HOSTSHARE);
// const ws = new WebSocket(`ws://v-video.herokuapp.com:21279`);

export default {
  name: "HelloWorld",
  data: () => ({
    data: [
          '<div class="example-slide">Slide 1</div>',
          '<div class="example-slide2">Slide 2</div>',
          '<div class="example-slide3"><img width="100%" src="./../assets/static/images/userProfil.jpg" class="imgLogin2"></div>',
        ],
    imagesProfil: {profilImg: require('./../assets/static/images/userProfil.jpg')},
    images: {banniere: require('./../assets/static/images/francis.png')},
    bann: [{
      banniere: require('./../assets/static/images/francis.png'),
    },
    {
      banniere: require('./../assets/static/images/google.png'),
    }
    ],
    remoteusername: "",
    email: "",
    login: false,
    isFiles: false,
    usersArr: [],
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
    currentFile2: [],
    currentFile3: [],
    currentFileMeta: {},
    binary: null,
    nbool: false,
    curUser: "",
    typ: [],
    start: 0,
    end: 0,
    last: false,
    buffer: [],
    nam: [],
    siz: [],
    items: [],
    data: null,
    uploadUrl: 'http://localhost:8081/share',
    uploadHeaders: { 'X-Test-Header': 'vue-file-agent' },
    fileRecordsForUpload: [],
    // notifs: [],
  }),
  created() {
    this.$store.dispatch("wsAction", wsshare);
    const _this = this;
    _this.fetchUser()
    wsshare.onopen = function() {
      console.log("Connected");
    };
    wsshare.onmessage = function(message) {
      console.log("Got message", message.data);
      try{
        var data = JSON.parse(message.data);
        console.log("data data data", data);
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
          case "USERS_LIST": 
            _this.$store.dispatch("users", data.userL);
            if(closeStoreValue === 'closeStoreValue'){

            }
            // _this.usersMo;
            // self.usersArr = data.userL
            // for (var i = 0; i <= data.userL.length; i++) {
            //  self.usersArr[i] = data.userL[i]
            // }
            console.log('data.userL data.userL', data)
           break;
          default:
          break;
        }
      } catch(e) {
        console.log('websocket ws error')
      }
      
    };
    _this.keepServerActive;
    wsshare.onerror = function(err) {
      console.error("Got error observed: ", err);
    };
    wsshare.onclose = function(event) {
      console.log("deconnection", event.data);
    }
  },
  mounted() {
    this.loadresponsive;
    // this.bann();
    // this.getusersConnected();
    this.listenToEvents();
    // this.fetchUser();
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
      "currentFMGetter",
      "usersGetter"
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
    usersMo: function() {

    },
    onLogin: function() {
      const self = this;
      this.nbool = !this.nbool;

          if (self.successGetter === false) {
            alert("Login unsuccessful, please try a different name.");
          } else {
            self.startConnection;
          }
        },
        setupPeerConnection: function() {
          const self = this;
          var webrtcDetectedBrowser = "";
      var configuration = {};
      var connection_peer = {
        optional: []
        // optional: [{ DtlsSrtpKeyAgreement: true }, { RtpDataChannels: true }]
      };
      configuration = webrtcDetectedBrowser === "firefox" ? {
        "iceServers": [
        { "urls": "stun:23.21.150.121"},
        { "url": "stun:127.0.0.1:8081" }
        ]
      }
          : // IP address
          {
            "iceServers": [
            { "urls": "stun:stun.1.google.com:19302" },
            { "url": "stun:127.0.0.1:8081" }
            ]
          };
          const yourConnection = new RTCPeerConnection(configuration, connection_peer)
          self.$store.dispatch("yourConnectionAction", yourConnection);

      // Setup ice handling
      yourConnection.onicecandidate = function(event) {
        self.$store.dispatch("sendAction", { type: 'candidate', candidate: event.candidate });
      }
      // self.yourConnection.ondatachannel = function(ev){
      //   console.log('Data channel ids create!');
      //   ev.channel.onopen = function() {
      //     console.log('Data channel is open and ready to be used.')
      //   }
      // }
      self.openDataChannel(yourConnection);
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
    connectButton(user) {
      console.log('remoteusername remoteusername Lud', user)
      this.remoteusername = user
      const theirusernameInput = user;
      const self = this;
      if (theirusernameInput.length > 0) {
        self.startPeerConnection;
        this.ready = !this.ready
      }
    },
    openDataChannel(yourConnection) {
      console.log('yourConnection yourConnection', yourConnection)
      const self = this;
      var dataChannelOptions = {
        ordered: true,
        reliable: true,
        negotiated: true,
        id: 1
      };
      const dataChannel = yourConnection.createDataChannel("myShare", dataChannelOptions);
      self.$store.dispatch("dataChannelAction", dataChannel);

      dataChannel.onerror = function(error) {
        console.log("Data Channel Error:", error);
      };
      dataChannel.onmessage = function(event) {
        console.log("Got Data Channel Message: ", event.data);
        try {
          var message = JSON.parse(event.data);
          switch (message.mtype) {
            case "notification":
            self.$store.dispatch("notifsTab", data.msge);
            // self.ready = !self.ready
            bus.$emit("refreshnotif");
            break; 
           case "start":
            // self.currentFile = []
            self.currentFileSize = 0;
            self.currentFileMeta = message.data;
            self.ready = true
            self.typ.push(message.data_type);
            self.nam.push(message.data_name);
            self.siz.push(message.data_size);
            if (message.index === 0) {

            // Name span created
            var nameText = document.querySelector('#name'), span;
            var nameRow = document.querySelector('#nameRow')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(message.data_name))
          }
          if (message.index === 1) {

            // Name span created
            var nameText = document.querySelector('#name2'), span;
            var nameRow = document.querySelector('#name2Row')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(message.data_name))
          }
          if (message.index === 2) {

            // Name span created
            var nameText = document.querySelector('#name3'), span;
            var nameRow = document.querySelector('#name3Row')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(message.data_name))
          }
          break;
          case "end":
          if (message.index === 0) {
            self.saveFile({type:self.typ[message.index],name:self.nam[message.index]}, self.currentFile);
          }
          if (message.index === 1) {
            self.saveFile({type:self.typ[message.index],name:self.nam[message.index]}, self.currentFile2);
          }
          if (message.index === 2) {
            self.saveFile({type:self.typ[message.index],name:self.nam[message.index]}, self.currentFile3);
          }
          break;
          case "buffer":

          if(message.index === 0){
            self.currentFile.push(atob(message.arrbuf));
            self.currentFileSize += self.currentFile[self.currentFile.length - 1].length;

            var percentage = Math.floor((self.currentFileSize / self.siz[message.index]) * 100),
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
          }
          if(message.index === 1){
            self.currentFile2.push(atob(message.arrbuf));
            self.currentFileSize += self.currentFile2[self.currentFile2.length - 1].length;

            var percentage = Math.floor((self.currentFileSize / self.siz[message.index]) * 100),
            statusText = document.querySelector('#status2'), div;
            statusText.style.visibility = 'visible'
            div = document.createElement("div")
            div.setAttribute("class","progress-bar")
            div.setAttribute("role","progressbar")
            div.style.width = percentage+'%' 
            div.setAttribute("aria-valuenow", percentage)
            div.setAttribute("aria-valuemin", 0)
            div.setAttribute("aria-valuemax", 100)

            statusText.appendChild(div)
          }
          if(message.index === 2){
            self.currentFile3.push(atob(message.arrbuf));
            self.currentFileSize += self.currentFile3[self.currentFile3.length - 1].length;

            var percentage = Math.floor((self.currentFileSize / self.siz[message.index]) * 100),
            statusText = document.querySelector('#status3'), div;
            statusText.style.visibility = 'visible'
            div = document.createElement("div")
            div.setAttribute("class","progress-bar")
            div.setAttribute("role","progressbar")
            div.style.width = percentage+'%' 
            div.setAttribute("aria-valuenow", percentage)
            div.setAttribute("aria-valuemin", 0)
            div.setAttribute("aria-valuemax", 100)

            statusText.appendChild(div)
          }

          break;
        } 
      } catch (e) {

        console.log('onmessage error catch', e)
      }
    };
    dataChannel.onopen = function() {
      self.dataChannelGetter.send(self.currentUGetter + " has connected.");
    };
    dataChannel.onclose = function() {
      console.log("Data channel has been closed.");
    };
  },
  sendFile(file, index, name) {
    var reader = new FileReader();
    self = this

    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var buffer = reader.result,
        start = 0,
        end = 0,
        last = false;

        function sendChunk() {

          end = start + self.CHUNK_MAX;

          if (end > file.size) {
            end = file.size;
            last = true;
          }
          if(index === 0){
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
              JSON.stringify({mtype:"buffer", index: index, arrbuf: self.arrayBufferToBase64(buffer.slice(start, end))}));
          }

          if(index === 1){
            var percentage = Math.floor((end / file.size) * 100),
            statusText = document.querySelector('#status2'), div;
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
              JSON.stringify({mtype:"buffer", index: index, arrbuf: self.arrayBufferToBase64(buffer.slice(start, end))}));
          }

          if(index === 2){
            var percentage = Math.floor((end / file.size) * 100),
            statusText = document.querySelector('#status3'), div;
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
              JSON.stringify({mtype:"buffer", index: index, arrbuf: self.arrayBufferToBase64(buffer.slice(start, end))}));
          }


        // If this is the last chunk send our end message, otherwise keep sending
        
        if (last) {
          self.dataChannelGetter.send(JSON.stringify({
            mtype: "end",
            index: index
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
  console.log(blob, 'blob blob')
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = meta.name;
  link.click();
  
},
base64ToBlob(b64Data, contentType) {
  contentType = contentType || '';

  var byteArrays = [], byteNumbers, slice;
  console.log('b64Data.length b64Data.length', b64Data.length)
  for (var i = 0; i < b64Data.length; i++) {
    slice = b64Data[i];

    byteNumbers = new Array(slice.length);
    for (var n = 0; n < slice.length; n++) {
      byteNumbers[n] = slice.charCodeAt(n);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
},
uploadFiles() {
  const self = this;
  if (self.fileRecordsForUpload.length > 0) {
        // self.dataChannelGetter.send(
        //   JSON.stringify({ mtype: "notification",
        //     msge: "You are connected with " + this.curUser }));

        // const fi = this.files[0]
        // this.files
        // this.$store.dispatch("files", fi);
        console.log(self.fileRecordsForUpload.length, 'fileRecordsForUpload fileRecordsForUpload')
        for (var i = 0; i < self.fileRecordsForUpload.length; i++) {

          self.dataChannelGetter.send(
            JSON.stringify({
              mtype: "start",
              index: i,
              data: self.fileRecordsForUpload[i].file,
              data_type: self.fileRecordsForUpload[i].file.type,
              data_name: self.fileRecordsForUpload[i].file.name,
              data_size: self.fileRecordsForUpload[i].file.size,
            // data: self.files[0]
          }));

          this.sendFile(self.fileRecordsForUpload[i].file, i, self.fileRecordsForUpload[i].file.name);
          
          if (i===0) {
            // Name span created
            var nameText = document.querySelector('#name'), span;
            var nameRow = document.querySelector('#nameRow')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(self.fileRecordsForUpload[i].file.name))
          }
          if (i===1) {
            // Name span created
            var nameText = document.querySelector('#name2'), span;
            var nameRow = document.querySelector('#name2Row')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(self.fileRecordsForUpload[i].file.name))
          }
          if (i===2) {
            // Name span created
            var nameText = document.querySelector('#name3'), span;
            var nameRow = document.querySelector('#name3Row')
            nameRow.style.display = 'block'
            nameText.style.visibility = 'visible'
            span = document.createElement("span")
            // span.setAttribute("class","file-name")
            nameText.appendChild(document.createTextNode(self.fileRecordsForUpload[i].file.name))
          }
        }
        
        
      } 
    },
    
    

    listenToLogout() {
      const self = this;
      bus.$on("refreshLogoutShare", () => {
        this.$store.dispatch("sendActionLeave", { type: "leave" });
      });
    },
    
    // bann() {
    //   const self = this
    //   console.log('self.bann.length self.bann.length', self.bann.length)
    //   return self.bann
    // },
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
        const current_user = response.data.current_user
        console.log(current_user, ' current_user current_user')
        const nameval = current_user.fullname;
        this.curUser = nameval;
        const email = current_user.email;
        this.email = current_user.email;
        var dataval = {
          fullname: nameval,
          email: email
        };
        this.fetchUsersConnect(dataval);
        this.$store.dispatch("sendCurUser", nameval);
        this.$store.dispatch("email", email);
        const self = this;
        this.$store.dispatch("sendAction", { type: "login", name: nameval });
        this.login = true
        this.getusersConnected(nameval)
      })
      .catch((e) => {console.log(e, 'fetchUser error')});
    },
    async getusersConnected(curUser) {
      const self = this
      // var us = []
      const resp = await services.getusersConnected();
      //  us = resp.users
      // console.log('this.curUser this.curUser', curUser)
      // var filtered  = resp.users.filter(function (user) {
      //   return user != curUser;
      // })
      // this.$store.dispatch("sendAction", { type: "ADD_USER", userL: resp.users });
      self.$store.dispatch("sendUsers", { type: "ADD_USER", userL: resp.users });
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

