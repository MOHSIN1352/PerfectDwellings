import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Chatbot({ onClose }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hi! How can I help you find a property today? You can ask me to find homes or just chat!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      
      // The bot's response will always have text, and might have a link
      const botMessage = {
        sender: 'bot',
        text: data.responseText || "Something went wrong, please try again.",
        link: data.searchUrl, // This will be undefined for conversational replies, which is fine
      };
      setChatHistory((prev) => [...prev, botMessage]);

    } catch (err) {
      const errorMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (link) => {
    navigate(link);
    onClose();
  };

  return (
    <div className='fixed bottom-28 right-8 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col'>
      <div className='bg-slate-700 text-white p-4 rounded-t-lg flex justify-between items-center'>
        <h3 className='font-semibold'>Dweller</h3>
        <button onClick={onClose}><FaTimes /></button>
      </div>
      
      <div className='p-4 h-80 overflow-y-auto flex flex-col gap-4'>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] break-words ${
              chat.sender === 'bot'
                ? 'bg-slate-200 self-start'
                : 'bg-blue-500 text-white self-end'
            }`}
          >
            {chat.text}
            {chat.link && (
              <button
                onClick={() => handleLinkClick(chat.link)}
                className='block mt-2 text-left font-bold text-blue-100 underline hover:text-white'
              >
                View Properties
              </button>
            )}
          </div>
        ))}
        {loading && <div className='p-3 rounded-lg self-start bg-slate-200'>Thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className='p-4 border-t flex gap-2'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message...'
          className='flex-1 border p-2 rounded-lg focus:ring-slate-500 focus:border-slate-500'
          disabled={loading}
          onKeyUp={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg disabled:opacity-50' disabled={loading || !message.trim()}>
          {loading ? '...' : <FaPaperPlane />}
        </button>
      </form>
    </div>
  );
}