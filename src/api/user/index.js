import client from "../client";

const getById = async id => {
  const response = await client({
    method: "GET",
    url: `/api/users/${id}`
  });
  return response.data;
};

const update = async (id, data) => {
  const response = await client({
    method: "PUT",
    url: `/api/users/${id}`,
    data
  });
  return response.data;
};

/**
 * Get Other users list for invite my team.
 * @param {my id} userId
 */
const getOtherUsers = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/users/getOthers/${userId}`
  });
  return response.data;
};

const updatePassword = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users/updatePassword",
    data
  });
  return response.data;
};

const updateSocketId = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users/updateSocketId",
    data
  });
  return response.data;
};

/**
 * Admin user list
 */
const getAllUserList = async () => {
  const response = await client({
    method: "GET",
    url: "/api/users"
  });
  return response.data;
};

/**
 * Activate/Unactivate user
 */
const updateUserStatus = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users/updateStatus",
    data
  });
  return response.data;
};

/**
 * Delete user
 */
const removeUser = async data => {
  const response = await client({
    method: "DELETE",
    url: `/api/users`,
    data
  });
  return response.data;
};

/**
 * Add user (integrate with Firebase)
 */
const addUser = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users",
    data
  });
  return response.data;
};

/**
 * Send Password reset email
 */
const sendPasswordResetEmail = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users/passwordReset",
    data
  });
  return response.data;
};

const updateProfile = async data => {
  const response = await client({
    method: "POST",
    url: "/api/users/updateProfile",
    data
  });
  return response.data;
};

export default {
  getById,
  update,
  getOtherUsers,
  updatePassword,
  updateSocketId,
  getAllUserList,
  updateUserStatus,
  removeUser,
  addUser,
  sendPasswordResetEmail,
  updateProfile
};
