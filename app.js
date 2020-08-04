const express = require('express');
const request = require('request');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

//Bodyparser Middleware
app.use(bodyparser.urlencoded({extended: true}));

// Signup Route
app.post('/signup', (req, res)=> {
    const { firstName, lastName, email } = req.body;
    
    //make sure fields are filled
    if(!firstName || !lastName || !email){ 
        // res.send('Failed');
        res.sendFile(path.join(__dirname + '/fail.html'));
        return; 
    } 

    //construct req data
    const data = {
        members:  [
            {
                email_address:email,
                status:'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);
    const options = {
        url:'https://us17.api.mailchimp.com/3.0/lists/b007a76545',
        method:'POST',
        headers: {
            Authorization: 'auth e5ab35d137b913af1e3ca88db2082563-us17'
        },
        body: postData

    };

    request(options, (err, response, body ) =>{ 
        if(err) {
            console.log(err);
            res.sendFile(path.join(__dirname + '/fail.html'));
        } else {
            if (response.statusCode === 200){   
                res.sendFile(path.join(__dirname + '/sucess.html'));
            } else {
                res.sendFile(path.join(__dirname + '/fail.html'));
            }
        } 
    });
    
});

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname + '/signup.html')); 
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on ${PORT}`));
