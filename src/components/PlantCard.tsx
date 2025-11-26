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
const PlantCard = ({
  username,
  userAvatar,
  plantImage,
  description,
  likes,
  comments
}: PlantCardProps) => {
  return <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-t-none rounded-b-lg bg-inherit">
      {/* Plant image - hero size */}
      <div className="aspect-[4/5] bg-muted relative my-0 mb-8">
        <img src={plantImage} alt={`Plant by ${username}`} className="w-full h-full object-cover" />
      </div>

      {/* Content overlay style */}
      <div className="p-5 space-y-4 bg-card/95 backdrop-blur-sm">
        {/* Header with user info */}
        <div className="gap-3 flex items-center justify-start">
          <Avatar className="h-11 w-11 border border-muted">
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-base">{username}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-light">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-5 pt-2">
          <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
            <Heart className="h-5 w-5 group-hover:fill-secondary group-hover:scale-110 transition-all" />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group">
            <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{comments}</span>
          </button>
          <button className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors ml-auto group">
            <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </Card>;
};
export default PlantCard;