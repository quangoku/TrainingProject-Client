"use client";
import Post from "@/components/Post";
import { getSavedPosts } from "@/lib/actions/post";
import { useEffect, useState } from "react";

export default function SavedPostList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchSavedPosts() {
      const savedPosts = await getSavedPosts();
      setPosts(savedPosts);
    }
    fetchSavedPosts();
  }, []);
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <Post post={post} key={post?.id} />)
      ) : (
        <p className="text-center text-2xl font-bold">No saved posts</p>
      )}
    </div>
  );
}
