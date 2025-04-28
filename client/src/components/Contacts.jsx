import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { UserContext } from './UserContext';
import Chat from './Chat';

function Contacts() {
  const [contactList, setContactList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const userEmail = currentUser?.email; // Clerk useremail
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [mongoUserId, setMongoUserId] = useState('');
  const [selectedContact, setSelectedContact] = useState(null); // New state to store selected contact
  
  // Fetch MongoDB userId using Clerk's email
  useEffect(() => {
    if (userEmail) {
      async function fetchMongoUserId() {
        try {
          const res = await axios.get(`http://localhost:1234/user-api/get-user-by-email/${userEmail}`);
          setMongoUserId(res.data.payload); // MongoDB _id
        } catch (err) {
          console.error("Error fetching MongoDB userId", err);
          setError('Failed to fetch MongoDB userId');
        }
      }
      fetchMongoUserId();
    }
  }, [userEmail]);

  // Fetch all users excluding current user and existing contacts
  useEffect(() => {
    if (userEmail) {
      async function fetchAllUsers() {
        try {
          const res = await axios.get('http://localhost:1234/user-api/all-users');
          const all = res.data.payload;

          // Exclude current user and already added contacts
          const filteredUsers = all.filter(
            user =>
              user.email !== userEmail &&
              !contactList.some(contact => contact._id === user._id)
          );

          setAllUsers(filteredUsers);
        } catch (err) {
          console.error("Failed to fetch all users:", err);
        }
      }

      fetchAllUsers();
    }
  }, [userEmail, contactList]);
  
  // Fetch contacts for MongoDB userId
  useEffect(() => {
    if (mongoUserId) {
      async function getContactList() {
        try {
          const res = await axios.get(`http://localhost:1234/user-api/user/${mongoUserId}/contacts`);
          if (res.data.message === 'Contacts fetched successfully') {
            setContactList(res.data.payload);  // List of contact user objects
          } else {
            setError(res.data.message);
          }
        } catch (err) {
          console.error('Error fetching contacts:', err);
          setError('Something went wrong while fetching contacts.');
        } finally {
          setLoading(false);
        }
      }
      getContactList();
    }
  }, [mongoUserId]);

  async function handleAddToContacts() {
    if (!selectedUserId || !mongoUserId) return;
  
    try {
      const res = await axios.post(`http://localhost:1234/user-api/user/${mongoUserId}/contacts/add`, {
        contactUserId: selectedUserId,
      });
  
      if (res.data.success) {
        alert('Contact added!');
        // Optionally refresh contact list
        setContactList(prev => [...prev, res.data.payload]);
        // Remove the added user from dropdown
        setAllUsers(prev => prev.filter(user => user._id !== selectedUserId));
        setSelectedUserId('');
      } else {
        alert(res.data.message || 'Failed to add contact');
      }
    } catch (err) {
      console.error('Error adding contact:', err);
      alert('Error occurred while adding contact.');
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Contacts</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="userDropdown">Add New Contact:</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <select
            id="userDropdown"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="" className='form-control'>Select user</option>
            {allUsers.map(user => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
          <button onClick={handleAddToContacts} disabled={!selectedUserId}>
            Add to Contacts
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
  <div 
    style={{
      ...styles.contactsList,
      flex: selectedContact ? 2 : 3, // SMALLER when chat selected
      transition: 'flex 0.3s ease',
      minWidth: '250px', // (optional) don't shrink contacts too much
    }}
  >
    {loading ? (
      <p>Loading contacts...</p>
    ) : error ? (
      <p style={styles.error}>{error}</p>
    ) : contactList.length === 0 ? (
      <p style={styles.noContacts}>No contacts found.</p>
    ) : (
      <ul style={styles.list} className='w-100'>
        {contactList.map((contact) => (
          <li key={contact._id} style={styles.card}>
            <img
              src={contact.profilePictureUrl || 'https://via.placeholder.com/40'}
              alt={contact.username}
              style={styles.avatar}
            />
            <div style={{flexGrow:1}}>
              <p style={styles.name}>{contact.firstName} {contact.lastName}</p>
              <p style={styles.email}>{contact.email}</p>
              <p style={styles.status}>
                <span style={{ ...styles.statusDot, ...getStatusStyle(contact.status) }}></span>
                {contact.status}
              </p>
              <button style={{ marginLeft: 'auto' }} onClick={() => setSelectedContact(contact)}>
                Chat
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Render Chat component if selectedContact is not null */}
  {selectedContact && (
    <div 
      style={{
        ...styles.chatContainer,
        flex: 5, // BIGGER chat window
        transition: 'flex 0.3s ease',
        minWidth: '500px', // (optional) ensure decent size
      }}
    >
      <Chat selectedContact={selectedContact} />
    </div>
  )}
      </div>
    </div>
  );
}

// Basic styles
const styles = {
  container: { width: '1100px', margin: '20px auto', padding: '1rem' },
  heading: { fontSize: '24px', marginBottom: '1rem' },
  error: { color: 'red' },
  noContacts: { fontStyle: 'italic' },
  list: { listStyle: 'none', padding: 0 },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: { margin: 0, fontWeight: 'bold' },
  email: { 
    margin: 0, 
    fontSize: '0.9rem', 
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '150px', // or 180px, you can adjust
    display: 'block'
  },
  
  status: { margin: '0.3rem 0', fontSize: '0.85rem' },
  statusDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginRight: '5px',
    borderRadius: '50%',
  },
  mainContent: { display: 'flex', gap: '2rem' },
  contactsList: { flex: 1 },
  chatContainer: { flex: 1, borderLeft: '2px solid #ddd', paddingLeft: '1rem' },
};

function getStatusStyle(status) {
  switch (status) {
    case 'online':
      return { backgroundColor: 'green' };
    case 'offline':
      return { backgroundColor: 'gray' };
    case 'busy':
      return { backgroundColor: 'red' };
    case 'away':
      return { backgroundColor: 'orange' };
    default:
      return { backgroundColor: '#ccc' };
  }
}

export default Contacts;
