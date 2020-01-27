<template>
  <vs-prompt
    vs-title="Edit Rule"
    vs-accept-text="Update"
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
          <vs-col>
            <vs-input
              v-validate="'required'"
              data-vv-validate-on="blur"
              label-placeholder="Name"
              placeholder="Name"
              v-model="name"
              class="w-full"
            ></vs-input>
          </vs-col>
        </div>
      </form>
    </div>
  </vs-prompt>
</template>

<script>
import ruleApi from "@/api/rule";

export default {
  props: {
    displayPrompt: { type: Boolean, required: true },
    data: { type: Object, required: true }
  },
  data() {
    return {
      name: this.data.name
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.name != "";
    },
    activePrompt: {
      get() {
        return this.displayPrompt;
      },
      set() {
        this.$emit("hideEditPrompt");
      }
    }
  },
  mounted() {},
  methods: {
    clearFields() {
      this.name = "";
      this.$emit("updateRuleList");
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.updateRule();
      });
    },
    async updateRule() {
      this.$emit("showLoading");
      try {
        await ruleApi.update(this.data._id, { name: this.name });
        this.$vs.notify({
          color: "success",
          title: "Success",
          text: "Success in update rule",
          iconPack: "feather",
          icon: "icon-check"
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
      this.$store.dispatch("rule/getRuleList");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>