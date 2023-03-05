
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: JSON.stringify({ title, summary }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="create-post-form" onSubmit={createNewPost}>
      <input name="title"
        placeholder={'Title'}
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <textarea name="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={e => setSummary(e.target.value)} />
      <button>Create post</button>
    </form>
  );
}