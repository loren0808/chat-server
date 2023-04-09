// const mongoose = require('mongoose')
// const md5 = require('blueimp-md5')

// const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/test')


// const userSchema = mongoose.Schema({
//     username: {type: String,require: true},
//     password: {type: String,require: true},
//     type: {type: String,require:true},
//     head:{type: String}
// })
// const UserModel = connection.model('user',userSchema)

// function testSave(){
//     const user = new UserModel({username:'Bob',password:md5('123'),type:'dashen'})
//     user.save().then(doc => console.log(doc))
// }
// function testfind(){
//     //[]
//     UserModel.find({username:'Tombbm'}).then( doc => console.log(doc),err => console.log(err))
// }
// function testUpdate(){
//     UserModel.updateOne({_id:'6427c463e493b2c820fbb700'},
//     {username:'Jack'}).then(oldUser => console.log(oldUser))
// }
// function testDelete(){

//     //{ acknowledged: true, deletedCount: 0 }
//     UserModel.deleteOne({username:'Tomm'}).then(doc => console.log(doc))
// }
// testDelete()

// const promise = new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         reject("失败")
//     },100)
// })
// promise.then(res =>{
//     console.log(res)
//     return Promise.resolve('1')
// },err=>{
//     console.log(err)
//     return Promise.resolve('2')
// }).then(res =>{
//     console.log("成功",res)
// },err=>{
//     console.log("失败",err)
// })