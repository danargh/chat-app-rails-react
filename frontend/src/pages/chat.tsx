import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import createCable from '../hook/actionCable';

interface ChatMessage {
   username: string;
   content: string;
}

const ChatApp: React.FC = () => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [newMessage, setNewMessage] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const cableRef = useRef<any>(null);
   const subscriptionRef = useRef<any>(null);

   // Fetch message history once on mount
   useEffect(() => {
      const fetchMessages = async () => {
         try {
            const response = await axios.get<ChatMessage[]>('http://localhost:3000/messages');
            setMessages(response.data);
         } catch (error) {
            console.error('Error fetching message history: ', error);
         }
      };

      fetchMessages();
   }, []);

   // Setup Action Cable connection and subscription
   useEffect(() => {
      // Create a cable connection once
      cableRef.current = createCable();

      // Subscribe to the ChatChannel
      subscriptionRef.current = cableRef.current.subscriptions.create(
         { channel: 'ChatChannel' },
         {
            connected() {
               console.log('Connected to ChatChannel');
            },
            disconnected() {
               console.log('Disconnected from ChatChannel');
            },
            received(data: ChatMessage) {
               console.log('New message received: ', data);
               setMessages((prevMessages) => {
                  if (!prevMessages.find((msg) => msg.content === data.content && msg.username === data.username)) {
                     return [...prevMessages, data];
                  }
                  return prevMessages;
               });
            },
         }
      );

      return () => {
         // Clean up subscription and disconnect cable on unmount
         if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
         if (cableRef.current) cableRef.current.disconnect();
      };
   }, []); // Empty dependency array ensures this runs only once

   // Function to send a new message
   const sendMessage = () => {
      if (subscriptionRef.current && username.trim() && newMessage.trim()) {
         subscriptionRef.current.perform('speak', {
            username: username.trim(),
            content: newMessage.trim(),
         });
         setNewMessage('');
         setMessages((prev) => [...prev, { username: username.trim(), content: newMessage.trim() }]);
      } else {
         alert('Please enter a username and message before sending.');
      }
   };

   return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
         <h1>Realtime Chat Application</h1>
         <div>
            <input
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="Enter your username"
               style={{
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100%',
               }}
            />
         </div>
         <div
            style={{
               border: '1px solid #ccc',
               padding: '10px',
               height: '300px',
               overflowY: 'scroll',
               marginBottom: '10px',
            }}
         >
            {messages.map((msg, index) => (
               <div key={index} style={{ marginBottom: '10px' }}>
                  <strong>{msg.username}:</strong> {msg.content}
               </div>
            ))}
         </div>
         <div style={{ display: 'flex', gap: '10px' }}>
            <input
               type="text"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               placeholder="Type your message"
               style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
               }}
            />
            <button
               onClick={sendMessage}
               style={{
                  padding: '10px 20px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
               }}
            >
               Send
            </button>
         </div>
      </div>
   );
};

export default ChatApp;
