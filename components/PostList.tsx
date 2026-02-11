"use client";
import { useEffect, useRef, useState } from "react";
import PostComponent from "./Post";
import { Loader } from "lucide-react";
import { getPosts } from "@/lib/actions/post";
import { Post } from "@/types/api/Post";

interface InitData {
  posts: Post[];
  nextCursor: string | null;
}

export default function PostList({ initData }: { initData: InitData }) {
  const [posts, setPosts] = useState<Post[]>(initData.posts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initData.nextCursor,
  );
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (cursor?: string | null) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await getPosts(cursor || "");

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUniquePosts = res.posts.filter(
          (p: Post) => !existingIds.has(p.id),
        );
        return [...prev, ...newUniquePosts];
      });

      setNextCursor(res.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadMoreRef.current || nextCursor === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [nextCursor]);

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostComponent post={post} key={post.id} />
      ))}
      {nextCursor !== null && (
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
