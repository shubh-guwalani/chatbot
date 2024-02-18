import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios"
import ReactMarkdown from "react-markdown";

function App() {

  const [msg,setMsg] = useState("");
  const [hist,setHist] = useState([]);

console.log(hist);
  const handleSubmit = (e)=>{
    let data={};
    data.user=msg;
    setHist([...hist,msg]);
    axios.post('http://localhost:8000', {
      text:msg,
    })
    .then(function (response) {
      // console.log(response.data);
      data.bot=response.data;
      setHist([...hist,data.user,data.bot]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <>
      <div id="chat-container">
        <h1>Chatbot for Caregivers</h1>
        	
        <div id="chat-history" style={{display:"flex", flexDirection:"column"}} >
          {
            hist.map((e,idx)=>{
              if(idx%2==0){
                return <div style={{display:"block", marginBottom: "10px",marginLeft:"auto"}}>user: {e}</div>

              }
              else{ 
              return<div style={{display:"block", marginBottom: "10px",marginRight:"auto"}}> bot: {e}</div>
              }
            })
          }
        </div>
        <div id="chat-form">
          <input
            type="text"
            id="user-input"
            classname="chatbox"
            placeholder="Enter your message"
            onChange={(e)=>{
              setMsg(e.target.value);
            }}
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
      <div id="loader">
        <img src="loader.gif" width="150px" alt="Loading..." />
      </div>
    </>
  );
}

export default App;
