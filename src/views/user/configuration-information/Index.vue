<template>
  <div id="div-configuration-information" class="vs-con-loading__container">
    <vx-card title="Configuration Information">
      <div class="vx-row mb-6" vs-align="center" vs-type="flex" vs-justify="center">
        <div class="vx-col" vs-type="flex" vs-align="center" vs-justify="center">
          <vs-input label-placeholder="Configuration table" v-model="configDatabase"/>
        </div>
        <div class="vx-col" vs-type="flex" vs-align="center" vs-justify="center">
          <vs-button class="mt-4" @click="getData">Get Data</vs-button>
        </div>
      </div>
      <vs-table max-items="10" pagination :data="confInfoList">
        <template slot="thead">
          <vs-th>Section Group</vs-th>
          <vs-th>Section Name</vs-th>
          <vs-th>DataPoint GroupKey</vs-th>
          <vs-th>Data Point</vs-th>
          <vs-th>Data Point Value</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ tr.section_group }}</vs-td>
            <vs-td>{{ tr.section_name }}</vs-td>
            <vs-td>{{ tr.data_point_group_key }}</vs-td>
            <vs-td>{{ tr.data_point }}</vs-td>
            <vs-td>{{ tr.data_point_value }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "@/utils/constant";

export default {
  data() {
    return {
      socket: io(SERVER_URL),
      archerId: this.$route.params.id,

      confInfoList: [],
      arriveResponse: false,
      timer: null,
      configDatabase: "Configuration"
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
    // configDatabase: {
    //   get() {
    //     console.log(this.$store.state.archer.archers);
    //     return this.$store.state.archer.archers.find(i => {
    //       return i._id === this.archerId;
    //     }).configurationDatabase;
    //   },
    //   set(value) {
    //     return value;
    //   }
    // }
  },
  mounted() {
    this.responseSocket();
  },
  methods: {
    getConfigInfoList() {
      this.$vs.loading({
        container: "#div-configuration-information",
        scale: 0.6
      });
      const data = {
        archerId: this.archerId,
        userId: this.userId,
        database: this.configDatabase
      };
      this.socket.emit("REQ_DB_CONFIGURATION", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_DB_CONFIGURATION", response => {
        // console.log("response from DbConfiguration");
        // console.log(response);
        this.confInfoList = response;
        this.$vs.loading.close(
          "#div-configuration-information > .con-vs-loading"
        );
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close(
            "#div-configuration-information > .con-vs-loading"
          );
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    },
    getData() {
      this.getConfigInfoList();
      this.checkResponse();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>