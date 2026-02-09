"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus, X } from "lucide-react";
export default function Upload() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(files);
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
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setPreviewUrls([]);
    setContent("");
  };

  const handlePost = async () => {
    setUploading(true);
    try {
      const signatureResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media/cloudinary/signature`,
      );
      const signatureJson = await signatureResponse.json();
      const sigData = signatureJson.data;
      const uploadResults = await Promise.all(
        selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("signature", sigData.signature);
          formData.append("api_key", process.env.NEXT_PUBLIC_CLOUD_API_KEY);
          formData.append("timestamp", sigData.timestamp);
          formData.append("folder", sigData.folder);

          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/${file.type.split("/")[0]}/upload`,
            { method: "post", body: formData },
          );
          const uploadData = await uploadResponse.json();
          return uploadData.url;
        }),
      );
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          content: content,
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
    <div className="hidden md:flex items-center gap-3 py-4 border-b border-purple-900/30 w-full">
      {/* Avatar người dùng */}
      <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0 overflow-hidden">
        <img
          src={
            user.image || "https://img.icons8.com/nolan/1200/user-default.jpg"
          }
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Modal Dialog */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) clearAll();
        }}
      >
        <DialogTrigger asChild>
          <div className="flex-1 cursor-pointer">
            <p className="text-purple-400/50 text-sm">Có gì mới?</p>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px] bg-[#120a1c] border-purple-900/50 text-purple-50 max-h-[90vh] overflow-y-auto outline-none">
          <DialogHeader>
            <DialogTitle className="text-center border-b border-purple-900/30 pb-4">
              Nội dung bài đăng
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <div className="w-10 h-10 rounded-full bg-purple-800 shrink-0 overflow-hidden">
              <img
                src={user.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm font-semibold">{user.username}</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Có gì mới?"
                className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none min-h-[80px] outline-none placeholder:text-purple-400/30"
                autoFocus
              />
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {previewUrls.map((item, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-purple-900/50 aspect-square bg-black/20"
                    >
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-red-500 transition z-10"
                      >
                        <X size={14} />
                      </button>

                      {item.type.startsWith("video/") ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          controls={false}
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

              {/* Icon chọn nhiều ảnh */}
              <div className="mt-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,video/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300 transition flex items-center gap-2 w-fit"
                >
                  <ImagePlus size={20} />
                  <span className="text-xs font-medium">Thêm ảnh, video</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handlePost}
              disabled={
                (!content.trim() && selectedImages.length === 0) || uploading
              }
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-6"
            >
              {uploading ? "Đang đăng..." : "Đăng"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => setOpen(true)}
        className=" ml-auto px-4 py-1.5 bg-purple-600 text-sm font-semibold hover:bg-purple-500 transition cursor-pointer rounded-xl"
      >
        Đăng
      </Button>
    </div>
  );
}
