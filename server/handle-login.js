const router = require('express').Router();
const axios = require('axios');


const baseUrl = 'https://cnodejs.org/api/v1';

router.post('/login', function (req, res, next) {
  console.log(req.body.accessToken);
  axios.post(`${baseUrl}/accesstoken`,{
    accesstoken:req.body.accessToken
  }).then(resp => {
    if(resp.status === 200 && resp.data.success){
      req.session.user = {
        accessToken: req.body.accessToken,
        loginName:resp.data.name,
        id:resp.data.id,
        avatarUrl: resp.data.avatar_url
      }
      res.json({
        success:true,
        data: resp.data
      })
    }
  }).catch((err)=>{
    if(err.response){
      res.json({
        success:false,
        status:err.response.status,
        data:err.response.data
      })
    }else{
      next(err);
    }
  });
})

module.exports = router;
