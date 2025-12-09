import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, postId, userId } = await req.json();
    
    console.log("Processing new post:", { imageUrl, postId, userId });

    if (!imageUrl || !postId || !userId) {
      throw new Error("Missing required fields: imageUrl, postId, userId");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate description using AI with vision
    console.log("Generating AI description for image...");
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Eres un experto en plantas y jardinería. Genera una descripción breve y atractiva (máximo 2 oraciones) para una publicación de redes sociales sobre la planta en la imagen. Responde solo con la descripción, sin comillas ni explicaciones adicionales. Usa español.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe esta planta para una publicación en redes sociales:",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedDescription = aiData.choices?.[0]?.message?.content || "";
    console.log("Generated description:", generatedDescription);

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update post with generated description if it was empty
    const { data: post } = await supabase
      .from("posts")
      .select("description")
      .eq("id", postId)
      .single();

    if (!post?.description) {
      await supabase
        .from("posts")
        .update({ description: generatedDescription })
        .eq("id", postId);
      console.log("Updated post with AI description");
    }

    // Get post owner's username for notification
    const { data: postOwner } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .single();

    // Notify all other users about the new post
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("user_id")
      .neq("user_id", userId);

    if (allProfiles && allProfiles.length > 0) {
      const notifications = allProfiles.map((profile) => ({
        user_id: profile.user_id,
        type: "new_post",
        message: `${postOwner?.username || "Un usuario"} ha publicado una nueva planta`,
        post_id: postId,
      }));

      const { error: notifError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notifError) {
        console.error("Error creating notifications:", notifError);
      } else {
        console.log(`Created ${notifications.length} notifications`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedDescription,
        notificationsCreated: allProfiles?.length || 0 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-new-post:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
