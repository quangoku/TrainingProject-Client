"use client";
import PostComponent from "@/components/Post";
import NoReply from "./NoReply";
import { useEffect, useState } from "react";
import { Post } from "@/types/api/Post";
import { getRepliesByPostId } from "@/lib/actions/post";

export default function RepliesList({ postId }: { postId: number }) {
  const [replies, setReplies] = useState<Post[] | null>(null);
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await getRepliesByPostId(postId);
        setReplies(response);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };
    fetchReplies();
  }, []);
  return (
    <div className="mt-4 flex flex-col">
      {replies?.length > 0 ? (
        replies?.map((reply) => {
          return (
            <div
              key={reply.id}
              className="border-b border-white/5 last:border-0"
            >
              <PostComponent post={reply} />
            </div>
          );
        })
      ) : (
        <div className="py-10 opacity-60">
          <NoReply />
        </div>
      )}
    </div>
  );
}
