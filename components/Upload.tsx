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

  // Dọn dẹp bộ nhớ khi component unmount hoặc khi xóa preview
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
      // 1. Lấy signature từ Backend
      const signatureResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media/cloudinary/signature`,
      );
      const { data: sigData } = await signatureResponse.json();

      // 2. Upload song song lên Cloudinary
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
          return uploadData.secure_url; // Dùng secure_url cho HTTPS
        }),
      );

      // 3. Gửi data về NestJS backend của bạn
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
      alert("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="hidden md:flex items-center gap-3 py-4 border-b border-purple-900/30 w-full">
      <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0 overflow-hidden">
        <img
          src={
            user.image || "https://img.icons8.com/nolan/1200/user-default.jpg"
          }
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
          <div className="flex-1 cursor-pointer">
            <p className="text-purple-400/50 text-sm">
              Có gì mới, {user.username}?
            </p>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px] bg-[#120a1c] border-purple-900/50 text-purple-50 max-h-[90vh] flex flex-col p-0 overflow-hidden outline-none">
          <DialogHeader className="p-4 border-b border-purple-900/30">
            <DialogTitle className="text-center text-base font-bold">
              Tạo đoạn văn bản mới
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0 overflow-hidden">
                <img
                  src={user.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">{user.username}</p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Có gì mới?"
                  className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none min-h-[100px] outline-none placeholder:text-purple-400/30"
                  autoFocus
                />

                {previewUrls.length > 0 && (
                  <div
                    className={`grid gap-2 mt-2 ${previewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    {previewUrls.map((item, index) => (
                      <div
                        key={index}
                        className="relative group rounded-xl overflow-hidden border border-purple-900/50 aspect-square bg-black/40"
                      >
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-red-600 transition z-10"
                        >
                          <X size={14} />
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
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
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
                    className="text-purple-400/60 hover:text-purple-300 transition-all flex items-center gap-2"
                  >
                    <ImagePlus size={22} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex justify-between items-center bg-[#120a1c]">
            <p className="text-xs text-purple-400/40">
              Bất kỳ ai cũng có thể trả lời
            </p>
            <Button
              onClick={handlePost}
              disabled={
                (!content.trim() && selectedImages.length === 0) || uploading
              }
              className="bg-white text-black hover:bg-gray-200 rounded-full px-5 font-bold transition-all disabled:opacity-50"
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
        className="ml-auto px-4 py-1 bg-white text-black text-sm font-bold hover:bg-gray-200 transition rounded-full border-none"
      >
        Đăng
      </Button>
    </div>
  );
}
