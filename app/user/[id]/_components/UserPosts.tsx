"use client";
import PostComponent from "@/components/Post";
import { getPostByUserId } from "@/lib/actions/post";
import { Post } from "@/types/api/Post";
import { useEffect, useState } from "react";

export default function UserPosts({ userId }: { userId: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      const res = await getPostByUserId(userId);
      setPosts(res);
    }
    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostComponent post={post} key={post.id} />
      ))}
    </div>
  );
}
