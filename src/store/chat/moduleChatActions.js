/*=========================================================================================
  File Name: moduleChatActions.js
  Description: Chat Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import chatApi from "@/api/chat";

export default {
  updateAboutChat({ commit }, value) {
    commit("UPDATE_ABOUT_CHAT", value);
  },
  updateStatusChat({ commit }, value) {
    commit("UPDATE_STATUS_CHAT", value, { root: true });
  },
  setChatSearchQuery({ commit }, query) {
    commit("SET_CHAT_SEARCH_QUERY", query);
  },
  sendChatMessage({ getters, commit }, payload) {
    payload.chatData = getters.chatDataOfUser(payload.id);
    commit("SEND_CHAT_MESSAGE", payload);
  },
  toggleIsPinned({ commit }, payload) {
    commit("TOGGLE_IS_PINNED", payload);
  },
  markSeenAllMessages({ getters, commit }, id) {
    let payload = { id: id };
    payload.chatData = getters.chatDataOfUser(payload.id);
    commit("MARK_SEEN_ALL_MESSAGES", payload);
  },
  async getChannels({ commit }, data) {
    const channels = await chatApi.getChannels(data);
    console.log(channels);
    commit("SET_CHANNELS", channels);
  },
  async getChannelMessageLog({ commit }, channelId) {
    // console.log("getChannelMessageLog in moduleChatActions: " + channelId);
    const msgLogs = await chatApi.getChannelMessageLog(channelId);
    // console.log(msgLogs);
    commit("SET_CHANNEL_LOGS", msgLogs);
  },
  async readUnreadChannelMessage({ commit }, data) {
    commit("READ_UNREAD_CHANNEL_MESSAGE", data);
    await chatApi.readUnreadChannelMessage(data);
  },
  async getContacts({ commit }, userId) {
    const contacts = await chatApi.getContacts(userId);
    console.log("contacts");
    console.log(contacts);
    commit("SET_CONTACTS", contacts);
  },
  async readDirectMessage({ commit }, data) {
    console.log(data);
    commit("READ_UNREAD_DIRECT_MESSAGE", data);
    await chatApi.readUnreadDirectMessage(data);
  }
};
