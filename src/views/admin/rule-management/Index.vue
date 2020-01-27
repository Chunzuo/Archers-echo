<template>
  <div id="div-loading" class="vs-con-loading__conatiner">
    <vx-card title="Rule Management">
      <add-rule @getRuleList="getRuleList"></add-rule>
      <vs-table :data="rules">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Created at</vs-th>
          <vs-th>Actions</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr v-for="(tr, index) in data" :key="index">
            <vs-td>{{tr.name}}</vs-td>
            <vs-td>{{tr.createdAt.split("T")[0]}}</vs-td>
            <vs-td>
              <vs-row>
                <vx-tooltip text="Edit">
                  <vs-button
                    type="border"
                    icon-pack="feather"
                    icon="icon-edit"
                    radius
                    @click="openEditDialog(tr)"
                  ></vs-button>
                </vx-tooltip>
                <vx-tooltip text="Delete" class="ml-2">
                  <vs-button
                    type="border"
                    color="danger"
                    icon-pack="feather"
                    icon="icon-trash"
                    radius
                    @click="confirmDialog(tr)"
                  ></vs-button>
                </vx-tooltip>
              </vs-row>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <edit-rule
        :displayPrompt="editActivePrompt"
        :data="selectedRule"
        @hideEditPrompt="hideEditPrompt"
        @showLoading="showLoading"
        v-if="editActivePrompt"
      ></edit-rule>
    </vx-card>
  </div>
</template>

<script>
import ruleApi from "@/api/rule";
import AddRule from "./AddRule";
import EditRule from "./EditRule";

export default {
  components: { AddRule, EditRule },
  data() {
    return {
      selectedRule: {},
      editActivePrompt: false
    };
  },
  mounted() {
    this.getRuleList();
  },
  computed: {
    rules() {
      return this.$store.state.rule.list;
    }
  },
  watch: {
    rules() {
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    }
  },
  methods: {
    showLoading() {
      this.$vs.loading({ container: "#div-loading" });
    },
    async getRuleList() {
      this.showLoading();
      this.$store.dispatch("rule/getRuleList");
    },
    confirmDialog(item) {
      this.selectedRule = item;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: "Confirm",
        text: "Are you sure delete this rule?",
        accept: this.deleteRule
      });
    },
    async deleteRule() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await ruleApi.remove(this.selectedRule._id);
        this.$vs.notify({
          title: "Success",
          text: "Succes in delete rule",
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
      this.getRuleList();
    },
    openEditDialog(item) {
      this.editActivePrompt = true;
      this.selectedRule = item;
    },
    hideEditPrompt() {
      this.editActivePrompt = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>