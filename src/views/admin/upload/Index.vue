<template>
  <div>
    <vx-card title="Upload StatusReporter">
      <vs-upload :action="uploadUrl" @on-success="successUpload" fileName="file"/>
    </vx-card>
    <div class="mt-4 vs-con-loading__container" id="div-loading">
      <vx-card title="Uploaded files">
        <vs-table :data="uploadFiles">
          <template slot="thead">
            <vs-th>Name</vs-th>
            <vs-th>Uploaded at</vs-th>
            <vs-th>Actions</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr v-for="(tr, index) in data" :key="index">
              <vs-td>{{tr.name}}</vs-td>
              <vs-td>{{tr.createdAt.replace("T", " ").split(".")[0]}}</vs-td>
              <vs-td>
                <vs-button
                  color="danger"
                  icon-pack="feather"
                  icon="icon-trash"
                  type="border"
                  radius
                  @click="confirmDialog(tr._id)"
                ></vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vx-card>
    </div>
  </div>
</template>

<script>
import { SERVER_URL } from "@/utils/constant";
import fileUploadApi from "@/api/fileUpload";

export default {
  data() {
    return {
      uploadFiles: [],
      idToDelete: null
    };
  },
  mounted() {
    this.getUploadFileList();
  },
  computed: {
    uploadUrl() {
      return `${SERVER_URL}/api/upload`;
    }
  },
  methods: {
    async successUpload(response) {
      try {
        await fileUploadApi.add({ name: response.srcElement.response });
        this.$vs.notify({
          title: "Success",
          text: "Success in upload file",
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
      this.getUploadFileList();
    },
    async getUploadFileList() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        this.uploadFiles = await fileUploadApi.list();
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
    confirmDialog(id) {
      this.idToDelete = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: "Confirm",
        text: "Are you sure delete this file?",
        accept: this.deleteFile
      });
    },
    async deleteFile() {
      try {
        await fileUploadApi.remove(this.idToDelete);
        this.$vs.notify({
          title: "Success",
          text: "Success in delete file",
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
      this.getUploadFileList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>