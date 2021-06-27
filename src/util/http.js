import axios from 'axios';
// TODO 当切换路由时需要 cancel 该页面对应所有的请求
class Http {
  // static parseUrl(url, params = {}) {
  //   const strParams = Object.keys(params).reduce((result, key) => {
  //     result += `${key}=${params[key]}&` // eslint-disable-line
  //     return result;
  //   }, '');
  //   return strParams
  //     ? `${url}?${strParams.substr(0, strParams.length - 1)}`
  //     : `${url}`;
  // }

  static defaultHeaders = {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Language': localStorage.getItem('language') || 'zh-CN',
  };

  static request(method, url, params, headers = {}, postData, isSkipVerifyCode = false) {
    return new Promise((resolve, reject) => {
      axios({
        method,
        url,
        params,
        headers: { ...Http.defaultHeaders, ...headers },
        data: postData,
      })
        .then((resp) => {
          const { data } = resp;
          if (isSkipVerifyCode) {
            resolve(data);
          } else if (data.code === 0) {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static get(url, params, isSkipVerifyCode) {
    return Http.request('get', url, params, {}, {}, isSkipVerifyCode);
  }

  static post(url, params, headers, postData, isSkipVerifyCode) {
    return Http.request('post', url, params, headers, postData, isSkipVerifyCode);
  }

  static put(url, params, headers, postData, isSkipVerifyCode) {
    return Http.request('put', url, params, headers, postData, isSkipVerifyCode);
  }

  // static delete(url, params, isSkipVerifyCode) {
  //   return Http.request('delete', url, params, {}, {}, isSkipVerifyCode);
  // }

  static delete(url, params, headers, postData, isSkipVerifyCode) {
    return Http.request('delete', url, params, headers, postData, isSkipVerifyCode);
  }

  static patch(url, params, headers, postData, isSkipVerifyCode) {
    return Http.request('patch', url, params, headers, postData, isSkipVerifyCode);
  }
}

export default Http;
