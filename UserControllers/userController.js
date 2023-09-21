


const emailSend = async (req,res)=>{
    res.status(200).json("Ok")
    console.log("emailSend")
}

const changePassword = async (req,res)=>{
    res.status(200).send("Ok")
}



module.exports = {
    emailSend,
    changePassword
}