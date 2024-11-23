import {TOKEN_DATA} from './constants';
import {tokenResponse} from "../modules/login/type";

const Storage = {
    setCookie(name: string, value: string, seconds?: number) {
        let expires = "";
        if (seconds) {
            const date = new Date();
            date.setTime(date.getTime() + seconds * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    },
    getCookie: function (name: string) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    },
    eraseCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },

    getTokenData(): tokenResponse | null {
        const data = localStorage.getItem(TOKEN_DATA);
        return data ? JSON.parse(data) : null;
    },

    getTokenString(): String | null {
        const data = localStorage.getItem(TOKEN_DATA);
        const token: tokenResponse = data ? JSON.parse(data) : null;
        return token.token;
    },

    get(key: string, defaultValue: string = '') {
        const value = localStorage.getItem(key);

        return value ? value : defaultValue;
    },

    set(key: string, value: string = '') {
        localStorage.setItem(key, value);
    },

    remove(key: string) {
        localStorage.removeItem(key);
    },
};

export default Storage;
