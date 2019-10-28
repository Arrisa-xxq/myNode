let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");
let bcrypt = require("bcryptjs");

router.post("/",(req,res,next)=>{
    // console.log("login",req.body); //login [Object: null prototype] { _page: 0, _limit: 10, q: '', _sort: undefined }

    let {username,password} = req.body;
    //username/password 是必传参数 不传    
    if(!username || !password){
        res.send({err:1,msg:"用户名和密码为必传参数"});
        return;
    }

    //兜库校验username/password
    mgdb({
        collectionName:"user"
    },(collection,client)=>{
        collection.find({
            username
        },{
            projection:{username:0}
        }).toArray((err,result)=>{
            if(!err){
                console.log(result);
                if(result.length>0){
                    let pass = bcrypt.compareSync(password,result[0].password); //解密
                    if(pass){
                        let userdata = result[0];
                    //通过 中cookie 留session 返回用户数据
                    req.session["newsapp_user_session"]=userdata._id;
                    res.send({err:0,msg:"登陆成功",data:userdata});
                    }else{
                        //不通过，返回错误信息
                    res.send({err:1,msg:"用户名或者密码有误"});
                    }
                   
                }else{
                    res.send({err:1,msg:"用户名不存在"});
                }  
                client.close();
            }else{
                res.send({err:1,msg:"user集合操作失败"});
                client.close();
            }
        })
    })
})
module.exports = router;