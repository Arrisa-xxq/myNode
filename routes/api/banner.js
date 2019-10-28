let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");

router.get("/",(req,res,next)=>{
    console.log("banner");
    mgdb({
        url:"mongodb://127.0.0.1:27017",
        dbName:"1905",
        collectionName:"banner"
    },(collection,client)=>{
        collection.find({},{}).toArray((err,result)=>{
            if(!err){
                res.send({err:0,msg:"成功",data:result});
            }else{
                res.send({err:1,msg:"失败"});
            }
        })
    })
})
router.get("/:_id",(req,res,next)=>{
    console.log("banner_id");
    // console.log(req.params._id);
    let _id = req.params._id;
    mgdb({
        url:"mongodb://127.0.0.1:27017",
        dbName:"1905",
        collectionName:"banner"
    },(collection,client,ObjectId)=>{
        collection.find({
            _id:ObjectId(_id)
        },{}).toArray((err,result)=>{
            if(!err){
                res.send({err:0,msg:"成功",data:result[0]});
            }else{
                res.send({err:1,msg:"失败"});
            }
        })
    })
})
module.exports = router;