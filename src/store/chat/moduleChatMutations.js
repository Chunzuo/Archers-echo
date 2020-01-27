/*=========================================================================================
  File Name: moduleChatMutations.js
  Description: Chat Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";

export default {
  UPDATE_ABOUT_CHAT(state, value) {
    state.AppActiveUser.about = value;
  },
  SET_CHAT_SEARCH_QUERY(state, query) {
    state.chatSearchQuery = query;
  },
  SEND_CHAT_MESSAGE(state, payload) {
    if (payload.chatData) {
      state.chats[
        Object.keys(state.chats).find(key => key == payload.id)
      ].msg.push(payload.msg);
    } else {
      const chatId = payload.id;
      Vue.set(state.chats, [chatId], {
        isPinned: payload.isPinned,
        msg: [payload.msg]
      });
    }
  },
  TOGGLE_IS_PINNED(state, payload) {
    state.chats[
      Object.keys(state.chats).find(key => key == payload.id)
    ].isPinned = payload.value;
  },
  MARK_SEEN_ALL_MESSAGES(state, payload) {
    payload.chatData.msg.forEach(msg => {
      msg.isSeen = true;
    });
  },
  SET_CHANNELS(state, channels) {
    // console.log(channels);
    state.channels = channels;
  },
  SET_CHANNEL_LOGS(state, logs) {
    state.channelLogs = logs;
  },
  UPDATE_CHANNEL_LOGS(state, data) {
    state.channels.map(channel => {
      if (channel.id === data.channelId) {
        channel.messages.push(data);
      }
    });
    // state.channelLogs.push(msg);
  },
  READ_UNREAD_CHANNEL_MESSAGE(state, data) {
    const { channelId } = data;
    state.channels.map(channel => {
      if (channel.id === channelId) {
        channel.unreadMsgCnt = 0;
      }
    });
  },
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts;
  },
  UPDATE_DIRECT_MESSAGE_LOGS(state, data) {
    state.contacts.map(contact => {
      if (contact.id === data.receiver.id || contact.id === data.sender) {
        contact.msg.push(data);
      }
    });
  },
  READ_UNREAD_DIRECT_MESSAGE(state, data) {
    const { sender } = data;
    state.contacts.map(contact => {
      if (contact.id === sender) {
        contact.unreadMsgCnt = 0;
      }
    });
  }
};
