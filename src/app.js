const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers");
const OTP = require("./models/otp");
const { json } = require("express");
const async = require("hbs/lib/async");
const { Console } = require("console");

const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(static_path));
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register.hbs");
})

app.get("/login", (req, res) => {
    res.render("login.hbs");
})

app.get("/reset", (req, res) => {
    res.render("reset.hbs");
})

app.get("/verify-otp", (req, res) => {
    const alertMessage = req.query.alertMessage;
    const email = req.query.email; // Get the email value from the query
    res.render("verify-otp", { alertMessage, email }); // Pass the email value to the view
});

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {

            const existingUser = await Register.findOne({ email: req.body.email });

            if (existingUser) {
                return res.status(400).send("Email already exists");
            }


            const registerPerson = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword,
                location: req.body.location
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

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(`Email is ${email} and Password is ${password}`);
        const useremail = await Register.findOne({ email: email });
        console.log(email)

        // res.send(useremail.password);
        // console.log(useremail);
        if (useremail.password === password) {
            res.status(201).render("index")
        }
        else {
            res.send("Invalid Email Or Password")
        }

    } catch (error) {
        res.status(400).send("Invalid Email Or Password")
    }
})



app.post("/reset", async (req, res) => {
    try {
        const email = req.body.email;

        // Check if the email exists in the registration database
        const existingUser = await Register.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        // Check if the email exists in the OTP database
        const existingOtp = await OTP.findOne({ email: email });

        if (existingOtp) {
            // If OTP document already exists, update the OTP
            existingOtp.code = Math.floor(1000 + Math.random() * 9000);
            existingOtp.expireIn = new Date().getTime() + 300 * 1000;
            await existingOtp.save();

            // Redirect to the verify-otp route indicating OTP creation/update success
           
            return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
        } else {
            // If OTP document doesn't exist, create a new OTP
            let otpcode = Math.floor(1000 + Math.random() * 9000);

            const otpData = new OTP({
                email: req.body.email,
                code: otpcode,
                expireIn: new Date().getTime() + 300 * 1000
            });

            await otpData.save();

            // Redirect to the verify-otp route indicating OTP creation/update success
            return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
        }
    } catch (error) {
        console.error(`Database Error: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/verify-otp", async (req, res) => {
    try {
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;
        const email = req.body.email; // Retrieve email from the form data
        

        // Check if the OTP exists and is valid
        const existingOtp = await OTP.findOne({ email: email });

        if (!existingOtp || existingOtp.code !== otp || existingOtp.expireIn < Date.now()) {
            return res.redirect(`/verify-otp?alertMessage=Invalid+or+Expired+OTP&email=${email}`);
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            return res.redirect(`/verify-otp?alertMessage=New+Password+and+Confirm+Password+do+not+match&email=${email}`);
        }

        // Update the user's password in the database
        const user = await Register.findOne({ email: email });
        user.password = newPassword;
        await user.save();
        mailer(email,otp);

        // Password updated successfully
        return res.redirect("/login");
    } catch (error) {
        console.error(`Error in /verify-otp: ${error}`);
        const email = req.body.email;
        res.redirect(`/verify-otp?alertMessage=An+error+occurred&email=${email}`);
    }
});




////////////
const mailer = (email, otp) => {
    const nodemailer = require('nodemailer');

    // Create a transporter for Gmail (you should replace these with your actual Gmail credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodemailer',
            pass: 'lykw mqmg buif xyuk'
        }
    });

    // Email configuration
    const mailOptions = {
        from: 'nodemailer',
        to: 'usmannazir428@gmail.com',//can also use the variable 'email' // Receiver's email address
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}` // The OTP code to be sent in the email
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



///////////

app.listen(port, () => {
    console.log(`Server is Running at Port No. ${port}`)
})