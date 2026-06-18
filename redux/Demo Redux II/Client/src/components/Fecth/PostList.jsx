import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../Redux/postSlice";
import PostForm from "./PostForm";

const PostList = () => {
  const dispatch = useDispatch();
  const { items: posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch]);

  if(loading) return <p>Cargando publicaciones...</p>
  if(error) return <p>Error al cargar las publicaciones: {error}</p>

  return (
    <>
    <PostForm />
      <h1>Publicaciones</h1>
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            id={post.id}
            body={post.body}
          />
        ))}
      </div>
    </>
  );
};
export default PostList;
