import React, { useState, useEffect } from 'react';
import ActionCable from 'actioncable';
import axios from 'axios';

interface ChatMessage {
   username: string;
   content: string;
}

const useChatWebSocket = (setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
   useEffect(() => {
      const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
      const chatSubscription = cable.subscriptions.create(
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
         chatSubscription.unsubscribe();
         cable.disconnect();
      };
   }, [setMessages]);
};

const ChatApp: React.FC = () => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [newMessage, setNewMessage] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [subscription, setSubscription] = useState<any | null>(null);

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

   useChatWebSocket(setMessages);

   useEffect(() => {
      const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
      const chatSubscription = cable.subscriptions.create({ channel: 'ChatChannel' });

      setSubscription(chatSubscription);

      return () => {
         cable.disconnect();
      };
   }, []);

   const sendMessage = () => {
      if (subscription && username.trim() && newMessage.trim()) {
         subscription.perform('speak', {
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
