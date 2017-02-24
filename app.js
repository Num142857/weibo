var Weibo = require('nodeweibo');
var express = require("express");
var app = express();


var setting = {
    "appKey": "3936578864",
    "appSecret": "92c5b26d2874046ff4aeb26e05ebd6f6",
    "redirectUrl": "127.0.0.1:3000"
};

Weibo.init(setting);
Weibo.authorize();

app.use("/", function (req, res, next) {
    console.log(req.query);
    if(!req.query.code)return;    
    console.log("有人进来了");
    Weibo.OAuth2.access_token({
        code: req.query.code,
        grant_type: "authorization_code"
    }, function (data) {
        // 设置请求参数
        sendWeibo(data.access_token,function(){
            res.end()
        });
        
    });

});

// "2.00uS_IJCUzT6SEbbe0c01932j2oVOD"
function sendWeibo(access_token,callback) {
    console.log(access_token)
    var jsonParas = {
        "source": setting.appKey,
        "access_token": access_token,
        status: "12121"
    };
    // 调用API
    Weibo.Statuses.update(jsonParas, function (data) {
        console.log('API回调', data);
        if(callback){
            callback(data)
        }
    });

}

app.listen(3000, function () {
    console.log("服务启动")
})
