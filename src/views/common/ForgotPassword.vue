<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vs-con-loading__container" id="div-loading">
    <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Recover your password</h4>
                  <p>Please enter your email address and we'll send you instructions on how to reset your password.</p>
                </div>

                <vs-input
                  type="email"
                  label-placeholder="Email"
                  v-model="email"
                  class="w-full mb-8"
                />
                <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">Back To Login</vs-button>
                <vs-button
                  class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                  @click="send"
                >Recover Password</vs-button>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    async send() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await userApi.sendPasswordResetEmail({ email: this.email });
        this.$vs.notify({
          title: "Success",
          text: "You will receive a password reset mail.",
          iconPack: "feather",
          icon: "icon-check",
          color: "success"
        });
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
      this.email = "";
    }
  }
};
</script>
