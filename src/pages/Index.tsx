import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PlantCard from "@/components/PlantCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Leaf, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PostWithProfile {
  id: string;
  image_url: string;
  description: string | null;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

const Index = () => {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError || !postsData) {
      setLoading(false);
      return;
    }

    // Fetch profiles for these posts
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, username, avatar_url')
      .in('user_id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

    const postsWithProfiles: PostWithProfile[] = postsData.map(post => ({
      id: post.id,
      image_url: post.image_url,
      description: post.description,
      created_at: post.created_at,
      user_id: post.user_id,
      username: profilesMap.get(post.user_id)?.username || 'Usuario',
      avatar_url: profilesMap.get(post.user_id)?.avatar_url || null,
    }));

    setPosts(postsWithProfiles);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-9 w-9 text-secondary drop-shadow-sm" />
              <h1 className="text-3xl font-bold tracking-tight text-accent font-sans">Plantify</h1>
            </div>
            <div className="flex items-center gap-3">
              {user && <CreatePostDialog onPostCreated={fetchPosts} />}
              {user ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              ) : (
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Cargando...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No hay publicaciones aún.</p>
            {user && <p className="mt-2">¡Sé el primero en compartir una planta!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PlantCard
                key={post.id}
                id={post.id}
                username={post.username}
                userAvatar={post.avatar_url || ''}
                plantImage={post.image_url}
                description={post.description || ''}
                likes={0}
                comments={0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
