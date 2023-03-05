import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/post/' + id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ title, summary, id }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />
  }

  return (
    <form className="update-post-form" onSubmit={updatePost}>
      <input name="title"
        placeholder={'Title'}
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <textarea name="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={e => setSummary(e.target.value)} />
      <button>Update post</button>
    </form>
  );
}