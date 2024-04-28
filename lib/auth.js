import Cookies from 'js-cookie';

// Функция для сохранения токена доступа, id пользователя и username в cookies
export const setAuthData = (data) => {
    Cookies.set('id', data.user.id);
    Cookies.set('jwt', data.jwt);
    Cookies.set('username', data.user.username);
};

// Функция для получения значений токена доступа, id пользователя и username из cookies
export const getAuthData = () => {
    const jwt = Cookies.get('jwt');
    const id = Cookies.get('id');
    const username = Cookies.get('username');
    return { jwt, id, username };
};

// Функция для удаления токена доступа, id пользователя и username из cookies
export const unsetAuthData = () => {
    Cookies.remove('id');
    Cookies.remove('jwt');
    Cookies.remove('username');
};

export const getUserFromLocalCookie = () => {
    Cookies.get('username');
};