<template>
  <div class="login">
    &nbsp;
    <v-layout row wrap>
      <v-flex xs3 md3></v-flex>
      <v-flex xs12 sm8 md8>
        <v-card
        style="margin: 3% 1% 0 1%;background-color: #f5f5f5">
        <v-card-title primary-title>
          <v-layout row wrap>
            <v-flex md5 xs5>
              <span class="headline">Login</span>
            </v-flex>
            <v-flex md1 xs1></v-flex>
            <v-flex md5 xs5 class="divHS">
              <router-link v-bind:to="{ name: 'Register' }" class="side_bar_link">
                <span style="font-size: 90%">
                  Create New Account
                </span>
              </router-link>
            </v-flex>
            <v-flex md1 xs1></v-flex>
          </v-layout>
        </v-card-title>
        <!-- <h6 class="card-title" v-if="current_user" @click="rate">Rate this movie</h6> -->
        <v-card-text>
          <v-layout row wrap>
         <v-flex md8 xs12>
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
              <v-flex md5 xs5>
                <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You must agree to continue!']"
                label="Keep me logged in"
                required
                ></v-checkbox>
              </v-flex>
              <v-flex md5 xs5 style="margin: 4% 0px 0px 0px">
                <span style="color:#4ae387;font-size: 120%">
                  Recover password?
                </span>
              </v-flex>
              <v-flex md1 xs1></v-flex>
            </v-layout>
          </v-form>
        </v-flex>
        <v-flex md4 xs12>
          <div class="timeline">
            <div
            v-for="(item, i) in events"
            v-bind:key="i"
            class="timeline-item right"
            >
            <div class="login">
              <span v-if="item.faceb">
                <a class="btn facebook oauthItems" href="/login/facebook"> 
                <img :src="images.facebookIcon" class="imgLogin"> 
              {{ item.faceb }}</a>
            </span>
              <span v-if="item.google">
                <a class="btn google" href="/login/google"> 
                <img :src="images.googleIcon" class="imgLogin"> 
                {{ item.google }}
              </a>
              </span>
              
            </div>
          </div>
        </div>
        <v-flex class="divHS">
              <router-link v-bind:to="{ name: 'Register' }" class="side_bar_link">
                <span style="font-size: 90%">
                  Create New Account
                </span>
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
  // mounted() {
  //   // this.loaddesktop();
  //   this.loadresponsive();
  // },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const email = this.email
          const password = this.password
          const dataToSend = {
            email,
            password
          };
          const resp = await services.getUsersConnect(this.email);
          if (resp.userConnect !== 'no user') {
            this.$swal('Oh oo!', `The user who have this ${email} is already logged`, 'error');
            this.$router.push({ name: 'Login' });
          } else {
            await services.login(dataToSend);
            bus.$emit('refreshUser');
            // this.$router.push({ name: 'Video' });
            return document.location.href = '/video' // is use for reloading Page
          }
          
        } catch (error) {
          console.log(error.response.data.message);
        }
        this.loading = true;
      }
      return true;
    },
    // loadresponsive() {
    //   return this.$router.go(1)
    // },
    // loaddesktop() {
    //   return document.location.href = '/login'
    // },
    clear() {
      this.$refs.form.reset();
      this.loading = false;
    },
  },
};

</script>
