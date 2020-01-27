<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vx-card title="My Team">
      <vs-button icon="add" @click="$router.push({name: 'add-team'})">Add team</vs-button>

      <vs-table :data="myTeamList" class="mt-4">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Members</vs-th>
          <vs-th>Created At</vs-th>
          <vs-th>Updated At</vs-th>
          <vs-th></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.name}}</vs-td>
            <vs-td>
              <vs-chip v-for="(member, index) in tr.members" :key="index" v-if="member.id">
                <vs-avatar/>
                {{member.id.email}}
              </vs-chip>
            </vs-td>
            <vs-td>{{tr.createdAt.replace("T", " ").split(".")[0]}}</vs-td>
            <vs-td>{{tr.updatedAt.replace("T", " ").split(".")[0]}}</vs-td>
            <vs-td>
              <feather-icon
                icon="EyeIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="gotoDetailPage(tr._id)"
              ></feather-icon>
              <feather-icon
                icon="EditIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="gotoEditPage(tr._id)"
              ></feather-icon>
              <feather-icon
                icon="TrashIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="confirmDialog(tr._id)"
              ></feather-icon>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "@/api/team";
export default {
  data() {
    return {
      myTeamList: [],
      user: this.$auth.profile,
      idToDelete: null
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  mounted() {
    this.getMyTeamList();
  },
  methods: {
    remove(item) {
      this.members.splice(this.members.indexOf(item), 1);
    },
    async getMyTeamList() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        this.myTeamList = await teamApi.getTeamList(this.userId);
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
    gotoEditPage(id) {
      this.$router.push({ path: `/user/edit-team/${id}` });
    },
    confirmDialog(id) {
      this.idToDelete = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this team?",
        accept: this.deleteTeam
      });
    },
    async deleteTeam() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await teamApi.remove(this.idToDelete);
        this.$vs.notify({
          title: "Account Created",
          text: "You are successfully registered!",
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
      this.$vs.loading.close("#div-loading > .con-vs-loading");
      this.getMyTeamList();
    },
    gotoDetailPage(id) {
      this.$router.push({ path: `/user/detail-team/${id}` });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>