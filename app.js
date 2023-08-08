const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url ="https://us14.api.mailchimp.com/3.0/lists/3cb3040c96";
  const options = {
    method:"post",
    auth: "faven:094f0f82e9440f9bccadfbd76f06e142-us14"

  }

  const request = https.request(url, options, function(response){

    if (response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
      console.log(response.statusCode);
    })
  });


  request.write(jsonData);
  request.end();

  app.post("/failure.html", function(req,res){
    res.redirect("/");
  })


  console.log(firstName, lastName, email);
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000...");
});
