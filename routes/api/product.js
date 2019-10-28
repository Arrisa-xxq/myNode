let express = require("express");
let router = express.Router();
let mgdb = require("../../utils/mgdb");


//列表查询
let findList = ({apiname,req,res})=>{
    console.log("findList",apiname,req.body,req.query);
    let {_page,_limit,q,_sort} = req.query;
    // let time = Date.now();
    mgdb({
        collectionName:apiname
    },(collection,client)=>{
        collection.find({

        },{
            skip:_page * _limit,
            limit:_limit,
            sort:{[_sort]:1}
        }).toArray((err,result)=>{
            if(!err){
                // collection.insert({time});
                res.send({err:0,msg:"成功",data:result});
            }else{
                res.send({err:1,msg:"操作失败"})
            }
            client.close();
        })
    })
}
//详情查询
let findDetail = ({apiname,req,res,_id})=>{
    console.log("findDetail",apiname,req.body,req.query,_id);
    mgdb({
        collectionName:apiname
    },(collection,client,ObjectId)=>{
        collection.find({
            _id:ObjectId(_id)
        },{}).toArray((err,result)=>{
            console.log('id',result)
            if(!err){
              result.length>0 ? 
                res.send({err:0,msg:'成功',data:result[0]}) :
                res.send({err:1,msg:'查无数据'})
            }else{
              res.send({err:1,msg:'集合操作失败'})
            }
            client.close()
        })
    })
}

router.get("/",(req,res,next)=>{
    console.log("product11",req.rootparams); //product11 home
    let apiname = req.rootparams;
    let _id = req.query._id;
    if(/home|follow|column/.test(apiname)){ //判断是否是这几个接口
        if(_id){
            findDetail({req,res,_id,apiname});
        }else{
            findList({apiname,req,res});
        }
    }else{
        next();
    }
})
router.get("/:_id",(req,res,next)=>{  //子路由
    console.log("product",req.params);
    let apiname = req.rootparams;
    let _id = req.params._id;
    if(/home|follow|column/.test(apiname)){
    findDetail({req,res,_id,apiname});
}else{
    next();
}
})



module.exports = router;
// module.exports = (req,res,next)=>{
//     // console.log("product",req.params); 
//     let apiname = req.params.product;
//     if(/home|follow|column/.test(apiname)){ 
//         findProduct({apiname,req,res})
//     }  
//     next();//保证banner不会被截获
// };