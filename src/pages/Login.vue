<template>
  <div class="login">
    &nbsp;
    <v-layout row wrap>
      <v-flex xs3></v-flex>
      <v-flex xs12 sm8 md6>
        <v-card
        style="margin: 0 1% 0 1%">
        <v-card-title primary-title>
          <div>
            <div class="headline">Se connecter</div>
          </div>
        </v-card-title>
        <!-- <h6 class="card-title" v-if="current_user" @click="rate">Rate this movie</h6> -->
        <v-card-text>
          <div class="login">
            <a class="btn facebook oauthItems" href="/login/facebook"> 
              <img :src="images.facebookIcon" class="imgLogin"> 
            Login with facebook</a>
            <a class="btn google" href="/login/google"> 
              <img :src="images.googleIcon" class="imgLogin"> 
              Login with google
            </a>
          </div>
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
              <v-flex md5 xs5>
                <router-link v-bind:to="{ name: 'Register' }" class="side_bar_link">
                  <span>
                    Sign up
                  </span>
                </router-link>

              </v-flex>
              <v-flex md1 xs1></v-flex>
              <v-flex md5 xs5>
                <span>
                  forgot password?
                </span>
              </v-flex>
              <v-flex md1 xs1></v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import services from '@services';
import bus from '../bus';

export default {
  data: () => ({
    images: {
      facebookIcon: require('./../assets/static/images/facebook1.png'),
      googleIcon: require('./../assets/static/images/google.png'),
    },
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
  mounted() {
    this.loadresponsive();
  },
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
            this.$router.push({ name: 'Video' });
          }
          
        } catch (error) {
          console.log(error.response.data.message);
        }
        this.loading = true;
      }
      return true;
    },
    loadresponsive() {
      return this.$router.go()
    },
    clear() {
      this.$refs.form.reset();
      this.loading = false;
    },
  },
};

</script>
