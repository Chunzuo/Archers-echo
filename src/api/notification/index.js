import client from "../client";

const getAdminNotifications = async () => {
  const response = await client({
    method: "GET",
    url: "/api/notification/admin"
  });
  return response.data;
};

const removeNotification = async id => {
  const response = await client({
    method: "DELETE",
    url: `/api/notification/${id}`
  });
  return response.data;
};

const getByUserId = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/notification/getByUserId/${userId}`
  });
  return response.data;
};

const addUserNotification = async data => {
  const response = await client({
    method: "POST",
    url: "/api/notification/addUserNotification",
    data
  });
  return response.data;
};

const removeMultiNotification = async data => {
  const response = await client({
    method: "POST",
    url: "/api/notification/removeMultiNotification",
    data
  });
  return response.data;
};

const removeByUser = async userId => {
  const response = await client({
    method: "DELETE",
    url: `/api/notification/removeByUser/${userId}`
  });
  return response.data;
};

export default {
  getAdminNotifications,
  removeNotification,
  getByUserId,
  addUserNotification,
  removeMultiNotification,
  removeByUser
};
