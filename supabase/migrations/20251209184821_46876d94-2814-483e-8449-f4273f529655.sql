-- Actualizar política de DELETE en comments para permitir que el dueño del post también pueda eliminar comentarios
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

CREATE POLICY "Users can delete their own comments or post owner can delete" 
ON public.comments 
FOR DELETE 
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() = (SELECT user_id FROM public.posts WHERE id = post_id)
);