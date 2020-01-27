<template>
  <div>
    <vs-card>
      <add-archer></add-archer>
      <vs-table :data="archers">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Description</vs-th>
          <vs-th>Created At</vs-th>
          <vs-th></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="tr.name">{{ tr.name }}</vs-td>

            <vs-td>{{ data[indextr].description }}</vs-td>

            <vs-td>{{ data[indextr].createdAt.split('T')[0] }}</vs-td>

            <vs-td>
              <div class="vx-row">
                <vs-button
                  class="mr-4"
                  type="border"
                  icon="edit"
                  radius
                  @click="openEditDialog(tr)"
                ></vs-button>
                <vs-button
                  color="danger"
                  type="border"
                  icon="delete"
                  radius
                  @click="openConfirm(tr._id)"
                ></vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <edit-archer
        :displayPrompt="editPrompt"
        :archer="archerToEdit"
        v-if="editPrompt"
        @hideEditDialog="hideEditDialog"
      ></edit-archer>
    </vs-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import archerApi from "@/api/archer";
import AddArcher from "./AddArcher.vue";
import EditArcher from "./EditArcher.vue";

export default {
  data() {
    return {
      users: [
        {
          email: "user@mail.com",
          username: "user1",
          website: "XXX.com",
          id: "123"
        }
      ],
      selId: null,
      editPrompt: false,
      archerToEdit: null
    };
  },
  mounted() {
    this.$store.dispatch("archer/getArcherList", this.userId);
  },
  methods: {
    onClickEditbtn(id) {
      console.log("edit button clicked");
      console.log(id);
    },
    openConfirm(id) {
      this.selId = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this archer?",
        accept: this.deleteArcher
      });
    },
    async deleteArcher() {
      await archerApi.removeArcher(this.selId);
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in remove archer"
      });
      this.$store.dispatch("archer/getArcherList", this.userId);
    },
    gotoArcherDetail(id) {
      console.log(id);
      this.$router.push({ path: `/user/archer-detail/${id}` });
    },
    openEditDialog(item) {
      this.archerToEdit = {
        name: item.name,
        description: item.description,
        id: item._id
      };
      this.editPrompt = true;
    },
    hideEditDialog() {
      this.editPrompt = false;
    }
  },
  components: {
    AddArcher,
    EditArcher
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    },
    ...mapState({
      archers: state => state.archer.archers
    })
  }
};
</script>

<style scoped>
</style>