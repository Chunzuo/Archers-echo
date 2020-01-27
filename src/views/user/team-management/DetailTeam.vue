<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card title="Team Detail information" id="div-loading" class="vs-con-loading__container">
      <div v-if="team">
        <div>
          <span>Team Name:</span>
          <span class="ml-4 font-semibold">{{team.name}}</span>
        </div>
        <div>
          <span>Created at:</span>
          <span class="ml-4 font-semibold">{{team.createdAt.split("T")[0]}}</span>
        </div>
        <div>
          <span>Owner:</span>
          <span class="ml-4 font-semibold">{{team.owner.userName}}</span>
        </div>

        <vs-divider>Team members status</vs-divider>

        <vs-table :data="team.members">
          <template slot="thead">
            <vs-th>User Name</vs-th>
            <vs-th>Email</vs-th>
            <vs-th>Status</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="index" v-for="(tr, index) in data">
              <vs-td>{{tr.id.userName}}</vs-td>
              <vs-td>{{tr.id.email}}</vs-td>
              <vs-td>
                <vs-chip :color="getStatusColor(tr.status)">{{getStatusLabel(tr.status)}}</vs-chip>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "@/api/team";

export default {
  data() {
    return {
      members: ["user1"],
      teamId: this.$route.params.id,
      team: null
    };
  },
  mounted() {
    this.getTeamInfo();
  },
  methods: {
    async getTeamInfo() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        this.team = await teamApi.getTeamInfo(this.teamId);
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feather",
          icon: "icon-circle-alert",
          color: "danger"
        });
      }
      console.log(this.team);
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    },
    getStatusLabel(status) {
      if (status === 0) {
        return "Pending";
      } else if (status === 1) {
        return "Accepted";
      }
      return "Rejected";
    },
    getStatusColor(status) {
      if (status === 0) {
        return "primary";
      } else if (status === 1) {
        return "success";
      }
      return "danger";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>