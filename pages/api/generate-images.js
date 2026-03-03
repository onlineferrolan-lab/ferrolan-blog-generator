import Anthropic from "@anthropic-ai/sdk";

// ─── Genera los prompts de imagen usando Claude como director de fotografía ──

async function buildImagePrompts(tema, categoria, articleText) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Eres un director de fotografía especializado en contenido editorial para el sector de construcción, interiorismo y decoración. 
Tu trabajo es crear prompts precisos para generación de imágenes hiperrealistas que acompañen artículos de blog.

REGLAS ABSOLUTAS:
- Las imágenes SIEMPRE son hiperrealistas, estilo fotografía profesional editorial
- Se adaptan al tema concreto del artículo, nunca son genéricas
- Si el artículo habla de jardín → exterior, plantas, pavimento exterior. Nunca un interior.
- Si habla de baño → espacio de baño real. No una cocina.
- Si habla de materiales técnicos → el material en contexto real de uso
- Si habla de cocina → cocina, encimera, ambiente culinario
- Iluminación natural siempre que sea posible, estilo revista de arquitectura e interiorismo
- Sin personas a menos que aporten valor real (ej: manos instalando)
- Sin texto, logos ni marcas en las imágenes
- Estilo fotográfico: revista Elle Decoration, Architectural Digest, AD España

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin explicaciones:
{
  "imagen1": {
    "descripcion": "para qué es esta imagen",
    "prompt": "el prompt completo en inglés para Imagen 3"
  },
  "imagen2": {
    "descripcion": "para qué es esta imagen",  
    "prompt": "el prompt completo en inglés para Imagen 3"
  }
}`;

  const userPrompt = `Artículo:
Tema: ${tema}
Categoría: ${categoria}
Primeros 400 caracteres del artículo: ${articleText.slice(0, 400)}

Genera 2 prompts de imagen para este artículo:

IMAGEN 1 — Foto ambiente: Escena completa y contextual que refleje exactamente el tema del artículo. Adapta el espacio al tema (jardín, baño, cocina, fachada, salón, terraza...). Estilo editorial hiperrealista.

IMAGEN 2 — Detalle de material/textura: Primer plano ultra detallado del material principal del que habla el artículo (cerámica, porcelánico, madera, piedra, metal, vegetal...). Luz rasante, textura visible, fondo desenfocado.

Los prompts deben estar en inglés y ser muy específicos y descriptivos.`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content[0]?.text || "{}";
  
  try {
    // Limpia posibles backticks o prefijos json
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    console.error("Error parsing image prompts JSON:", raw);
    return null;
  }
}

// ─── Llama a Gemini Imagen 3 ─────────────────────────────────────────────────

async function generateImageWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "16:9",
      safetyFilterLevel: "block_few",
      personGeneration: "allow_adult",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const base64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) throw new Error("No image returned from Gemini");

  return `data:image/png;base64,${base64}`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tema, categoria, articleText } = req.body;

  if (!tema || !categoria || !articleText) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY no configurada" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY no configurada" });
  }

  try {
    // 1. Claude genera los prompts específicos para este artículo
    const prompts = await buildImagePrompts(tema, categoria, articleText);

    if (!prompts?.imagen1?.prompt || !prompts?.imagen2?.prompt) {
      return res.status(500).json({ error: "No se pudieron generar los prompts de imagen" });
    }

    // 2. Gemini genera las dos imágenes en paralelo
    const [img1, img2] = await Promise.all([
      generateImageWithGemini(prompts.imagen1.prompt),
      generateImageWithGemini(prompts.imagen2.prompt),
    ]);

    return res.status(200).json({
      imagenes: [
        { src: img1, descripcion: prompts.imagen1.descripcion, prompt: prompts.imagen1.prompt },
        { src: img2, descripcion: prompts.imagen2.descripcion, prompt: prompts.imagen2.prompt },
      ],
    });

  } catch (err) {
    console.error("Image generation error:", err);
    return res.status(500).json({ error: err.message || "Error generando imágenes" });
  }
}
