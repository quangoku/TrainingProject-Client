"use client";
import { useEffect, useRef, useState } from "react";
import PostComponent from "./Post";
import { Loader2 } from "lucide-react"; // Đổi sang Loader2 để có hiệu ứng xoay mượt hơn
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
      // Thêm một chút delay nhẹ để tránh giật lag UI khi mạng quá nhanh
      setTimeout(() => setLoading(false), 300);
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
      { threshold: 0.1 }, // Giảm threshold xuống để trigger sớm hơn một chút, tạo cảm giác mượt
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [nextCursor, loading]); // Thêm loading vào dependency để đảm bảo observer hoạt động chuẩn

  return (
    <div className="flex flex-col w-full">
      {/* Container bài viết: Thêm hiệu ứng fade-in khi có bài mới */}
      <div className="flex flex-col animate-in fade-in duration-700">
        {posts.map((post) => (
          <PostComponent post={post} key={post.id} />
        ))}
      </div>

      {/* INFINITE SCROLL AREA */}
      {nextCursor !== null && (
        <div
          ref={loadMoreRef}
          className="py-10 text-center flex flex-col items-center justify-center gap-2"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-gray-800/60" size={24} />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                Đang tải thêm
              </span>
            </div>
          ) : (
            // Một vạch kẻ tinh tế thay vì chữ "Load more" thô cứng
            <div className="w-1 h-1 rounded-full bg-gray-800" />
          )}
        </div>
      )}

      {/* FOOTER MESSAGE: Khi đã hết bài viết */}
      {nextCursor === null && posts.length > 0 && (
        <div className="py-12 text-center">
          <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.3em]">
            Bạn đã xem hết bài viết
          </p>
        </div>
      )}
    </div>
  );
}
