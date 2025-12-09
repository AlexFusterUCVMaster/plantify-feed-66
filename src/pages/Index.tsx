import { Link } from "react-router-dom";
import PlantCard from "@/components/PlantCard";
// import NewsletterPopup from "@/components/NewsletterPopup";
import { Leaf, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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

const Index = () => {
  const { user, signOut } = useAuth();
  // Mock data for plant posts
  const plantPosts = [{
    id: 1,
    username: "greenthumb_maria",
    userAvatar: avatarMaria,
    plantImage: plant1,
    description: "Mi monstera deliciosa finalmente está sacando una nueva hoja fenestrada. Después de meses de cuidados y paciencia, ver este progreso es increíblemente gratificante. Las plantas nos enseñan a ser pacientes.",
    likes: 234,
    comments: 18
  }, {
    id: 2,
    username: "urban_jungle_alex",
    userAvatar: avatarAlex,
    plantImage: plant2,
    description: "Colección de suculentas en mi ventana soleada. Me encanta cómo cada una tiene su propia personalidad y ritmo de crecimiento. Estas pequeñas bellezas son perfectas para espacios reducidos.",
    likes: 189,
    comments: 12
  }, {
    id: 3,
    username: "botanical_sofia",
    userAvatar: avatarSofia,
    plantImage: plant3,
    description: "Mi filodendro Pink Princess mostrando ese color rosa perfecto. La iluminación indirecta brillante ha sido clave para mantener esa pigmentación vibrante. Es una de mis plantas más apreciadas de la colección.",
    likes: 412,
    comments: 31
  }, {
    id: 4,
    username: "plant_dad_carlos",
    userAvatar: avatarCarlos,
    plantImage: plant4,
    description: "Acabo de trasplantar mi pothos dorado a una maceta más grande. Las raíces estaban perfectamente sanas. Siempre es emocionante darles más espacio para crecer y prosperar.",
    likes: 156,
    comments: 9
  }, {
    id: 5,
    username: "nature_lover_ana",
    userAvatar: avatarAna,
    plantImage: plant5,
    description: "Mi jardín de hierbas aromáticas en la cocina está floreciendo. Albahaca, romero y menta fresca al alcance de la mano para cocinar. Nada supera el sabor de las hierbas cultivadas en casa.",
    likes: 298,
    comments: 22
  }, {
    id: 6,
    username: "green_space_luis",
    userAvatar: avatarLuis,
    plantImage: plant6,
    description: "Esta calathea orbifolia tiene las hojas más impresionantes. El patrón de rayas plateadas es simplemente hipnotizante. Mantener la humedad alta ha sido el secreto de su éxito.",
    likes: 267,
    comments: 15
  }];
  return <div className="min-h-screen">
      {/* <NewsletterPopup /> */}
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-9 w-9 text-secondary drop-shadow-sm" />
              <h1 className="text-3xl font-bold tracking-tight text-accent font-sans">Plantify</h1>
            </div>
            <div>
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
      <main className="max-w-7xl mx-auto px-6 py-12 border-secondary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plantPosts.map(post => <PlantCard key={post.id} {...post} />)}
        </div>
      </main>
    </div>;
};
export default Index;