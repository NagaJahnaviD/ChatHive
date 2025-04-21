import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

function Chat({ selectedContact }) {
  const { currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [mongoUserId, setMongoUserId] = useState('');

  useEffect(() => {
    if (currentUser) {
      async function fetchMongoUserId() {
        try {
          const res = await axios.get(`http://localhost:1234/user-api/get-user-by-email/${currentUser.email}`);
          setMongoUserId(res.data.payload); // MongoDB _id
        } catch (err) {
          console.error("Error fetching MongoDB userId", err);
        }
      }
      fetchMongoUserId();
    }
  }, [currentUser]);

  useEffect(() => {
    if (mongoUserId && selectedContact?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:1234/message-api/messages`, {
            params: {
              senderId: mongoUserId,
              recipientId: selectedContact._id
            }
          });
          setMessages(res.data.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [mongoUserId, selectedContact]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const msgData = {
      senderId: mongoUserId,
      recipientId: selectedContact._id,
      text: newMsg,
    };
    console.log("Sending message:", msgData);

    try {
      const res = await axios.post(`http://localhost:1234/message-api/message`, msgData);
      const newMessage = res.data.payload;

      // Ensure consistent format (populate sender manually if needed)
      if (typeof newMessage.sender === 'string') {
        newMessage.sender = { _id: newMessage.sender };
      }

      setMessages(prev => [...prev, newMessage]);
      setNewMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={styles.chatWrapper}>
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
              alignSelf: msg.sender._id === mongoUserId ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender._id === mongoUserId ? '#d1f0ff' : '#eee',
            }}
          >
            {msg.text}
            <div style={styles.timestamp}>
              {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
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
