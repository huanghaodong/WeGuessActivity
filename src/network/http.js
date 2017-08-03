const HTTPBase = {};

/**
 *
 * GET请求
 *
 * @param url
 * @param params {}包装
 * @param headers
 *
 * @return {Promise}
 *
 * */
HTTPBase.get = function(url, params, headers) {
    if (params) {

        let paramsArray = [];

        // 获取 params 内所有的 key
        let paramsKeyArray = Object.keys(params);
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => paramsArray.push(key + '=' + params[key]));

        // 网址拼接
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += paramsArray.join('&');
        }
    }

    return new Promise(function(resolve, reject) {
        fetch(url, {
                method: 'GET',
                headers: headers
            })
            .then((response) => response.json())
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject({
                    status: -1
                })
            })
            .done();
    })
}

/**
 *
 * POST请求
 *
 * @param url
 * @param params {}包装
 * @param headers
 *
 * @return {Promise}
 *
 * */
HTTPBase.post = function(url, params, headers,paramsArray) {
    if (params) {

        paramsArray = [];

        // 获取 params 内所有的 key
        let paramsKeyArray = Object.keys(params);
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => paramsArray.push(key + '=' + params[key]));
    }
    return new Promise(function(resolve, reject) {
        console.log(paramsArray)
        fetch(url, {
                method: 'POST',
                headers: {...headers,'Content-Type': 'application/x-www-form-urlencoded',},
                body: paramsArray.join('&'),
            })
            .then((response) => response.json())
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject({
                    status: -1
                })
            })
            .done();
    })
}

export default HTTPBase;