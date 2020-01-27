<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vx-card title="User management">
      <add-user @getUserList="getUserList"></add-user>
      <vs-table :data="users" @selected="toUserDetailPage">
        <template slot="thead">
          <vs-th>Email</vs-th>
          <vs-th>User Name</vs-th>
          <vs-th>Company Name</vs-th>
          <vs-th>Created at</vs-th>
          <vs-th>Last login date</vs-th>
          <vs-th>Status</vs-th>
          <vs-th>Actions</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="index" v-for="(tr, index) in data">
            <vs-td>{{ tr.email }}</vs-td>
            <vs-td>{{ tr.userName }}</vs-td>
            <vs-td>{{ tr.companyName }}</vs-td>
            <vs-td>{{ tr.createdAt.split("T")[0] }}</vs-td>
            <vs-td>{{ tr.lastLoginTime ? tr.lastLoginTime.split("T")[0] : "--" }}</vs-td>
            <vs-td>
              <vs-chip :color="getStatusColor(tr.status)">{{getStatusLabel(tr.status)}}</vs-chip>
            </vs-td>
            <vs-td>
              <vs-row>
                <vx-tooltip text="Deactivate" v-if="tr.status === 1">
                  <vs-button
                    type="border"
                    color="warning"
                    icon-pack="feather"
                    icon="icon-x"
                    @click="updateStatus({id: tr._id, status: 0})"
                    radius
                  ></vs-button>
                </vx-tooltip>
                <vx-tooltip text="Active" v-else>
                  <vs-button
                    type="border"
                    color="success"
                    icon-pack="feather"
                    icon="icon-check"
                    @click.stop="updateStatus({id: tr._id, status: 1})"
                    radius
                  ></vs-button>
                </vx-tooltip>
                <vx-tooltip text="Delete">
                  <vs-button
                    class="ml-2"
                    type="border"
                    color="danger"
                    icon-pack="feather"
                    icon="icon-trash"
                    @click.stop="confirmDialog(tr)"
                    radius
                  ></vs-button>
                </vx-tooltip>
              </vs-row>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <edit-user
        :displayPrompt="editPrompt"
        :user="userToEdit"
        v-if="editPrompt"
        @hideEditDialog="hideEditDialog"
      ></edit-user>
    </vx-card>
  </div>
</template>

<script>
import userApi from "@/api/user";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

export default {
  data() {
    return {
      users: [],
      userToDelete: null,
      editPrompt: false,
      userToEdit: null
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        this.users = await userApi.getAllUserList();
        console.log(this.users);
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
    async updateStatus(data) {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await userApi.updateUserStatus(data);
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
      this.$vs.loading.close("#div-loading > .con-vs-loading");
      this.getUserList();
    },
    confirmDialog(user) {
      this.userToDelete = user;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this user?",
        accept: this.deleteUser
      });
    },
    async deleteUser() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await userApi.removeUser({
          id: this.userToDelete._id,
          email: this.userToDelete.email
        });
        this.$vs.notify({
          title: "Succeses",
          text: "Success in delete user",
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
      this.getUserList();
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return "danger";
        case 1:
          return "success";
        case 2:
          return "warning";
      }
    },
    getStatusLabel(status) {
      switch (status) {
        case 0:
          return "Not activated";
        case 1:
          return "Active";
        case 2:
          return "Locked";
      }
    },
    toUserDetailPage(item) {
      this.userToEdit = item;
      this.editPrompt = true;
    },
    hideEditDialog() {
      this.editPrompt = false;
    }
  },
  components: {
    AddUser,
    EditUser
  }
};
</script>

<style lang="scss" scoped>
</style>