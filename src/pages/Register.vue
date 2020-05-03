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
            <div class="headline">S'inscrire</div>
          </div>
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
            name="pass-10-1"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
            required
            ></v-text-field>
            <v-text-field
            outlined
            dense
            prepend-inner-icon="mdi-lock"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            name="input-7-1"
            label="Confirm Password"
            v-model="confirm_password"
            @click:append="show2 = !show2"
            required
            ></v-text-field>
            <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>
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
