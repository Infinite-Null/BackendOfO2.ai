const express=require('express')
const dotenv = require("dotenv")
const { DiscussServiceClient } = require("@google-ai/generativelanguage")
const { GoogleAuth } = require("google-auth-library")
const bodyParser = require("body-parser")
const app=express()
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}))
app.use(express.json({limit:"50mb"}))
dotenv.config({path: "./.env"})
const Router = express.Router()
Router.route("/Ai").post(async (req, res)=>{
    const API_KEY = process.env.API_KEY
    const MODEL_NAME = "models/chat-bison-001"
    const client = new DiscussServiceClient({
        authClient: new GoogleAuth().fromAPIKey(API_KEY),
    })
    try{
        const result = await client.generateMessage({
           model: MODEL_NAME,
           prompt: {messages:req.body},
       })
        if(result[0].candidates[0].content===""||result[0].candidates[0]===undefined){
            res.status(200).json({
                result:"Success",
                reply:"Sorry! I can't help you with that.",
            })
        }
        else{
            res.status(200).json({
                result:"Success",
                reply:result[0].candidates[0].content,
            })
        }
   }catch (e) {
        res.status(200).json({
            result:"Failed",
            reply:"Sorry! I can't help you with that.",
        })
   }
})
const Router2=express.Router()
Router2.route("/").get((req, res, next)=>{
    res.status(200).json({
        message:"Hello"
    })
})
app.use("/api/v1", Router)
app.use("/",Router2)
module.exports = app