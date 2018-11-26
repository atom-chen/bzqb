(function () {
    let platUrl = null;
    let successcb = null;
    let failcb = null;
    let xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            if (successcb) successcb(JSON.parse(xhr.responseText));
        }
    };
    xhr.timeout = 3000;
    xhr.ontimeout = (err) => {
        if (failcb) failcb(err);
    }
    xhr.onerror = (err) => {
        if (failcb) failcb(err);
    }
    class PlatSdk {
        setPlatUrl(url) {
            platUrl = url;
        }
        getPlatUrl() {
            return platUrl;
        }
        _platReq(route, msg = null) {
            xhr.open("POST", platUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            let newMsg = {
                head: {
                    route: `http.${route}`,
                    uid: "0",
                    token: ""
                },
                body: msg
            }
            xhr.send(JSON.stringify(newMsg));
        }
        login(obj) {
            let { data, success, fail } = obj;
            successcb = success;
            failcb = fail;
            this._platReq("login", data);
        }
        register(obj) {
            let { data, success, fail } = obj;
            successcb = success;
            failcb = fail;
            this._platReq("register", data);
        }
        touristLogin(obj) {
            let { success, fail } = obj;
            successcb = success;
            failcb = fail;
            this._platReq("tourist");
        }
        wechatLogin() {
            // 待实现
        }
        QQLoign() {
            // 待实现
        }
    }
    window.platSdk = new PlatSdk();
})();