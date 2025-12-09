-- Crear FK hacia profiles (la anterior ya fue eliminada)
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;