import axios from 'axios';

const BASE_URL = '/api/auth/public/v1';

export const login = () => window.location.assign(`${BASE_URL}/login`);
export const logout = () => window.location.assign(`${BASE_URL}/logout`);

export const getUserInfo = () => axios.get(`${BASE_URL}/userInfo`);
