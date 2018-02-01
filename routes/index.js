var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "短网址",
    url: "",
    msg: "请输入要缩短的网址"
  });
});

// 访问接口
router.get("/*", function(req, res, next) {
  var id = req.url.replace("/", "");

  var JsonObj = JSON.parse(fs.readFileSync("./db/dwz.json"));
  var hasKey = JsonObj[id];
  var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
  var isTrue = hasKey != undefined && reg.test(hasKey) ? true : false;

  // console.log(isTrue);
  if (hasKey != undefined) {
    res.render("url", {
      title: "成功",
      url: hasKey,
      msg: "连接跳转中"
    });
    res.end(JSON.stringify({ status: "loading" }));
  } else {
    res.render("url", {
      title: "错误",
      url: "",
      msg: "输入错误或者对应的URL不符合规则"
    });
    res.end(JSON.stringify({ status: "loading" }));
  }
});

//提交接口
router.post("/", function(req, res, next) {
  // 打印post请求的数据内容
  var datas = req.body;
  var JsonObj = JSON.parse(fs.readFileSync("./db/dwz.json"));
  var hasKey = JsonObj[datas.link];
  if (hasKey == undefined) {
    JsonObj[datas.link] = datas.url;
    var last = JSON.stringify(JsonObj);
    fs.writeFile("./db/dwz.json", last, function() {
      console.log("success");
    });
    var dataSuccess = { status: "success", msg: "成功鸟" };
    res.render("index", {
      title: "短网址",
      msg: "添加成功",
      url: datas.link
    });
    res.end(JSON.stringify(dataSuccess));
  } else {
    var dataError = { status: "error", msg: "重名辣" };
    res.render("index", {
      title: "短网址",
      msg: "重名辣",
      url: ""
    });
    // res.end(JSON.stringify(dataError));
  }
});

module.exports = router;
