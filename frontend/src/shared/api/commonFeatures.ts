import { InternalAxiosRequestConfig } from "axios";

const addTokenToHeader = async (config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (accessToken) {
      const newConfig = Object.assign({}, config, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return newConfig;
    }
  } catch (error) {
    console.log(error);
  }
  return config;
};

export { addTokenToHeader };
