import { jwtVerify } from 'jose';
import Cookies from "js-cookie";
import axios from 'axios';

const secretKey = '47fab19090a41d7efc69cb542f31a47558f547808dd59fbef6468aa3e22127cd';
const key = new TextEncoder().encode(secretKey);

export async function login(formData) {
  const username = formData.get('username');
  const password = formData.get('password');
  try {
    const url = "https://b97c-36-71-84-137.ngrok-free.app/Gateway/api/login";
    const data = {
      "username": username,
      "location": "ok",
      "clientId": "ok",
      "clientIp": "ok",
      "password": password
    };
    const config = { 'content-type': 'application/json', 'ngrok-skip-browser-warning': "69420" };
    const response = await axios.post(url, data, config);
    if (response.data.code == 1) {
      const jwtToken = response.data.data.jwtToken;
      const refreshToken = response.data.data.refreshToken;
      const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
      Cookies.set("user-token", jwtToken, { expires: expires, path: "/" });
      Cookies.set("refresh-token", refreshToken, { expires: expires, path: "/" });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}


export async function refreshToken() {
  const userToken = Cookies.get("user-token");
  const refreshToken = Cookies.get("refresh-token");
  console.log(userToken + "||" + refreshToken);

  try {
    const url = "http://localhost:7110/Gateway/api/RefreshToken";
    const data = {
      "jwtToken": userToken,
      "refreshToken": refreshToken,
    };
    const config = { 'content-type': 'application/json' };
    const response = await axios.post(url, data, config);
    if (response.data.code == 1) {
      const jwtToken = response.data.data.jwtToken;
      const refreshToken = response.data.data.refreshToken;
      const expires = new Date(Date.now() + 15 * 1000);
      Cookies.set("user-token", jwtToken, { expires: expires, path: "/" });
      Cookies.set("refresh-token", refreshToken, { expires: expires, path: "/" });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function logout() {
  Cookies.remove("user-token");
  Cookies.remove("refresh-token");
}

export async function getCookies() {
  console.log("getCookies");
  const userToken = Cookies.get("user-token");
  if (!userToken) return null;
  return await decrypt(userToken);
}

export async function getToken() {
  const userToken = Cookies.get("user-token");
  if (!userToken) return null;
  return userToken;
}


export async function getEmployeeId() {
  const userToken = Cookies.get("user-token");
  if (!userToken) return null;
  const payload = await decrypt(userToken);
  return payload.EmployeeId;
}

export async function decrypt(input) {
  try {
    if (typeof input !== 'string' && !(input instanceof Uint8Array)) {
      throw new Error('Input must be a string or Uint8Array');
    }

    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    //var dataArray = Object.keys(payload).map(function(k){return payload[k]});

    return payload;
  } catch (error) {
    console.error('Error decrypting JWT:', error);
    throw error;
  }
}