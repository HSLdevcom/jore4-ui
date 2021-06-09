import axios from 'axios';

const BASE_URL = '/api/auth/public/v1';

export const LOGIN_URL = `${BASE_URL}/login`;
export const LOGOUT_URL = `${BASE_URL}/logout`;

export const getUserInfo = () => axios.get(`${BASE_URL}/userInfo`);
