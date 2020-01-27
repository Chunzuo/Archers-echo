<template>
  <vs-prompt
    vs-title="Update user"
    vs-accept-text="Update User"
    vs-button-cancel="border"
    @vs-accept="submit"
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
              v-model="user.email"
              class="w-full mt-6"
            />
            <span class="text-danger text-sm">{{ errors.first('email') }}</span>
            <vs-input
              v-validate="'required'"
              data-vv-validate-on="blur"
              name="userName"
              label-placeholder="User Name"
              v-model="user.userName"
              class="w-full mt-6"
            />
            <span class="text-danger text-sm">{{errors.first('userName')}}</span>
            <vs-input
              v-validate="'required'"
              data-vv-validate-on="blur"
              name="companyName"
              label-placeholder="Company Name"
              v-model="user.companyName"
              class="w-full mt-6"
            />
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
        </div>
      </form>
    </div>
  </vs-prompt>
</template>

<script>
import userApi from "@/api/user";
export default {
  props: ["displayPrompt", "user"],
  computed: {
    activePrompt: {
      get() {
        return this.displayPrompt;
      },
      set() {
        this.$emit("hideEditDialog");
      }
    },
    validateForm() {
      return (
        !this.errors.any() &&
        this.user.email != "" &&
        this.user.userName != "" &&
        this.user.companyName != ""
      );
    }
  },
  mounted() {
    console.log(this.user);
  },
  data() {
    return {
      updatePwd: false,
      password: "",
      confirm_password: ""
    };
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.updateUser();
      });
    },
    async updateUser() {
      if (this.updatePwd) this.user["password"] = this.password;
      try {
        await userApi.updateProfile(this.user);
        this.$vs.notify({
          title: "Success",
          text: "Success in update user profile",
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>