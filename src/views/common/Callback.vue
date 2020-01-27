<template>
  <div></div>
</template>

<script>
import { saveToStorage } from "@/utils";
export default {
  methods: {
    handleLoginEvent(data) {
      saveToStorage("user", { id: data.profile.sub.split("|")[1] });
      this.$router.push(data.state.target || "/");
    }
  },
  created() {
    this.$auth.handleAuthentication();
  }
};
</script>

<style lang="scss" scoped>
</style>