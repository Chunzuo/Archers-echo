<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card title="Edit Team">
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            v-validate="'required'"
            class="mb-4 mt-5"
            placeholder="Name"
            v-model="name"
            :color="name != '' ? 'success' : 'danger'"
          />

          <!-- <vs-chips color="rgb(145, 32, 159)" placeholder="Team members" v-model="members">
            <vs-chip :key="idx" @click="remove(member)" v-for="(member, idx) in members" closable>
              <vs-avatar/>
              {{ member }}
            </vs-chip>
          </vs-chips>-->
          <div class="vx-row">
            <div class="vx-col">
              <vs-input
                class="mt-4"
                v-validate="'required|email'"
                data-vv-validate-on="blur"
                name="memberEmail"
                label-placeholder="Input new member email"
                v-model="newMemberEmail"
              ></vs-input>
              <span class="text-danger text-sm">{{errors.first('memberEmail')}}</span>
            </div>
            <div class="vx-col">
              <vs-button type="border" class="mt-4 mb-4" @click="addMember" icon="add">Add member</vs-button>
            </div>
          </div>

          <vs-table :data="members">
            <template slot="thead">
              <vs-th>User Name</vs-th>
              <vs-th>Email</vs-th>
              <vs-th>Status</vs-th>
              <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr v-for="(tr, index) in data" :key="index">
                <vs-td>{{tr.id.userName}}</vs-td>
                <vs-td>{{tr.id.email}}</vs-td>
                <vs-td>
                  <vs-chip :color="getStatusColor(tr.status)">{{getStatusLabel(tr.status)}}</vs-chip>
                </vs-td>
                <vs-td>
                  <vs-button
                    color="danger"
                    type="filled"
                    radius
                    icon-pack="feather"
                    icon="icon-x"
                    @click="confirmDialog(tr._id)"
                  ></vs-button>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
        <vs-col class="mt-4">
          <vs-button icon="edit" @click="update" :disabled="!validateForm">save</vs-button>
        </vs-col>
      </div>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "@/api/team";

export default {
  data() {
    return {
      name: "",
      members: [],
      id: this.$route.params.id,
      newMemberEmail: "",
      memberIdToDelete: null
    };
  },
  mounted() {
    this.getTeamInfo();
  },
  methods: {
    async getTeamInfo() {
      this.$vs.loading({ container: "#div-loading" });
      this.members = [];
      try {
        const response = await teamApi.getTeamInfo(this.id);
        console.log(response);
        this.name = response.name;
        this.members = response.members;
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
    async update() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await teamApi.updateTeam({
          id: this.id,
          name: this.name
        });
        this.$vs.notify({
          title: "Success",
          text: "Success in update team info"
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
    },
    remove(item) {
      this.members.splice(this.members.indexOf(item), 1);
    },
    confirmDialog(id) {
      this.memberIdToDelete = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: "Confirm",
        text: "Are you sure delete this member?",
        accept: this.deleteMember
      });
    },
    async addMember() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        const data = {
          id: this.id,
          newMemberEmail: this.newMemberEmail
        };
        await teamApi.addMember(data);
        this.$vs.notify({
          title: "Success",
          text: "Success in add member",
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
      this.newMemberEmail = "";
      this.$vs.loading.close("#div-loading > .con-vs-loading");
      this.getTeamInfo();
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
    },
    async deleteMember() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        const data = {
          teamId: this.id,
          memberId: this.memberIdToDelete
        };
        await teamApi.removeMember(data);
        this.$vs.notify({
          title: "Success",
          text: "Success in remove member",
          iconPack: "feather",
          icon: "icon-check",
          color: "success"
        });
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feahter",
          icon: "icon-alert-circle",
          color: "danger"
        });
      }
      this.$vs.loading.close("#div-loading > .con-vs-loading");
      this.getTeamInfo();
    }
  },
  computed: {
    validateForm() {
      return this.name != "" && this.members.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>