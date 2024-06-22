import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import * as Realm from "realm-web";

function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const REALM_APP_ID = process.env.REACT_APP_REALM_ID;
      const app = new Realm.App({ id: REALM_APP_ID });
      const cred = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(cred);
        const allUsers = await user.functions.getAllUsers();

        setUsers(allUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          {users && 
          users.map(user => {
            return <p key={user._id}>{user.name}</p>
          })}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
