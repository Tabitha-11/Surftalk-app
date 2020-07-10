const admin = require('firebase-admin');

const bodyParser=require('body-parser');
const serviceAccount = require('./surfkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://surftalk-98da9.firebaseio.com"
});

const express= require('express');
const app=express();
const cors=require('cors');

app.use(bodyParser.json());
app.use(cors());

const db=admin.firestore();

//signup -------new user->name, emailid, password 
app.post('/signup',async(req,res)=>{
  let userData= await req.body;
  db.collection('users').doc().set(userData).then(()=>{
    console.log("user data stored");
  })
  .catch((err)=>{
    console.log(err);
  })
})


///login page ----registered user->emailid , password
app.get('/login',async(req,res)=>{
  const userdata= db.collection('users');
  let docmailid= await userdata.where ('emailid', '==' , req.body.usermail);
  let docpassword= await userdata.where ('password', '==' , req.body.userpass);
  res.send("redirecting you to the required page......");
  //res.redirect('');
  if(docmailid.empty && docpassword.empty)
  {
    res.send('enter a valid mail and password');
    console.log('seems empty');
  }
  //res.redirect();
  console.log("mailid : "+docmailid + "password : "+password);
})

app.listen(process.env.PORT || 5000, (err)=>{
    if(err){
        console.log("Error starting the server..")
    }
    console.log("Server Listening...")
})