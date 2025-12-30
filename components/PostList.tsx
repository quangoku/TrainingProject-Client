"use client";
import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import { getPost } from "@/lib/actions/post";
import { Loader } from "lucide-react";
interface User {
  image: string;
  username: string;
  id: number;
}

interface Post {
  id: number;
  content: string;
  author: User;
  likes_count: number;
  replies_count: number;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (cursor?: string | null) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await getPost(cursor || "");

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUniquePosts = res.posts.filter(
          (p: Post) => !existingIds.has(p.id)
        );
        return [...prev, ...newUniquePosts];
      });

      setNextCursor(res.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [nextCursor]);

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {nextCursor && (
        <div
          ref={loadMoreRef}
          className="py-4 text-center flex justify-center text-gray-400"
        >
          {loading ? <Loader size={20} /> : "Load more"}
        </div>
      )}
    </div>
  );
}
