"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus, X, Loader2 } from "lucide-react";

export default function Upload() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<
    { url: string; type: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index].url);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    setSelectedImages([]);
    setPreviewUrls([]);
    setContent("");
  };

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) return;
    setUploading(true);
    try {
      const signatureResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media/cloudinary/signature`,
      );
      const { data: sigData } = await signatureResponse.json();

      const uploadResults = await Promise.all(
        selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("signature", sigData.signature);
          formData.append("api_key", process.env.NEXT_PUBLIC_CLOUD_API_KEY!);
          formData.append("timestamp", sigData.timestamp);
          formData.append("folder", sigData.folder);

          const resourceType = file.type.startsWith("video/")
            ? "video"
            : "image";
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/${resourceType}/upload`,
            { method: "POST", body: formData },
          );
          const uploadData = await uploadResponse.json();
          return uploadData.secure_url;
        }),
      );

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          media: uploadResults,
          parent_id: null,
        }),
      });

      if (response.ok) {
        clearAll();
        setOpen(false);
      }
    } catch (error) {
      console.error("Lỗi đăng bài:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    // THANH NHẬP NHANH NGOÀI FEED
    <div className="hidden md:flex items-center gap-4 py-6 border-b border-gray-800/50 w-full group">
      <div className="w-10 h-10 rounded-full bg-gray-900 shrink-0 overflow-hidden border border-gray-800 transition-all duration-300 group-hover:border-gray-600">
        <img
          src={user.image || "/bacon.png"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) clearAll();
        }}
      >
        <DialogTrigger asChild>
          <div className="flex-1 cursor-text">
            <p className="text-gray-500 text-[15px] group-hover:text-gray-400 transition-colors tracking-tight">
              Có gì mới, {user.username}?
            </p>
          </div>
        </DialogTrigger>

        {/* MODAL DIALOG - NỀN #111217 ĐỒNG BỘ LOGIN */}
        <DialogContent className="sm:max-w-[580px] bg-[#111217] border-gray-800 text-white rounded-[24px] flex flex-col p-0 overflow-hidden outline-none shadow-2xl">
          <DialogHeader className="p-5 border-b border-gray-800/50 bg-[#111217]">
            <DialogTitle className="text-center text-base font-bold tracking-tight">
              Tạo bài viết mới
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar max-h-[70vh]">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-900 shrink-0 overflow-hidden border border-gray-800">
                <img
                  src={user.image ? user.image : "/bacon.png"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold mb-1 tracking-tight">
                  {user.username}
                </p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Có gì mới?"
                  className="w-full bg-transparent border-none focus:ring-0 text-[16px] leading-relaxed resize-none min-h-[140px] outline-none placeholder:text-gray-600"
                  autoFocus
                />

                {/* MEDIA PREVIEW GRID */}
                {previewUrls.length > 0 && (
                  <div
                    className={`grid gap-2.5 mt-4 ${previewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    {previewUrls.map((item, index) => (
                      <div
                        key={index}
                        className="relative group rounded-[20px] overflow-hidden border border-gray-800 bg-black/20 aspect-square"
                      >
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500 transition-all z-10 md:opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} className="text-white" />
                        </button>
                        {item.type.startsWith("video/") ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt="preview"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-white transition-all p-2.5 hover:bg-gray-800/80 rounded-full"
                  >
                    <ImagePlus size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 flex justify-between items-center bg-[#111217] border-t border-gray-800/50">
            <p className="text-[13px] text-gray-500 font-medium">
              Bất kỳ ai cũng có thể trả lời
            </p>
            <Button
              onClick={handlePost}
              disabled={
                (!content.trim() && selectedImages.length === 0) || uploading
              }
              className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-10 font-bold transition-all disabled:opacity-30 shadow-lg active:scale-95"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Đăng"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => setOpen(true)}
        className="ml-auto px-6 h-9 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all rounded-full border-none shadow-md active:scale-95"
      >
        Đăng
      </Button>
    </div>
  );
}
