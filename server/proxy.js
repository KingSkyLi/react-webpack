const axios = require('axios');
const baseUrl = 'https://cnodejs.org/api/v1';
// cnode中有的请求需要表单的格式
const querystring = require('query-string');

module.exports = function (req, res, next) {
  const path = req.path;
  console.log(path);
  const user = req.session.user || {};
  const needAccessToken = req.query.needAccessToken ;
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query);
  if (query.needAccessToken) {
    delete query.needAccessToken
  }
  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    // 不转化{'accesstoken':'xxxxxx'}  转化之后是accesstoken='xxxxxxxx'
    data: querystring.stringify(Object.assign({}, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken:''
    })),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data);
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })

}

