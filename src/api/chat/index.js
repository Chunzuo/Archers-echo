import client from "../client";

const getChannels = async data => {
  const response = await client({
    method: "POST",
    url: "/api/chat/getChannels",
    data
  });
  return response.data;
};

const getChannelMessageLog = async channelId => {
  console.log(channelId);
  const response = await client({
    method: "GET",
    url: "/api/chat/getChannelLogs/" + channelId
  });
  return response.data;
};

const readUnreadChannelMessage = async data => {
  const response = await client({
    method: "POST",
    url: "/api/chat/readUnreadChannelMessage",
    data
  });
  return response.data;
};

const getContacts = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/chat/getContacts/${userId}`
  });
  return response.data;
};

const readUnreadDirectMessage = async data => {
  const response = await client({
    method: "POST",
    url: "/api/chat/readUnreadDirectMessage",
    data
  });
  return response.data;
};

export default {
  getChannels,
  getChannelMessageLog,
  readUnreadChannelMessage,
  getContacts,
  readUnreadDirectMessage
};
