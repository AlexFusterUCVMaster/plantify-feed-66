import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, ArrowLeft, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
  id: string;
  image_url: string;
  description: string | null;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    if (!id) return;

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (postError || !postData) {
      setLoading(false);
      return;
    }

    // Fetch profile for the post author
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("user_id", postData.user_id)
      .maybeSingle();

    setPost({
      ...postData,
      username: profileData?.username || "Usuario",
      avatar_url: profileData?.avatar_url || null,
    });

    setLoading(false);
  };

  const fetchComments = async () => {
    if (!id) return;

    const { data: commentsData, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (error || !commentsData) return;

    // Fetch profiles for comment authors
    const userIds = [...new Set(commentsData.map((c) => c.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_url")
      .in("user_id", userIds);

    const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

    const commentsWithProfiles: Comment[] = commentsData.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user_id: comment.user_id,
      username: profilesMap.get(comment.user_id)?.username || "Usuario",
      avatar_url: profilesMap.get(comment.user_id)?.avatar_url || null,
    }));

    setComments(commentsWithProfiles);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id || !newComment.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
    } else {
      setNewComment("");
      fetchComments();
      toast({
        title: "Comentario publicado",
        description: "Tu comentario ha sido añadido",
      });
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post no encontrado</h2>
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* User info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-muted">
              <AvatarImage src={post.avatar_url || ""} alt={post.username} />
              <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                {post.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{post.username}</h2>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>
          </div>

          {/* Plant image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <img
              src={post.image_url}
              alt={`Plant by ${post.username}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 py-2">
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
              <Heart className="h-6 w-6 group-hover:fill-secondary group-hover:scale-110 transition-all" />
              <span className="text-base font-medium">0</span>
            </button>
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
              <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="text-base font-medium">{comments.length}</span>
            </button>
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors ml-auto group">
              <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Description */}
          {post.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">{post.description}</p>
            </div>
          )}

          {/* Comments section */}
          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">
              Comentarios ({comments.length})
            </h3>

            {/* Comment form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={submitting || !newComment.trim()}
                    className="shrink-0"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">
                  <Link to="/auth" className="text-secondary hover:underline">
                    Inicia sesión
                  </Link>{" "}
                  para comentar
                </p>
              </div>
            )}

            {/* Comments list */}
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Sé el primero en comentar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={comment.avatar_url || ""}
                        alt={comment.username}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                        {comment.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
