<template>
  <div class="login">
    &nbsp;
    <v-layout row wrap>
      <v-flex xs3 md2></v-flex>
      <v-flex xs12 sm12 md8>
        <v-card
        style="margin: 3% 1% 0 1%;background-color: #f5f5f5">
        <v-card-title primary-title>
          <v-layout row wrap>
            <v-flex class="divMobil" xs6>
                <span style="color:#4ae387;font-size: 70%">
                  Recover password?
                </span>
              </v-flex>
            <v-flex class="divDesk" md6 xs6>
              <span class="headline">Login</span>
            </v-flex>
            <v-flex md5 xs5 class="divMobil">
              <router-link v-bind:to="{ name: 'Register' }" class="side_bar_link">
                <span style="font-size: 70%;">
                  Create New Account
                </span>
              </router-link>
            </v-flex>
            <v-flex md1 xs1></v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
         <v-flex md8 xs12>
          <div class="divDesk" style="position: absolute;left:65%">Or</div>
          <p class="divMobil" style="font-size:120%;font-weight:bold">
            Login By our website
          </p>
          <p class="divDesk" style="font-size:120%;font-weight:bold">
            By our website
          </p>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
            outlined
            class="v-textfield"
            dense
            prepend-inner-icon="mdi-email"
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
            ></v-text-field>
            <v-text-field
            outlined
            class="v-textfield"
            dense
            prepend-inner-icon="mdi-lock"
            label="Password"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show1 ? 'text' : 'password'"
            name="pass-10-1"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
            required
            ></v-text-field>
            <btn
            label="Sign In"
            :disabled="!valid"
            style="background-color:#0000ff21;margin:0px 2% 0px 0px"
            :loading="loading"
            @click="login"
            />
            <btn
            label="clear"
            style="background-color:#0000ff21;margin:0px 0px 0px 2%"
            @click="clear"
            />
            <v-layout style="margin:4% 0px 0px 0px" row wrap>
              <v-flex md1 xs1></v-flex>
              <!-- <v-flex md5 xs5>
                <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You must agree to continue!']"
                label="Keep me logged in"
                required
                ></v-checkbox>
              </v-flex> -->
              <v-flex class="divDesk" md5 xs7 style="margin: 4% 0px 0px 0px">
                <span style="color:#4ae387;font-size: 120%">
                  Recover password?
                </span>
              </v-flex>
              <v-flex md1 xs1></v-flex>
            </v-layout>
          </v-form>
        </v-flex>
        <v-flex md4 xs12>
          <p class="divMobil" style="font-size:120%;font-weight:bold;">Or By OAuth
    </p>
        <p class="divDesk" style="font-size:120%;font-weight:bold;"> By OAuth
    </p>
          <div class="timeline">
            <div
            v-for="(item, i) in events"
            v-bind:key="i"
            class="timeline-item right"
            >
            <div class="login">
              <v-layout row wrap>
                <v-flex md11 xs12>
                  <span v-if="item.faceb">
                <a class="btn facebook oauthItems" href="/login/facebook"> 
                <img :src="images.facebookIcon" class="imgLogin"> 
              {{ item.faceb }}</a>
            </span>
                </v-flex>
                <v-flex md11 xs12>
                  <span v-if="item.google">
                <a class="btn google oauthItems" href="/login/google"> 
                <img :src="images.googleIcon" class="imgLogin"> 
                {{ item.google }}
              </a>
              </span>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </div>
        <v-flex class="divDesk">
              <router-link v-bind:to="{ name: 'Register' }" class="side_bar_link">
                <p style="font-size: 120%;margin: 35% 0 0 0">
                  Create New Account
                </p>
              </router-link>
            </v-flex>
      </v-flex>
  </v-layout>
    </v-card-text>
  </v-card>
</v-flex>
</v-layout>
</div>
</template>

<script>
import services from '@services';
import bus from '../bus';
const timelineData = [ 
{datetime: '', faceb: 'Login with facebook' },
{datetime: '', google: 'Login with google' },
];
export default {
  data: () => ({
    images: {
      facebookIcon: require('./../assets/static/images/facebook1.png'),
      googleIcon: require('./../assets/static/images/google.png'),
    },
    events: timelineData,
    show1: false,
    valid: true,
    loading: false,
    email: '',
    password: '',
    passwordRules: [
    v => !!v || 'Password is required',
    v => v.length >= 8 || 'Min 8 characters',],
    emailRules: [
    v => !!v || 'E-mail is required',
    v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid',
    ],
    ws_var: '',
  }),
  methods: {
    async connectedUser(email) {
      var dataToConnection = {
          email: email,
          connected: true
        };
        const resp = await services.updateConnected(dataToConnection);
    },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const email = this.email
          const password = this.password
          const dataToSend = {
            email,
            password
          };
          // const resp = await services.getUsersConnect(this.email);
          // if (resp.userConnect !== 'no user') {
          //   this.$swal('Oh oo!', `The user who have this ${email} is already logged`, 'error');
          //   this.$router.push({ name: 'Login' });
          // } else {
            await services.login(dataToSend);
              this.connectedUser(email)
            bus.$emit('refreshUser');
            // this.$router.push({ name: 'Video' });
            // return document.location.href = '/video' // is use for reloading Page
            return document.location.href = '/share' // is use for reloading Page
          // }
          
        } catch (error) {
          console.log(error.response.data.message);
          this.$swal('Oh oo!', ' an error try later');
          this.$router.push({ name: 'Login' });
        }
        this.loading = true;
      }
      return true;
    },
    clear() {
      this.$refs.form.reset();
      this.loading = false;
    },
  },
};

</script>
