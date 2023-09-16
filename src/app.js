const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers");
const { json } =require("express");
const async = require("hbs/lib/async");

const port= process.env.PORT || 3000

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path));
app.set("view engine", "hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register", (req,res) =>{
    res.render("register.hbs");
})

app.get("/login", (req,res) =>{
    res.render("login.hbs");
})


// app.post("/register", async (req, res) => {
//     try {
//         const password = req.body.password;
//         const cpassword = req.body.confirmpassword;

//         if (password === cpassword) {
//             // Check if the email already exists in the database
//             const existingUser = await Register.findOne({ email: req.body.email });

//             if (existingUser) {
//                 return res.status(400).send("Email already exists");
//             }

//             // Create a new user if the email doesn't exist
//             const registerPerson = new Register({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: password,
//                 confirmpassword: cpassword
//             });

//             const registered = await registerPerson.save();
//             res.status(201).send(`Database Updated: ${registered}`);
//         } 
//         else 
//         {
//             res.status(400).send("Password is not matching");
//         }
//     } catch (error) {
//         res.status(500).send("Internal Server Error");
//     }
// });

//////////////////////////////////
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            // Check if the email already exists in the database
            const existingUser = await Register.findOne({ email: req.body.email });

            if (existingUser) {
                return res.status(400).send("Email already exists");
            }

            // Create a new user if the email doesn't exist, including the location field
            const registerPerson = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword,
                location: req.body.location // Include the location field
            });

            const registered = await registerPerson.save();
            res.status(201).send(`Database Updated: ${registered}`);
        } else {
            res.status(400).send("Password is not matching");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

//////////////////////////////////



//LOGIN CHECK

app.post("/login", async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        
       // console.log(`Email is ${email} and Password is ${password}`);
        const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);
        // console.log(useremail);
        if (useremail.password === password) 
        {
            res.status(201).render("index")
        }
        else
        {
            res.send("Invalid Email Or Password")
        }
       
    } catch (error) {
        res.status(400).send("Invalid Email Or Password")
    }
})

app.listen(port,()=>{
    console.log(`Server is Running at Port No. ${port}`)
})