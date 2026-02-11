"use client";
import PostComponent from "@/components/Post";
import { getSavedPosts } from "@/lib/actions/post";
import { Post } from "@/types/api/Post";
import { useEffect, useState } from "react";

export default function SavedPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
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
        posts.map((post) => <PostComponent post={post} key={post?.id} />)
      ) : (
        <p className="text-center text-2xl font-bold">No saved posts</p>
      )}
    </div>
  );
}
