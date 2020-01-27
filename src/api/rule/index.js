import client from "../client";

const list = async () => {
  const response = await client({
    method: "GET",
    url: "/api/rule"
  });
  return response.data;
};

const add = async data => {
  const response = await client({
    method: "POST",
    url: "/api/rule",
    data
  });
  return response.data;
};

const remove = async id => {
  const response = await client({
    method: "DELETE",
    url: `/api/rule/${id}`
  });
  return response.data;
};

const update = async (id, data) => {
  const response = await client({
    method: "PUT",
    url: `/api/rule/${id}`,
    data
  });
  return response.data;
};

export default {
  list,
  add,
  remove,
  update
};
