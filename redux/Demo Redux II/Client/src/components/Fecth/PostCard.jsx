import { useState } from "react";
import EditPostForm from "./EditPostForm";

const PostCard = ({ id, title, body }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <EditPostForm
          id={id}
          currentTitle={title}
          currentBody={body}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h4>{id}</h4>
          <h3>{title}</h3>
          <p>{body}</p>
          <button onClick={()=> setIsEditing(true)}>Editar</button>
        </>
      )}
    </>
  );
};

export default PostCard;
