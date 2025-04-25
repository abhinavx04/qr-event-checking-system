export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };