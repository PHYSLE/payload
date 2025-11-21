const Cookie = {
    setCookie: function (key, value) {
        let d = new Date();
        let days = 365;
        d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = (key + '=' + btoa(value) + '; expires=' + d.toUTCString() + "; path=/");

    },
    getCookie: function (key) {
        let cookies = document.cookie.split(';');
        let val = null;
        for(let i=0; i < cookies.length;i++) {
            let c = cookies[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(key + '=') == 0) {
                val = c.substring(key.length + 1,c.length);
                break;
            }
        }
        return val ? atob(val) : null;                  
    }
}

export default Cookie;