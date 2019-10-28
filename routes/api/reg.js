let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");
let fs = require("fs");
let pathLib = require("path");
let bcrypt = require("bcryptjs");

router.post("/",(req,res,next)=>{
    // console.log("reg");
    let {username,password,icon,nikename} = req.body;
    //username/password为必传参数
    if(!username || !password){
        res.send({err:1,msg:"用户名和密码为必传参数"});
        return;
    }
    let follow = 0;
    let fans = 0;
    let time = Date.now();//生成注册时间
    nikename = nikename || "系统生成";//借助第三方昵称生成库
    password = bcrypt.hashSync(password,10); //密码加密

   // console.log('reg',req.file);// multer === dest  req.files   multer ===storage req.file
  if(!req.file && req.files.length>0 ){
    //改名 整合路径 存到 icon
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext;
  }else{
    icon = '/upload/noimage.png';
  }


    //兜库 校验信息
    mgdb({
        collectionName:'user',
        // dbName:dbName || "1905"
    },(collection,client)=>{
        collection.find({
            username
        },{

        }).toArray((err,result)=>{
            if(!err){
                //不通过，用户名已存在
                if(result.length>0){
                    res.send({err:1,msg:"用户名已存在"});
                    fs.unlinkSync('./public'+icon);//用户名存在时，icon不能再传进来
                    client.close();
                }else{
                    //通过 将数据插入到数据库里面 返回插入后的数据
                    collection.insertOne({
                        username,password,nikename,follow,fans,time,icon
                    },(err,result)=>{
                        if(!err){
                            // req.session[key] = result.insertedId;
                            delete result.ops[0].password
                            res.send({err:0,msg:"注册成功",data:result.ops[0]});
                        }else{
                            res.send({err:1,msg:"user集合操作失败"});
                            client.close();
                        }
                    })
                }
            }else{
                res.send({err:1,msg:"user集合操作失败"});
                client.close();
            }
        })
    })
})

module.exports = router;