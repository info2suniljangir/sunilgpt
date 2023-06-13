const PORT = 8000;
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv"
const app = express();
import fetch from "node-fetch"

app.use(express.json())
app.use(cors())

dotenv.config();

const API_KEY = process.env.REACT_APP_API_KEY;

app.get("/", (req,res) => {
    res.send("<h1>hello</h1>")
})

app.post("/completion", async (req, res) => {

    const options = {
        method : "POST",
        headers : {
            'Authorization' : "Bearer "+API_KEY,
            "Content-Type" :  "application/json",
        },
        body : JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    }
    
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options)
        const data = await response.json()
        res.send(data)
       
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log("server is running on port : "+PORT)
})
