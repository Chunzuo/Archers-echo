<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vs-con-loading__container" id="div-loading">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/register.jpg" alt="register" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title">
                  <h4 class="mb-4">Create Account</h4>
                  <p>Fill the below form to create a new account.</p>
                </div>
                <div class="clearfix">
                  <vs-input
                    v-validate="'required|alpha_dash|min:3'"
                    data-vv-validate-on="blur"
                    label-placeholder="Username"
                    name="username"
                    placeholder="Username"
                    v-model="username"
                    class="w-full"
                  />
                  <span class="text-danger text-sm">{{ errors.first('username') }}</span>

                  <vs-input
                    v-validate="'required'"
                    data-vv-validate-on="blur"
                    label-placeholder="CompanyName"
                    name="companyName"
                    v-model="companyName"
                    class="w-full"
                  />
                  <span class="text-danger text-sm">{{ errors.first('companyName') }}</span>

                  <vs-input
                    v-validate="'required|email'"
                    data-vv-validate-on="blur"
                    name="email"
                    type="email"
                    label-placeholder="Email"
                    placeholder="Email"
                    v-model="email"
                    class="w-full mt-6"
                  />
                  <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                  <vs-input
                    ref="password"
                    type="password"
                    data-vv-validate-on="blur"
                    v-validate="'required|min:6|max:10'"
                    name="password"
                    label-placeholder="Password"
                    placeholder="Password"
                    v-model="password"
                    class="w-full mt-6"
                  />
                  <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                  <vs-input
                    type="password"
                    v-validate="'min:6|max:10|confirmed:password'"
                    data-vv-validate-on="blur"
                    data-vv-as="password"
                    name="confirm_password"
                    label-placeholder="Confirm Password"
                    placeholder="Confirm Password"
                    v-model="confirm_password"
                    class="w-full mt-6"
                  />
                  <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>

                  <vs-checkbox
                    v-model="acceptRules"
                    class="mt-6"
                    v-for="(rule, index) in rules"
                    :key="index"
                    :vs-value="index"
                  >{{rule.name}}</vs-checkbox>
                  <vs-button type="border" to="/login" class="mt-6">Login</vs-button>
                  <vs-button
                    class="float-right mt-6"
                    @click="registerUser"
                    :disabled="!validateForm"
                  >Register</vs-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase/app";
// import authApi from "@/api/auth";
import ruleApi from "@/api/rule";
import userApi from "@/api/user";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      isTermsConditionAccepted: false,
      rules: [],
      acceptRules: [],
      companyName: ""
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.username != "" &&
        this.email != "" &&
        this.password != "" &&
        this.confirm_password != "" &&
        this.rules.length === this.acceptRules.length &&
        this.companyName != ""
      );
    }
  },
  methods: {
    registerUser() {
      if (!this.validateForm) return false;
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return;
      }

      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });

      userApi
        .addUser({
          email: this.email,
          password: this.password,
          userName: this.username,
          companyName: this.companyName
        })
        .then(
          () => {
            this.$vs.notify({
              title: "Account Created",
              text: "You are successfully registered!",
              iconPack: "feather",
              icon: "icon-check",
              color: "success"
            });
            this.username = "";
            this.email = "";
            this.password = "";
            this.confirm_password = "";
            this.companyName = "";
            this.$vs.loading.close("#div-loading > .con-vs-loading");
          },
          error => {
            this.$vs.notify({
              title: "Error",
              text: error.message,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "danger"
            });
            this.$vs.loading.close("#div-loading > .con-vs-loading");
          }
        );

      // create user using firebase
      // firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(this.email, this.password)
      //   .then(
      //     () => {
      //       authApi
      //         .signUp({
      //           email: this.email,
      //           userName: this.username,
      //           companyName: this.companyName
      //         })
      //         .then(
      //           response => {
      //             console.log(response);
      //             this.$vs.notify({
      //               title: "Account Created",
      //               text: "You are successfully registered!",
      //               iconPack: "feather",
      //               icon: "icon-check",
      //               color: "success"
      //             });
      //             this.$vs.loading.close("#div-loading > .con-vs-loading");
      //             this.username = "";
      //             this.email = "";
      //             this.password = "";
      //             this.confirm_password = "";
      //             this.companyName = "";
      //           },
      //           error => {
      //             this.$vs.notify({
      //               title: "Error",
      //               text: error.message,
      //               iconPack: "feather",
      //               icon: "icon-alert-circle",
      //               color: "danger"
      //             });
      //             this.$vs.loading.close("#div-loading > .con-vs-loading");
      //           }
      //         );
      //     },
      //     error => {
      //       this.$vs.notify({
      //         title: "Error",
      //         text: error.message,
      //         iconPack: "feather",
      //         icon: "icon-alert-circle",
      //         color: "danger"
      //       });
      //       this.$vs.loading.close("#div-loading > .con-vs-loading");
      //     }
      //   );
    },
    notifyAlreadyLogedIn() {
      this.$vs.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
    },
    async getRuleList() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      try {
        this.rules = await ruleApi.list();
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      }
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    }
  },
  mounted() {
    this.getRuleList();
  }
};
</script>
