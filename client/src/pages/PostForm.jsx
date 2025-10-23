import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = ["React", "Backend", "CSS", "Database", "JavaScript", "TypeScript"];

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Current User" // Will be replaced with actual auth user
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulated save
    toast({
      title: isEditing ? "Post Updated" : "Post Created",
      description: isEditing
        ? "Your post has been successfully updated."
        : "Your post has been successfully published."
    });

    navigate("/posts");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="content-container">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {isEditing ? "Edit Post" : "Create New Post"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your blog post with the latest information."
                  : "Share your knowledge with the developer community."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter an engaging title for your post"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief summary that will appear in the post list"
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here... You can use Markdown formatting."
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    rows={16}
                    className="font-mono"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Tip: You can use Markdown syntax for formatting (headings, lists, code blocks, etc.)
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Post" : "Publish Post"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" asChild>
                    <Link to="/posts">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostForm;
