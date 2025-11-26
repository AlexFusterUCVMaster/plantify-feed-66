import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if we should show the popup
    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem("newsletterLastShown");
      const now = Date.now();
      const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds

      if (!lastShown || now - parseInt(lastShown) >= twoMinutes) {
        setIsOpen(true);
        localStorage.setItem("newsletterLastShown", now.toString());
      }
    };

    // Show popup immediately on first visit
    const timer = setTimeout(checkAndShowPopup, 1000);

    // Set up interval to check every 2 minutes
    const interval = setInterval(checkAndShowPopup, 2 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "¡Bienvenido a Plantify! 🌿",
        description: "Te has suscrito exitosamente a nuestra newsletter.",
      });
      setEmail("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Leaf className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            🌱 Únete a la comunidad Plantify
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-base leading-relaxed">
            Recibe consejos exclusivos de cuidado de plantas, inspiración para tu jardín urbano y novedades de nuestra comunidad directamente en tu correo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base border-2 border-input focus:border-primary transition-colors"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            Suscribirme ahora
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            No spam, lo prometemos. Puedes darte de baja en cualquier momento.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
