const Express = require('express');
const express= new Express();
const bodyParser = require('body-parser');
// var uploadRouter = require('./upload');
// connection factory
const knex = require('knex');
// const oracle = require('oracledb');
// const pg = require ('pg');
// const cors= require('cors');
const config = require('./knex.js');
const dbClient = knex(config);
express.use(bodyParser.json());

express.get('/api/v1/job', getallJob);
express.post('/api/v1/job', insertJob);
express.delete('/api/v1/job', deleteJob);
express.put('/api/v1/job', editJob);

async function getallJob(request,response){
    try{
        var column = '*'
        var table = 'emp'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('EMP').select();
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}
async function deleteJob(request,response){
    try{
        const id = request.body.id;
        var column = '*'
        var table = 'emp'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('EMP').where('ID',id).del();
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}

async function insertJob(request,response){
    console.log(request.body.id)
    try{
        const id = request.body.id;
        const name = request.body.name;
        const payload = {
            ID:id,
            NAME:name
        }
        // var column = '*'
        var table = 'emp'
    const data = await dbClient('EMP').insert(payload);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}

async function editJob(request,response){
    console.log(request.body.id)
    try{
        const id = request.body.id;
        const name = request.body.name;
        const payload = {
            ID:id,
            NAME:name
        }
        // var column = '*'
        var table = 'emp'
    const data = await dbClient('EMP').where('ID',id).update(payload);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}
express.listen(4000,'localhost',()=>{
    console.log("running on port 4000")
})