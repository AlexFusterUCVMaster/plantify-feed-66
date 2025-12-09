import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface CommentSectionProps {
  postId: string;
  postOwnerId: string;
}

const CommentSection = ({ postId, postOwnerId }: CommentSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles!comments_user_id_profiles_fkey (
          username,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data as Comment[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
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
        description: "Tu comentario se ha publicado correctamente",
      });
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      });
    } else {
      fetchComments();
      toast({
        title: "Comentario eliminado",
        description: "El comentario se ha eliminado correctamente",
      });
    }
  };

  const canDeleteComment = (commentUserId: string) => {
    if (!user) return false;
    return user.id === commentUserId || user.id === postOwnerId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-ES");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comentarios ({comments.length})
      </h3>

      {/* New comment form */}
      {user ? (
        <div className="flex gap-3">
          <Textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none min-h-[80px]"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Inicia sesión para comentar
        </p>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Cargando comentarios...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Sé el primero en comentar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-lg bg-muted/30"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={comment.profiles?.avatar_url || undefined}
                  alt={comment.profiles?.username || "Usuario"}
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {(comment.profiles?.username || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.profiles?.username || "Usuario"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
              {canDeleteComment(comment.user_id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
