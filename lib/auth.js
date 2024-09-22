import Cookies from 'js-cookie';


// Функция для сохранения токена доступа, id пользователя и email в cookies
export const setAuthData = (data) => {
    Cookies.set('id', data.user.id);
    Cookies.set('jwt', data.jwt);
    Cookies.set('email', data.user.email);
};


// Функция для получения значений токена доступа, id пользователя и email из cookies
export const getAuthData = () => {
    const jwt = Cookies.get('jwt');
    const id = Cookies.get('id');
    const email = Cookies.get('email');
    return { jwt, id, email };
};


// Функция для удаления токена доступа, id пользователя и email из cookies
export const unsetAuthData = () => {
    Cookies.remove('id');
    Cookies.remove('jwt');
    Cookies.remove('email');
};


export const getUserFromLocalCookie = () => {
    Cookies.get('email');
};