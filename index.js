const express = require('express');
const moment = require('moment');
const uuid = require('uuid');


// next is is to initialise a varable called app with express

const app = express();

// note that this app has a bunch of properties and methods one of which is listen which is what we need to run the web server. We want to listen on a port

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Hello Kleitos!, Your Server is started and running on', PORT));

//Note that if you opn localhost:5000, you are going to get the outpout: cannot get slash '/', This is because / is the route to thee index page. This means it cannot find a route handler for the slash /, because we have not created any route or endpoint. so to create this , we use app.get

app.get('/', function(req, res){
    //the response object has a method called send that sends output to the browser

    res.send('<h1>Hello Kleitos, welcome to Express Js!</h1>')

});

//Restart server and output will render to the browser. in order to presvent restatrting server, we need to install nodemon as a dev dependencies and to use it we need to change the script in json package from test to start

//Alo, note that in addition to res.send, we could also do res.render, res.json, res.sendfile etc

//path module

const path = require('path');

/*
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

the path module loads the html page. However, this is not the ideal since we hav to put a route manually for every single html page or css page etc.
However, express comes with functionalities to make any folder static. so to make our public folder static...*/





//To setup a static folder, we use app.use. while use is a method to create a middleware

app.use(express.static(path.join(__dirname, 'public')));


//However, express is used more often for dynamic APIs....for example, a simple rest API whre we can rreturn some json..

//First, lets create an array of members(users) as database so that can be retrieved as jsons objects

const members = [
    {id: 1,
    name: 'Cletus Ogah',
    email: 'ogahcletus@gmail.com',
    status: 'active'
},
{
    id: 2,
    name: 'John Doe',
    email: 'john@gmail.com',
    status: 'inactive'
},
{
    id: 3,
    name:'Damian Ogah',
    email:'dominion@gmail.com',
    status: 'active'
},
{
    id: 4,
    name: 'Bob Williams',
    email: 'bob@gmail.com',
    status: 'inactive'
}
]


/*The objective is to return these users as json when we hit the routes '/api/members'....
we could hit the route with React, vue Angular, or with postman so we can get the members data from the database.
*/

//Middleware functions, which are functions that have access to the (req, res)

const logger = (req, res, next) =>{

   // console.log('Hello');
   //Note with this middleware, we can have access to any part of the url with the request object.
   // console.log(req.protocol +':'+ '//' + req.get('host') + req.originalUrl)

    //To put the date and time formatted after it, lets install a third party package called moment which deals with date formatting (npm i moment)

    console.log(req.protocol +':'+ '//' + req.get('host') + req.originalUrl +':'+ moment().format())

    //We can also save the ouput to a file with the fs module if we want to


    next();
};

//In order to initialise your middleware, you need to do app.use().

//init middleware
//app.use(logger);


//Initialise bodyParser Middleware:
app.use(express.json());
app.use(express.urlencoded({extended: false}))






app.get('/api/members',(req, res) => {
    res.json(members);

});

//We can now to use postman.....to get all members from the database array created.

//To get a single member

app.get('/api/members/:id', (req, res) =>{

    

    //res.send(req.params.id) on postman will output 4 if input 4

    /*res.json(members.filter(member => member.id === req.params.id))
    
    Note that the above output will only givee an empty string.
    This is because the member id is a number while the req.params.id sense it as a string because of the === used,
    Therefore we need to wrap it with a parseInt*/

    //    res.json(members.filter(member => member.id === parseInt(req.params.id)))

    //First to give a message that there there is no member with a particular id:

    const found = members.some(member => member.id === parseInt(req.params.id))

    if(found){

        res.json(members.filter(member => member.id === parseInt(req.params.id)))

    } else{

        res.status(400).json({ msg: 'Member id Not Found'})
    }


})


//Note that we can use the router that come with express to put all of the similar routes into a single file called api in a ta folder called routes since not all of our routes can be api whre we can serve jsons


//Lets move on!

//To create additional members, we use a post request:

app.post('/api/members', (req, res) =>{

    //res.send(req.body);

    /*Note that the output on postman yielded nothing even with the 200k http response.
    The reason for this is because we need to use a bodyParser so that we can parse the data we are sending with the body
    so we need to install a third party package bodyParser,
    However, with the newer version of express we dont need to.
    we only need initialize it as done above immediaately after app.use(logger)
    


    so to create a new member and set as an object:
    And since we are not using a database like Mongodb which generates random id for us, lets install the uuid package and require it as done above

   */ 
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'

    }

    //To add a new member, you need to do a check and confirm if the name and email were actually sent with the request using the conditional if statement;

    if(!newMember.name || !newMember.email){

        //then return it as a bad request as the input must have both name and email

        res.status(400).json({msg: 'Please include a name and email'})

    }else{
        members.push(newMember)
    }

    res.json(members);

});



//Update Member

app.put('/api/members/:id', (req, res) =>{
    //We need to check if the member id exist 

    const found = members.some(member => member.id === parseInt(req.params.id))

    if(found){

        const updateMember = req.body;
        members.forEach(member => {
            if(member.id === parseInt(req.params.id)){
                member.name = updateMember.name ? updateMember.name : member.name;
                member.email = updateMember.email ? updateMember.email : member.email;

                res.json({member, msg:'Member Data Updated!'});
            }
        })

    } else{

        res.status(400).json({ msg: 'Member id Not Found'})
    }


});



//Delete Member
app.delete('/api/members/:id', (req, res) =>{
    //We need to check if the member id exist 

    const found = members.some(member => member.id === parseInt(req.params.id))

    if(found){

        res.json({msg: 'member deleted!', 
        members:members.filter(member => member.id !== parseInt(req.params.id))})

    } else{

        res.status(400).json({ msg: 'Member id Not Found'})
    }


})   


//lets move on to rendering template using template engines. There are different types of template engines e.g express handlebars
