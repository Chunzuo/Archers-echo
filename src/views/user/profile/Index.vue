<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <div class="vx-col w-full lg:w-1/2 vs-con-loading__container" id="div-loading">
      <vx-card title="Profile">
        <div class="vx-row">
          <div class="vx-col w-full">
            <vs-input
              class="mt-6 w-full"
              v-validate="'required|email'"
              data-vv-validate-on="blur"
              name="email"
              label-placeholder="Email"
              v-model="user.email"
            ></vs-input>
            <span class="text-danger text-sm">{{errors.first('email')}}</span>
            <vs-input
              class="mt-6 w-full"
              v-validate="'required'"
              data-vv-validate-on="blur"
              label-placeholder="User Name"
              v-model="user.userName"
              name="userName"
            ></vs-input>
            <span class="text-danger text-sm">{{errors.first('userName')}}</span>
            <vs-input
              class="mt-6 w-full"
              v-validate="'required'"
              data-vv-validate-on="blur"
              label-placeholder="Company Name"
              v-model="user.companyName"
              name="companyName"
            ></vs-input>
            <span class="text-danger text-sm">{{errors.first('companyName')}}</span>
            <vs-checkbox class="mt-6" v-model="updatePwd">Update password</vs-checkbox>
            <div v-if="updatePwd">
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
            </div>
          </div>

          <vs-col
            class="mt-6"
            vs-offset="8"
            vs-type="flex"
            vs-justify="center"
            vs-align="center"
            vs-w="4"
          >
            <vs-button @click="updateDetail">Save</vs-button>
          </vs-col>
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
      user: {},
      updatePwd: false,
      password: "",
      confirm_password: ""
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    async updateDetail() {
      this.$vs.loading({ container: "#div-loading" });
      if (this.updatePwd) {
        this.user["password"] = this.password;
      }
      try {
        await userApi.updateProfile(this.user);
        this.$store.commit("auth/UPDATE_USERNAME", this.user.userName);
        localStorage.setItem("userName", this.user.userName);
        this.$vs.notify({
          title: "Success",
          text: "Success in update profile",
          iconPack: "feather",
          icon: "icon-check",
          color: "success"
        });
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          message: error.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      }
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    },
    async getProfile() {
      this.$vs.loading({ container: "#div-loading" });
      this.user = await userApi.getById(
        JSON.parse(localStorage.getItem("userInfo")).id
      );
      console.log(this.user);
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>