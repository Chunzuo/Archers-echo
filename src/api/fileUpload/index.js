import client from "../client";

const list = async () => {
  const response = await client({
    method: "GET",
    url: "/api/file_uploads"
  });
  return response.data;
};

const add = async data => {
  const response = await client({
    method: "POST",
    url: "/api/file_uploads",
    data
  });
  return response.data;
};

const remove = async id => {
  const response = await client({
    method: "DELETE",
    url: `/api/file_uploads/${id}`
  });
  return response.data;
};

export default {
  list,
  add,
  remove
};
