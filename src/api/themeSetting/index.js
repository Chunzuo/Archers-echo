import client from "../client";

const getThemeSetting = async () => {
  const response = await client({
    method: "GET",
    url: "/api/theme_setting"
  })
  return response.data
}

const updateSetting = async data => {
  const response = await client({
    method: "POST",
    url: "/api/theme_setting",
    data
  })
  return response.data
}

export default {
  getThemeSetting,
  updateSetting
}