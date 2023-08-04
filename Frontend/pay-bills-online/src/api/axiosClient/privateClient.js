import axios from 'axios'
import queryString from 'query-string';

const baseURL = 'http://localhost:5000/api/'

const axiosPrivateClient = axios.create({
  baseURL,
  // paramsSerializer: {
  //   encode: params => queryString.stringify(params)
  // }
});

axiosPrivateClient.interceptors.request.use(async config => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  config.headers['Access-Control-Allow-Origin'] = '*';
  config.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE';
  config.headers['Accept'] = 'application/json';
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  return config;
});


axiosPrivateClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response.data;
});

export default axiosPrivateClient;



















