import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PlantCardProps {
  username: string;
  userAvatar: string;
  plantImage: string;
  description: string;
  likes: number;
  comments: number;
}

const PlantCard = ({ username, userAvatar, plantImage, description, likes, comments }: PlantCardProps) => {
  return (
    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header with user info */}
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-accent text-white font-semibold">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground">{username}</span>
      </div>

      {/* Plant image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img 
          src={plantImage} 
          alt={`Plant by ${username}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
            <Heart className="h-6 w-6 group-hover:fill-accent group-hover:scale-110 transition-all" />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group">
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{comments}</span>
          </button>
          <button className="flex items-center gap-2 text-foreground hover:text-secondary transition-colors ml-auto group">
            <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default PlantCard;
