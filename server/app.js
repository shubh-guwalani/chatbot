// node --version # Should be >= 18
// npm install @google/generative-ai

import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold} from "@google/generative-ai";
import bodyParser from 'body-parser';
import PromptSync from 'prompt-sync';
import { data,parts } from './data.js';

let prompt=PromptSync()

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
}))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))

  
  // const txt = "i'm planning to have baby, so i have to quit smoking- but its hard. sometimes its not a physical need , its mental. I cannot help myself from thinking about smoking. what can i do to get rid of this addiction?"
  
  let chat;
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyAMezxCPgQ8w8YoybnIbQQ7JgSPoSyb8Sk";
  
  async function run(txt) {
    const genAI = await new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    
  

//     const result = await model.generateContentStream(txt,{
//       contents: [{ role: "user", parts }],
//       generationConfig,
//       safetySettings,
//     });
// // print text as it comes in
//     for await (const chunk of result.stream) {
//     const chunkText = chunk.text();
//     console.log(chunkText);
//     }
  
    chat = model.startChat({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

  }

  async function work(txt){
    console.log(txt);
    const result = await chat.sendMessage(txt)
    const response = result.response;
    
    return response.text()
  }

  run();

  app.post("/",async (req,res)=>{
    const input = req.body.text
    // console.log(input);
    const result = await work(input+" Use this as the basis of your answer and answer in less than 500 words - "+data.chatbot_promp)
    console.log(result);
    res.send(result)
  })


  app.listen(8000,(err)=>{
    if(!err){
        console.log("Server listening on port "+(8000));
    }
    else{
        console.log(err);
    }
})