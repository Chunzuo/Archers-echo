<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card title="Add team">
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            v-validate="'required'"
            class="mb-4 mt-5"
            placeholder="Name"
            v-model="name"
            :color="name != '' ? 'success' : 'danger'"
          />

          <vs-chips color="rgb(145, 32, 159)" placeholder="Team members" v-model="members">
            <vs-chip :key="idx" @click="remove(member)" v-for="(member, idx) in members" closable>
              <vs-avatar/>
              {{ member }}
            </vs-chip>
          </vs-chips>
        </div>
        <vs-col class="mt-4">
          <vs-button icon="add" @click="addTeam" :disabled="!validateForm">Add</vs-button>
        </vs-col>
        <vs-col class="mt-4"></vs-col>
      </div>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "@/api/team";
import Multiselect from "vue-multiselect";

export default {
  data() {
    return {
      members: [],
      name: "",
      selectedMembers: [],
      isLoading: false,
      value: null,
      query: ""
    };
  },
  computed: {
    validateForm() {
      return this.name != "" && this.members.length > 0;
    },
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  methods: {
    remove(item) {
      this.members.splice(this.members.indexOf(item), 1);
    },
    async addTeam() {
      this.$vs.loading({
        container: "#div-loading"
      });
      try {
        await teamApi.addTeam({
          name: this.name,
          members: this.members,
          userId: this.userId
        });
        this.$vs.notify({
          color: "success",
          title: "Success",
          text: "Success in add team"
        });
        this.clearForm();
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
    },
    clearForm() {
      this.name = "";
      this.members = [];
    }
  },
  components: {
    Multiselect
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
</style>