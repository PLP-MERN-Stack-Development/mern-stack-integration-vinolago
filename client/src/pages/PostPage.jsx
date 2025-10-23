// /pages/PostPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PostPage() {
  const { id } = useParams(); // matches /post/:id route
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const json = await res.json();
        setPost(json.data || json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();

    return () => controller.abort();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Loading post...
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-red-600">
        Failed to load post: {error}
      </div>
    );

  if (!post)
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Post not found.
      </div>
    );

  const {
    title,
    content,
    category,
    author,
    createdAt,
    featuredImage,
  } = post;

  const authorName = author?.name || "Unknown Author";
  const categoryName = category?.name || "Uncategorized";
  const imageUrl = featuredImage
    ? `/uploads/${featuredImage}`
    : "/uploads/default-post.jpg";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Featured image */}
      <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden bg-gray-100 mb-6">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/uploads/default-post.jpg")}
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 leading-tight">{title}</h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
          {categoryName}
        </span>
        <span>
          By <span className="text-gray-800 font-medium">{authorName}</span>
        </span>
        <time dateTime={createdAt}>
          {new Date(createdAt).toLocaleDateString()}
        </time>
      </div>

      {/* Content */}
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />

      {/* Comments section */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={id} />
      </div>
    </div>
  );
}

/**
 * A simple placeholder Markdown-to-HTML converter
 * (replace with a library like marked or markdown-it if needed)
 */
function renderMarkdown(content = "") {
  if (!content) return "";
  return content
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/\n$/gim, "<br />");
}
