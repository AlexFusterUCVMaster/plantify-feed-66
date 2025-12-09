import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, ImagePlus, Loader2 } from 'lucide-react';

interface CreatePostDialogProps {
  onPostCreated?: () => void;
}

export const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !imageFile) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una imagen',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      // Create post in database
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          description: description.trim() || null,
        });

      if (postError) throw postError;

      toast({
        title: 'Publicación creada',
        description: 'Tu planta ha sido compartida exitosamente',
      });

      // Reset form
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
      onPostCreated?.();
    } catch (error: any) {
      toast({
        title: 'Error al crear publicación',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Planta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir una planta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Imagen de tu planta</Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              ) : (
                <label
                  htmlFor="image"
                  className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground mt-2">
                    Haz clic para seleccionar
                  </span>
                </label>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={imagePreview ? '' : 'hidden'}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Cuéntanos sobre tu planta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !imageFile}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
