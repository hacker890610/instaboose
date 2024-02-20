import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { atom, useAtom } from 'jotai';



// Atoms
const userAtom = atom(null);
const isLoggedInAtom = atom(false);

// Components
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user] = useAtom(userAtom);

  const handlePost = (text) => {
    setPosts([...posts, { text, author: user.username, date: new Date().toISOString() }]);
  };

  return (
    <div>
      <h1>Instaboose</h1>
      {user && <UserGreeting user={user} handlePost={handlePost} />}
      <Posts posts={posts} />
    </div>
  );
};

const UserGreeting = ({ user, handlePost }) => (
  <div>
    <h2>Hello, {user.username}!</h2>
    <textarea rows="4" cols="50" placeholder="What's on your mind?" onChange={(e) => handlePost(e.target.value)} />
  </div>
);

const Posts = ({ posts }) => (
  <div>
    {posts.map((post, index) => (
      <Post key={index} post={post} />
    ))}
  </div>
);

const Post = ({ post }) => (
  <div>
    <p>
      <Link to={`/profile/${post.author}`}>{post.author}</Link> - {post.date}
    </p>
    <p>{post.text}</p>
  </div>
);

const Profile = ({ match }) => {
  const username = match ? match.params.username : null;
  const [user, setUser] = useAtom(userAtom);
  const [newUsername, setNewUsername] = useState(user ? user.username : '');

  const handleUpdateProfile = () => {
    setUser({ username: newUsername });
  };

  return (
    <div>
      {username && <UserProfile username={username} user={user} newUsername={newUsername} handleUpdateProfile={handleUpdateProfile} setNewUsername={setNewUsername} />}
    </div>
  );
};

const UserProfile = ({ username, user, newUsername, handleUpdateProfile, setNewUsername }) => (
  <>
    <h2>Profile of {username}</h2>
    {user && user.username === username && (
      <div>
        <p>Edit your profile here</p>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>
    )}
  </>
);

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [, setUser] = useAtom(userAtom);

  const handleLogin = async () => {
    setIsLoggedIn(true);
    setUser({ username });
  };

  return <AuthForm title="Login" username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleSubmit={handleLogin} />;
};

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [, setUser] = useAtom(userAtom);

  const handleRegister = () => {
    setIsLoggedIn(true);
    setUser({ username });
  };

  return <AuthForm title="Register" username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleSubmit={handleRegister} />;
};

const AuthForm = ({ title, username, setUsername, password, setPassword, handleSubmit }) => (
  <div>
    <h2>{title}</h2>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleSubmit}>{title}</button>
  </div>
);

const LogoutButton = () => {
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [, setUser] = useAtom(userAtom);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

const App = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <LogoutButton />
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};



export default App;