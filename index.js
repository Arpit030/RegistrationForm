const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port =process.env.PORT || 3000;
const username = process.env.MONGODB_Username;
const password = process.env.MONGODB_Password;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.f976wkg.mongodb.net/RegistrationFormDB`);

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration",registrationSchema);



app.get('/', (req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
});

app.post("/register",async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        const existinguser = await Registration.findOne({email: email});
        if(!existinguser){
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            console.log("Registration Successfull");
            res.redirect("/success");
        }
        else{

            console.log("User already exist");
            res.redirect("/failure");
        }
        
    }
    catch(error){
        console.log(error);
        res.redirect("/failure");
    }
});

app.get("/success", (req,res)=>{
    res.sendFile(__dirname+"/pages/success.html")
});
app.get("/failure", (req,res)=>{
    res.sendFile(__dirname+"/pages/failure.html")
});

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});