const TOKEN_KEY = 'appnw_token';
const USER_KEY  = 'appnw_user';

export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAdmin = () => getUser()?.type === 'Admin';

/** Headers สำหรับ request ที่ต้องการ auth */
export const authHeaders = (includeContentType = true) => {
  const token = getToken();
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (includeContentType) h['Content-Type'] = 'application/json';
  return h;
};

/** เรียกเมื่อ response เป็น 401/403 — clear token แล้ว redirect login */
export const handleUnauthorized = (status) => {
  if (status === 401 || status === 403) {
    clearAuth();
    window.location.href = '/Login';
    return true;
  }
  return false;
};
