import apiClient from "./apiClient";

const EpicApis = {
  getLocation: () => {
    return apiClient.get('/getlocation');
  }
};

export default EpicApis;
