<template>
  <vs-prompt
    vs-title="Update Archer"
    vs-accept-text="Update Archer"
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
              v-validate="'required'"
              name="title"
              class="w-full mb-4 mt-5"
              placeholder="Name"
              v-model="archer.name"
              :color="validateForm ? 'success' : 'danger'"
            />
            <vs-textarea rows="5" label="Add description" v-model="archer.description"/>
          </div>
        </div>
      </form>
    </div>
  </vs-prompt>
</template>

<script>
import archerApi from "@/api/archer";
export default {
  props: ["displayPrompt", "archer"],
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
        this.archer.name != "" &&
        this.archer.description != ""
      );
    }
  },
  data() {
    return {
      data: null
    };
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.updateArcher();
      });
    },
    async updateArcher() {
      try {
        await archerApi.updateArcher(this.archer);
        this.$vs.notify({
          title: "Success",
          text: "Success in update archer",
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
      const userId = JSON.parse(localStorage.getItem("userInfo")).id;
      this.$store.dispatch("archer/getArcherList", userId);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>