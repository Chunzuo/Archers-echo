<template>
  <div class="mb-2">
    <vs-button @click="activePrompt = true" icon="add">Add rule</vs-button>

    <vs-prompt
      vs-title="Add Rule"
      vs-accept-text="Add Rule"
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
                v-validate="'required'"
                data-vv-validate-on="blur"
                label-placeholder="Name"
                placeholder="Name"
                v-model="name"
                class="w-full"
              ></vs-input>
            </div>
          </div>
        </form>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import ruleApi from "@/api/rule";

export default {
  data() {
    return {
      name: "",
      activePrompt: false
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.name != "";
    }
  },
  methods: {
    clearFields() {
      this.name = "";
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.addRule();
      });
    },
    async addRule() {
      try {
        await ruleApi.add({ name: this.name });
        this.$vs.notify({
          title: "Success",
          text: "Success in add rule",
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
      this.$emit("getRuleList");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>