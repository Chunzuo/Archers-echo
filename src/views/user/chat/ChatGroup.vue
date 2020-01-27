<template>
  <div
    class="chat__contact flex items-center px-2 py-3"
    :class="{'bg-primary-gradient text-white shadow-lg': isActiveChannel}"
  >
    <div class="contact__avatar mr-3">
      <vs-avatar
        class="border-2 border-solid border-white"
        icon-pack="feather"
        icon="icon-users"
        size="42px"
      ></vs-avatar>
    </div>
    <div class="contact__container w-full flex items-center justify-between overflow-hidden">
      <div class="contact__info flex flex-col truncate w-5/6">
        <h5 class="font-semibold" :class="{'text-white': isActiveChannel}">{{ data.name }}</h5>
        <span class="truncate">
          <feather-icon icon="UsersIcon" svgClasses="h-4 w-4"></feather-icon>
          : {{memberCount}}
        </span>
      </div>

      <div class="chat__contact__meta flex self-start flex-col items-end w-1/6">
        <vs-avatar
          color="primary"
          :text="`${data.unreadMsgCnt}`"
          size="20px"
          v-if="data.unreadMsgCnt > 0"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isActiveChannel: {
      type: Boolean
    }
  },
  computed: {
    memberCount() {
      return this.data.members.length + 1;
    }
  },
  mounted() {
    // console.log(this.data);
  }
};
</script>