const admin = require('firebase-admin');
const Chat = require('chat-service');
const socket = require('socket.io-client');
const bodyParser=require('body-parser');
const serviceAccount = require('./surfkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://surftalk-98da9.firebaseio.com"
});

const express= require('express');
const app=express();
const cors=require('cors');
const Chat = new Chat ({port},{onConnect})
process.on('SIGHT', ()=> 
chatservice.close().finally(()=>
process.exit()))

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

app.get('/login/home', function onConnect(service, id){
  let { query } = service.transport.getHandshakeData(id)
  let {userName} = query

  res.Promise.resolve(userName)
})

//app.get('/login/home', (req,res)=>{
// chat.hasRoom('default'.then(hasRoom => {
//   if(!hasRoom){
//     res.send(chat.addRoom('default',{owner: 'admin'})  
//   }
// }))


app.post('/login/home/chat', (req,res)=>{
  let url = 'https://internprojectapp.herokuapp.com/login/home/chat'
  let userName = 'user'
  let token = 'token'
  let query = 'userName'=userName+token==token;
  let opts = { query}
  let socket = io.connect(url,opts)
  socket.on('roomMessage', (room, msg) => {
    console.log(`${msg.author}: ${msg.textMessage}`)
  })
   
   socket.on('loginConfirmed', userName => {
    socket.emit('roomJoin', 'default', (error, data) => {
      
      if (error) { return }
      socket.emit('roomMessage', 'default', { textMessage: 'Hello!' })
    })
  })
   
  socket.on('loginRejected', error => {
    console.error(error)
  })

})
app.listen(process.env.PORT || 5000, (err)=>{
    if(err){
        console.log("Error starting the server..")
    }
    console.log("Server Listening...")
})