import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

function Chat({ selectedContact }) {
  const { currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  console.log("Selected Contact in Chat:", selectedContact);
  const currentUserId = currentUser?._id;

  useEffect(() => {
    // console.log("hello",selectedContact)
    if (currentUserId && selectedContact?._id) {
      // Replace with your backend API later
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:1234/message-api/conversation/${currentUserId}/${selectedContact._id}`);
          setMessages(res.data.payload || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [currentUserId, selectedContact]);

  const handleSend = async () => {
    console.log("selected:",selectedContact)
    if (!newMsg.trim()) return;

    const msgData = {
      senderId: currentUserId,
      receiverId: selectedContact._id,
      content: newMsg,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post(`http://localhost:1234/message-api/send`, msgData);
      setMessages(prev => [...prev, res.data.payload]);
      setNewMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={styles.chatWrapper}>
      <p>name:{selectedContact?.firstName}</p>
      <div style={styles.chatHeader}>
        <h3>{selectedContact?.firstName} {selectedContact?.lastName}</h3>
        <p style={{ fontSize: '0.85rem', color: '#555' }}>{selectedContact?.email}</p>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
              backgroundColor: msg.senderId === currentUserId ? '#d1f0ff' : '#eee',
            }}
          >
            {msg.content}
            <div style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatWrapper: {
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    padding: '1rem',
  },
  chatHeader: {
    borderBottom: '1px solid #ccc',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingBottom: '1rem',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    position: 'relative',
  },
  timestamp: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '4px',
    textAlign: 'right',
  },
  inputArea: {
    display: 'flex',
    gap: '0.5rem',
    borderTop: '1px solid #ccc',
    paddingTop: '1rem',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #aaa',
    outline: 'none',
  },
  sendBtn: {
    padding: '10px 15px',
    borderRadius: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Chat;
