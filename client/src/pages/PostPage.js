import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  const deleteCurrentPost = async () => {
    const userConsentToDelete = window.confirm("Are you sure you want to delete this post");
    if (userConsentToDelete) {
      const response = await fetch('http://localhost:4000/post', {
        method: 'DELETE',
        body: JSON.stringify({ id: postInfo._id }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.status === 200) {
        alert('Deleted Succesfully');
        setRedirect(true);
      } else {
        alert('Failed To Delete Post');
      }
    }
  }

  if (loading) return <div>Post is loading, please wait......</div>
  if (!postInfo) return <div>This post may not be available at this time.Please goto Home page to find more posts.</div>;
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <div className="author">Author:  {postInfo.author.username}</div>
      {(userInfo.id === postInfo.author._id || userInfo.type === 'admin') && (
        <div className="action-row">
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <FontAwesomeIcon icon={faPencilSquare} />
              Edit this post
            </Link>
          </div>
          <div className="delete-row">
            <button className="delete-btn" onClick={deleteCurrentPost}>
              <FontAwesomeIcon icon={faTrash} />
              Delete this Post
            </button>
          </div>
        </div>
      )}
      <div className="summary-container">
        <h3>Summary of the post is:</h3>
        <div className="summary">{postInfo.summary}</div>
      </div>
    </div>
  );
}