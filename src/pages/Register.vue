<template>
  <div class="login">
    &nbsp;
    <v-layout row wrap>
      <v-flex xs3></v-flex>
      <v-flex xs12 sm8 md6>
        <v-card
        style="margin: 3% 1% 0 1%;background-color: #f5f5f5">
        <v-card-title primary-title>
          <v-layout row wrap>
              <v-flex md5 xs5>
                <span class="headline">Register</span>
              </v-flex>
              <v-flex md1 xs1></v-flex>
              <v-flex md5 xs5>
                <router-link v-bind:to="{ name: 'Login' }" class="side_bar_link">
                  <span style="font-size: 90%">
                    Login
                  </span>
                </router-link>
              </v-flex>
              <v-flex md1 xs1></v-flex>
            </v-layout>
        </v-card-title>
        <h6 class="card-title" v-if="current_user" @click="rate">Rate this movie</h6>
        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
            outlined
            dense
            label="Pseudo*"
            v-model="pseudo"
            required
            ></v-text-field>
            <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-account-circle"
            label="Full Name*"
            v-model="fullname"
            required
            ></v-text-field>
            <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-email"
            label="Email*"
            v-model="email"
            :rules="emailRules"
            required
            ></v-text-field>
            <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-lock"
            label="Password*"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show1 ? 'text' : 'password'"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
            required
            ></v-text-field>
            <!-- <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-lock"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            label="Confirm Password"
            v-model="confirm_password"
            @click:append="show2 = !show2"
            required
            ></v-text-field> -->
            <btn
            label="Sign Up"
            :disabled="!valid"
            style="background-color:#0000ff21;margin:0 2% 0 0"
            :loading="loading"
            @click="signup"
            />
            <btn
            label="clear"
            style="background-color:#0000ff21;margin:0 0 0 2%"
            @click="clear"
            />
            <v-layout style="margin:4% 0px 0px 0px" row wrap>
              <v-flex md1 xs1></v-flex>
              <v-flex md5 xs5>
                <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || 'You must agree to continue!']"
          label="I agree to Terms of Use."
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
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import services from '@services';

export default {
  data: () => ({
    valid: true,
    show1: false,
    show2: false,
    loading: false,
    pseudo: '',
    fullname: '',
    email: '',
    password: '',
    erreur: '',
    confirm_password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Min 8 characters',],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid',
    ],
  }),
  methods: {
    async signup() {
      if (this.$refs.form.validate()) {
        try {
          const dataToSend = {
            fullname: this.fullname,
            pseudo: this.pseudo,
            email: this.email,
            password: this.password,
          };
          const response = await services.signup(dataToSend);
          this.$swal(
            `Great! ${response.user.fullname}`,
            'Your account are created successfully!',
            'success',
          );
          // return document.location.href = '/login'
          this.$router.push({ name: 'Login' });
        } catch (error) {
          const message = error.response.data.message;
          this.$swal('Oh oo!', `${message}`, 'error');
        }
        // this.loading = true;
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
