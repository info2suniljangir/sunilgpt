import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [value, setValue] =  useState("")
  const [message, setMessage] = useState(null);
  const [previousChat, setPreviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState()
  
  
  


  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }
  
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")  
  }


  const feedContainer = document.querySelector('.feed');
  const handleScroll = () => {
    feedContainer.scrollTop = feedContainer.scrollHeight;
  }
  
  if(feedContainer.scrollTop === feedContainer.scrollHeight) {
    const scrollDownBtn = document.getElementById("scroll-down")
    scrollDownBtn.remove()
  }

  const getMessages = async () => {
    
 
    const options = {
      method : "POST",
      body : JSON.stringify({
        message : value,
      }),
      headers : {
        "Content-Type" : "application/json",
      }
    }
    
    try {
      const response = await fetch("http://localhost:8000/completion", options)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
    
  }
  
 

  useEffect(() => {
    
    if(!currentTitle  && message) {
      setCurrentTitle(value)
    }
    if (currentTitle  && message) {
      setPreviousChat((prevChat) => {
        return [
          ...prevChat,
          {
            title: currentTitle,
            role : "user",
            content: value
          },
          {
            title : currentTitle,
            role : message.role,
            content: message.content
          }
        ]
      })
    }
    
  },[message, currentTitle])

  
  const currentChat = previousChat.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles =  Array.from(new Set(previousChat.map(previousChat => previousChat.title)))
  
//scroll
  
  

  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'> 
        {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li> )}
        </ul>
        <nav>
          <p>Made by Sunil Jangir</p>
        </nav>
      </section>


      <section className='main'>
        {!currentTitle && <h1>SunilGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((currentMessage, index) => <li key={index}>
            <p className='role'>{currentMessage.role}</p>
            <p>{currentMessage.content}</p>
          </li>)}
        </ul>


        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)} 
              onKeyDown={(event) => {
                if(event.key === "Enter") {
                  getMessages();
                }
              }}
            />

            <div id='submit' onClick={getMessages}>➢</div>
            <div id="scrollDownBtn" onClick={handleScroll}>⬇</div> 

            <p className='info'>
            This chatbot can provide inaccurate information about peoples, places or facts.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default App;
