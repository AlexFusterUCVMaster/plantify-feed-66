import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  postId: string;
  initialLikesCount?: number;
}

const LikeButton = ({ postId, initialLikesCount = 0 }: LikeButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) {
        setIsLiked(false);
        return;
      }

      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsLiked(!!data);
    };

    const fetchLikesCount = async () => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      setLikesCount(count || 0);
    };

    fetchLikeStatus();
    fetchLikesCount();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dar me gusta",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar tu like",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group disabled:opacity-50"
    >
      <Heart
        className={`h-5 w-5 group-hover:scale-110 transition-all ${
          isLiked ? "fill-secondary text-secondary" : "group-hover:fill-secondary"
        }`}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
