import Cookies from "universal-cookie"

    const cookies = new Cookies(null, {path: "/"});

    const setCookie = (key: string, value: string) => {
        cookies.set(key, value);
    }

    const getCookie = (key: string) => {
        return cookies.get(key);
    }

    const removeCookie = (key: string) => {
        cookies.remove(key);
    }
    

    export { setCookie, getCookie, removeCookie };
