const Express = require('express');
const express= new Express();
const bodyParser = require('body-parser');
const cors = require('cors');
// connection factory
const knex = require('knex');
const config = require('./knex.js');
const dbClient = knex(config);

const jwtMiddle = require('express-jwt-middleware')
const jwtCheck = jwtMiddle('secret')

const jwt = require('jsonwebtoken');

express.use(cors());
express.use(bodyParser.json());


async function getallJob(request,response){
    try{
        var column = '*'
        var table = 'USERS'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('USERS').select();
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}
async function getCustomers(request,response){
    console.log("here")
    try{
        var column = '*'
        var table = 'USERS'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('CUSTOMERS').select();
//ad-hoc request
    // const data = await dbClient('CUSTOMERS').join('SALES','CUSTOMERS.CUST_ID','=','SALES.CUST_ID').
    // select('CUST_FIRST_NAME','CUST_LAST_NAME','CUST_MAIN_PHONE_NUMBER','AMOUNT_SOLD')
    // .orderBy('SALES.AMOUNT_SOLD', 'DESC').limit(10);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}
async function getSales(request,response){
    console.log("here")
    try{
        var column = '*'
        var table = 'USERS'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('SALES').sum('AMOUNT_SOLD as amount');
//ad-hoc request
    // const data = await dbClient('CUSTOMERS').join('SALES','CUSTOMERS.CUST_ID','=','SALES.CUST_ID').
    // select('CUST_FIRST_NAME','CUST_LAST_NAME','CUST_MAIN_PHONE_NUMBER','AMOUNT_SOLD')
    // .orderBy('SALES.AMOUNT_SOLD', 'DESC').limit(10);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}
async function getQuantitySales(request,response){
    console.log("here")
    try{
        var column = '*'
        var table = 'USERS'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('SALES').sum('QUANTITY_SOLD as quantity');
//ad-hoc request

    // const data = await dbClient('CUSTOMERS').join('SALES','CUSTOMERS.CUST_ID','=','SALES.CUST_ID').
    // select('CUSTOMERS.CUST_FIRST_NAME || ' ' || CUSTOMERS.CUST_LAST_NAME','CUSTOMERS.CUST_MAIN_PHONE_NUMBER'). Sum('AMOUNT_SOLD')
   // .groupBy('CUSTOMERS.CUST_FIRST_NAME','CUSTOMERS.CUST_LAST_NAME','SALES.CUST_ID')
    // .orderBy('SALES.AMOUNT_SOLD', 'DESC').limit(10);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
    }
     async function getImportantSales(request,response){
         console.log("here")
         try{
             var column = '*'
             var table = 'USERS'
         // const data = await dbClient.raw('select ' + column +' from '+table);
        //  const data = await dbClient('SALES').sum('QUANTITY_SOLD as quantity');
     //ad-hoc request
     
         const data = await dbClient('CUSTOMERS').join('SALES','CUSTOMERS.CUST_ID','=','SALES.CUST_ID').
         select('CUSTOMERS.CUST_FIRST_NAME  ',' CUSTOMERS.CUST_LAST_NAME ' ,'CUSTOMERS.CUST_MAIN_PHONE_NUMBER')
        .groupBy('CUSTOMERS.CUST_FIRST_NAME','CUSTOMERS.CUST_LAST_NAME', 'CUSTOMERS.CUST_MAIN_PHONE_NUMBER','SALES.CUST_ID')
        .sum('SALES.AMOUNT_SOLD as amt')
         .orderBy('amt', 'DESC')
         .limit(10);

         
    // const data = await dbClient('CUSTOMERS').join('SALES','CUSTOMERS.CUST_ID','=','SALES.CUST_ID').
    // select('CUST_FIRST_NAME','CUST_LAST_NAME','CUST_MAIN_PHONE_NUMBER','AMOUNT_SOLD')
    // .orderBy('SALES.AMOUNT_SOLD', 'DESC').limit(10);
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
        var table = 'USERS'
    // const data = await dbClient.raw('select ' + column +' from '+table);
    const data = await dbClient('USERS').where('ID',id).del();
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}

async function insertJob(request,response){
    console.log("I'm here")
    try{
        const id = await dbClient('USERS').count('ID as CNT');
        const newId = id[0].CNT+1;
        const username = request.body.username;
        const password = request.body.password;
        const payload = {
            ID:newId,
            USERNAME:username,
            PASSWORD:password
        }
        // var column = '*'
        // var table = 'USERS'
    const data = await dbClient('USERS').insert(payload);
     response.json({
        success: 'true',
        data : data
     })
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
        var table = 'USERS'
    const data = await dbClient('USERS').where('ID',id).update(payload);
     response.json(
         data
     )
    }
     catch(err){
         response.json(err)
     }
}


async function authenticate(request, response, next) {
    console.log("I'm hit")
    const authpassword = request.body.password;
    const authusername = request.body.username;
    const data = await dbClient
        .table('USERS')
        .first('PASSWORD as password')
        .where('USERNAME', authusername); //username is set from the if else condition to match table column
        
        // const data ='a';
    if (!data) {
        response.json({
            success: 'false',
            message: 'No User Found!!'
        })
    }
    else {
        const dbpassword = data.password;
        // const dbpassword = "shiva"; 
        // console.log(dbpassword[0].password)
        if (authpassword == dbpassword) {
            // if('shiva'=='shiva'){ //comment this line for online connection
            const token = jwt.sign({ username: authusername }, 'secret');
            response.json({
                success: 'true',
                message: 'Welcome, ' + authusername,
                accessToken: token
            })
        }
        else {
            response.json({
                success: 'false',
                message: 'Invalid Credentials!!'
            })
        }
    }

}

express.get('/api/v1/job', getallJob);
express.post('/api/v1/job', insertJob);
express.delete('/api/v1/job', deleteJob);
express.put('/api/v1/job', editJob);
express.post('/login', cors(), authenticate);
express.get('/api/job/customers', getCustomers);
express.get('/api/job/sales', getSales);
express.get('/api/job/quantitysales', getQuantitySales);
express.get('/api/job/impsales', getImportantSales);

express.listen(4000,'localhost',()=>{
    console.log("running on port 4000")
})