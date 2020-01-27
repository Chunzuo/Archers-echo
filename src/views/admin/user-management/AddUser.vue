<template>
  <div class="mb-2">
    <vs-button @click="activePrompt = true" icon="add">Add user</vs-button>

    <vs-prompt
      vs-title="Add User"
      vs-accept-text="Add User"
      vs-button-cancel="border"
      @vs-cancel="clearFields"
      @vs-accept="submit"
      @vs-close="clearFields"
      :vs-is-valid="validateForm"
      :vs-active.sync="activePrompt"
    >
      <div>
        <form>
          <div class="vx-row">
            <div class="vx-col w-full">
              <vs-input
                v-validate="'required|email'"
                data-vv-validate-on="blur"
                name="email"
                type="email"
                label-placeholder="Email"
                v-model="email"
                class="w-full mt-6"
              />
              <span class="text-danger text-sm">{{ errors.first('email') }}</span>
              <vs-input
                v-validate="'required'"
                data-vv-validate-on="blur"
                name="userName"
                label-placeholder="User Name"
                v-model="userName"
                class="w-full mt-6"
              />
              <span class="text-danger text-sm">{{errors.first('userName')}}</span>
              <vs-input
                v-validate="'required'"
                data-vv-validate-on="blur"
                name="companyName"
                label-placeholder="Company Name"
                v-model="companyName"
                class="w-full mt-6"
              />
              <span class="text-danger text-sm">{{errors.first('companyName')}}</span>
              <vs-input
                v-validate="'required|min:6|max:10'"
                data-vv-validate-on="blur"
                class="w-full mb-4 mt-5"
                placeholder="Password"
                v-model="password"
                type="password"
                name="password"
                ref="password"
              />
              <span class="text-danger text-sm">{{errors.first('password')}}</span>
              <vs-input
                type="password"
                v-validate="'min:6|max:10|confirmed:password'"
                data-vv-validate-on="blur"
                data-vv-as="password"
                label-placeholder="Confirm Password"
                class="w-full mt-6"
                v-model="confirm_password"
                name="confirm_password"
              />
              <span class="text-danger text-sm">{{errors.first("confirm_password")}}</span>
            </div>
          </div>
        </form>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import userApi from "@/api/user";

export default {
  data() {
    return {
      activePrompt: false,

      email: "",
      password: "",
      userName: "",
      companyName: "",
      confirm_password: ""
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.email != "" &&
        this.password != "" &&
        this.userName != "" &&
        this.companyName != ""
      );
    }
  },
  methods: {
    clearFields() {
      this.email = "";
      this.password = "";
      this.userName = "";
      this.companyName = "";
      this.confirm_password = "";
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.addUser();
      });
    },
    async addUser() {
      try {
        await userApi.addUser({
          email: this.email,
          password: this.password,
          userName: this.userName,
          companyName: this.companyName
        });
        this.$vs.notify({
          title: "Success",
          text: "Success in update user status",
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

      this.clearFields();
      this.$emit("getUserList");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>