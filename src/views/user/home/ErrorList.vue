<template>
  <div class="vx-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
    <div class="vx-col w-full mb-base">
      <vx-card title="List of Errors in last 24 hours">
        <vs-list>
          <vs-list-item
            v-for="(error, index) in errorList"
            :key="index"
            :title="error.name"
            :subtitle="getErrorTime(error.createdAt)"
          ></vs-list-item>
        </vs-list>
      </vx-card>
    </div>
  </div>
</template>

<script>
import api from "@/api/dashboard";
export default {
  data() {
    return {
      errorList: []
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  mounted() {
    this.getErrorList();
  },
  methods: {
    async getErrorList() {
      this.errorList = await api.getErrorListLast24hours(this.userId);
    },
    getErrorTime(time) {
      return `Created At: ${time.replace("T", " ").split(".")[0]}`;
    }
  }
};
</script>

<style scoped>
</style>