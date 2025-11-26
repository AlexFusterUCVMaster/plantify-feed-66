import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import plant1 from "@/assets/plant1.jpg";
import plant2 from "@/assets/plant2.jpg";
import plant3 from "@/assets/plant3.jpg";
import plant4 from "@/assets/plant4.jpg";
import plant5 from "@/assets/plant5.jpg";
import plant6 from "@/assets/plant6.jpg";
import avatarMaria from "@/assets/avatar-maria.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import avatarSofia from "@/assets/avatar-sofia.jpg";
import avatarCarlos from "@/assets/avatar-carlos.jpg";
import avatarAna from "@/assets/avatar-ana.jpg";
import avatarLuis from "@/assets/avatar-luis.jpg";

const PostDetail = () => {
  const { id } = useParams();

  // Mock data (same as Index page)
  const plantPosts = [
    {
      id: 1,
      username: "greenthumb_maria",
      userAvatar: avatarMaria,
      plantImage: plant1,
      description: "Mi monstera deliciosa finalmente está sacando una nueva hoja fenestrada. Después de meses de cuidados y paciencia, ver este progreso es increíblemente gratificante. Las plantas nos enseñan a ser pacientes.",
      likes: 234,
      comments: 18
    },
    {
      id: 2,
      username: "urban_jungle_alex",
      userAvatar: avatarAlex,
      plantImage: plant2,
      description: "Colección de suculentas en mi ventana soleada. Me encanta cómo cada una tiene su propia personalidad y ritmo de crecimiento. Estas pequeñas bellezas son perfectas para espacios reducidos.",
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      username: "botanical_sofia",
      userAvatar: avatarSofia,
      plantImage: plant3,
      description: "Mi filodendro Pink Princess mostrando ese color rosa perfecto. La iluminación indirecta brillante ha sido clave para mantener esa pigmentación vibrante. Es una de mis plantas más apreciadas de la colección.",
      likes: 412,
      comments: 31
    },
    {
      id: 4,
      username: "plant_dad_carlos",
      userAvatar: avatarCarlos,
      plantImage: plant4,
      description: "Acabo de trasplantar mi pothos dorado a una maceta más grande. Las raíces estaban perfectamente sanas. Siempre es emocionante darles más espacio para crecer y prosperar.",
      likes: 156,
      comments: 9
    },
    {
      id: 5,
      username: "nature_lover_ana",
      userAvatar: avatarAna,
      plantImage: plant5,
      description: "Mi jardín de hierbas aromáticas en la cocina está floreciendo. Albahaca, romero y menta fresca al alcance de la mano para cocinar. Nada supera el sabor de las hierbas cultivadas en casa.",
      likes: 298,
      comments: 22
    },
    {
      id: 6,
      username: "green_space_luis",
      userAvatar: avatarLuis,
      plantImage: plant6,
      description: "Esta calathea orbifolia tiene las hojas más impresionantes. El patrón de rayas plateadas es simplemente hipnotizante. Mantener la humedad alta ha sido el secreto de su éxito.",
      likes: 267,
      comments: 15
    }
  ];

  const post = plantPosts.find((p) => p.id === Number(id));

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
              <AvatarImage src={post.userAvatar} alt={post.username} />
              <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                {post.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{post.username}</h2>
              <p className="text-sm text-muted-foreground">Publicado hace 2 horas</p>
            </div>
          </div>

          {/* Plant image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <img
              src={post.plantImage}
              alt={`Plant by ${post.username}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 py-2">
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
              <Heart className="h-6 w-6 group-hover:fill-secondary group-hover:scale-110 transition-all" />
              <span className="text-base font-medium">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
              <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="text-base font-medium">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors ml-auto group">
              <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{post.description}</p>
          </div>

          {/* Comments section placeholder */}
          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Comentarios ({post.comments})</h3>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Los comentarios aparecerán aquí</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
