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
            <v-layout class="login" row wrap>
            <v-flex xs12 sm12 md6>
              <a class="btn facebook" href="/login/facebook"> 
                <img :src="images.facebookIcon" class="imgLogin"> 
                 Login with facebook
             </a>
          </v-flex>
          <v-flex xs12 sm12 md6>
              <a class="btn google" href="/login/google"> 
              <img :src="images.googleIcon" class="imgLogin"> 
            Login with google
           </a>
          </v-flex>
        </v-layout>
          <v-form v-model="valid" ref="form" lazy-validation>
            <Input
            label="Email"
            :vmodel="email"
            :rules="emailRules"
            />
            <Input
            label="Password"
            :vmodel="password"
            :rules="passwordRules"
            />
            <btn
            label="Sign In"
            :disabled="!valid"
            style="background-color:#0000ff21;margin:0 2% 0 0"
            :loading="loading"
            @click="login"
            />
            <btn
            label="clear"
            style="background-color:#0000ff21;margin:0 0 0 2%"
            @click="clear"
            />
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
    valid: true,
    loading: false,
    email: '',
    password: '',
    passwordRules: [v => !!v || 'Password is required'],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid',
    ],
    ws_var: '',
  }),
  created() {
    // Fetch initial data.
    this.login();
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
clear() {
  this.$refs.form.reset();
  this.loading = false;
},
},
};

</script>
