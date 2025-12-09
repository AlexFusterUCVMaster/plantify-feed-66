import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

const PostDetail = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          image_url,
          description,
          created_at,
          user_id,
          profiles!posts_user_id_profiles_fkey (
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (error || !post) {
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

  const profile = post.profiles;

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
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "Usuario"} />
              <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                {(profile?.username || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{profile?.username || "Usuario"}</h2>
              <p className="text-sm text-muted-foreground">Publicado {formatDate(post.created_at)}</p>
            </div>
          </div>

          {/* Plant image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <img
              src={post.image_url}
              alt={`Plant by ${profile?.username}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 py-2">
            <LikeButton postId={post.id} />
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors ml-auto group">
              <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{post.description}</p>
          </div>

          {/* Comments section */}
          <div className="pt-8 border-t border-border">
            <CommentSection postId={post.id} postOwnerId={post.user_id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
