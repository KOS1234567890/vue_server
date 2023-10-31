const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express()
 
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = "mongodb+srv://minkyu:6L3lCooFyja23Nmh@minkyu.rlol7cf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

//전역변수 생성
let collection;
app.use(express.static('dist'));
//서버 접근 방법
const dbConnect =async ()=>{
    await client.connect();

    //몽고디비에서 설정한 db이름
    const db = client.db('clone_project'); 
    console.log('접속성공!!');


    //몽고디비에서 설정한 컬렉션 이름
    collection = db.collection('count_collection');
}


//서버에서 정보가져오기
app.get('/api',async function (req, res) {
    const result = await collection.find().toArray();
    res.send(result)  
})

//서버에 정보 넣기
app.post('/api/insert',async function (req, res) {
    await collection.insertOne(req.body);
    const result=await collection.find().toArray();
    res.send(result)  
})

//서버에 정보 삭제하기
app.delete('/api/delete',async function (req, res) {
    const {date} = req.query
    await collection.deleteOne({date:Number(date)});
    const result=await collection.find().toArray();
    res.send(result)  
})

//서버에 정보 삭제하기
app.put('/api/update',async function (req, res) {
    const {date} = req.query;
    const {count} = req.body;
    await collection.updateOne({date:Number(date)},{$set:{count}});
    const result=await collection.find().toArray();
    res.send(result)  
})

//3000번대의 서버가 생성되고 dbConnect서버가 만들어짐

app.listen(3000,dbConnect)