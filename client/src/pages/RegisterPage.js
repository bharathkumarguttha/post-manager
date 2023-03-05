import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setUserType] = useState('general');
  async function register(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, type }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('Registration Successful');
    } else {
      alert('Registration Failed');
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
        placeholder="Please provide your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required />
      <input type="password"
        placeholder="Please provide your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required />
      <label className="user-select-area">
        User type (General/Admin):
        <select className='user-type' value={type} onChange={e => setUserType(e.target.value)}>
          <option value='general'>I am a General User</option>
          <option value='admin'>I am an Admin</option>
        </select>
      </label>
      <button>Register</button>
    </form>
  );
}