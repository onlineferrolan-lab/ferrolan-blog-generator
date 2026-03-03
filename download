import { useState } from "react";
import Head from "next/head";

const CATEGORIAS = [
  { group: "Inspiración e ideas", items: ["Baño", "Cocinas", "Cerámica y parquet", "Espacios exteriores"] },
  { group: "Aprende con nosotros", items: ["Consejos", "Guía paso a paso", "Soluciones constructivas"] },
  { group: "Noticias", items: ["Nuevos productos", "Sector", "Eventos"] },
];

const TONOS = [
  "Informativo / Educativo",
  "Inspiracional / Tendencias",
  "Técnico / Profesional",
  "Guía práctica paso a paso",
];

const EJEMPLOS = [
  { tema: "Tendencias en pavimentos exteriores para 2026", categoria: "Espacios exteriores", keywords: "pavimento exterior, antideslizante, porcelánico, terraza" },
  { tema: "Cómo elegir el mejor adhesivo para cerámica", categoria: "Consejos", keywords: "adhesivo cerámica, colas, colocación azulejos, C2 C1" },
  { tema: "Cocinas de diseño nórdico: materiales y acabados", categoria: "Cocinas", keywords: "cocina nórdica, madera, blanco, encimera, diseño escandinavo" },
];

const C = {
  red: "#E31E24",
  redDark: "#B71C1C",
  redLight: "#FFEBEE",
  dark: "#2D2D2D",
  mid: "#555555",
  light: "#F5F5F5",
  border: "#E0E0E0",
  white: "#FFFFFF",
  muted: "#888888",
};

function MarkdownRenderer({ content }) {
  const parseInline = (text) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        `<a href="https://ferrolan.es$2" style="color:${C.red};text-decoration:underline;font-weight:600" target="_blank">$1</a>`
      );

  const lines = content.split("\n");
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key++}`} style={{ margin: "0.8em 0 1.2em 1.4em", padding: 0 }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: "0.45em", lineHeight: 1.7, color: C.mid }}
              dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={i} style={{ fontSize: "1.55rem", fontWeight: 700, color: C.dark, fontFamily: "'Oswald', sans-serif", lineHeight: 1.2, margin: "0 0 1rem", borderLeft: `4px solid ${C.red}`, paddingLeft: "0.85rem" }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={i} style={{ fontSize: "1.1rem", fontWeight: 700, color: C.dark, fontFamily: "'Oswald', sans-serif", margin: "1.8em 0 0.6em", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          <span style={{ color: C.red, marginRight: "0.4rem" }}>▸</span>{line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={i} style={{ fontSize: "0.88rem", fontWeight: 700, color: C.mid, margin: "1.1em 0 0.35em", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(parseInline(line.slice(2)));
    } else if (line === "---") {
      flushList();
      elements.push(<hr key={i} style={{ border: "none", borderTop: `2px dashed ${C.border}`, margin: "2em 0" }} />);
    } else if (line.trim() === "") {
      flushList();
      elements.push(<div key={i} style={{ height: "0.4em" }} />);
    } else {
      flushList();
      elements.push(
        <p key={i} style={{ lineHeight: 1.78, color: C.mid, margin: "0 0 0.75em", fontSize: "0.94rem" }}
          dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    }
  });
  flushList();
  return <div>{elements}</div>;
}

export default function Home() {
  const [tema, setTema] = useState("");
  const [categoria, setCategoria] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tono, setTono] = useState(TONOS[0]);
  const [notas, setNotas] = useState("");
  const [articulo, setArticulo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const generarArticulo = async () => {
    if (!tema || !categoria) { setError("Por favor, rellena el tema y la categoría."); return; }
    setError(""); setLoading(true); setArticulo("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, categoria, keywords, tono, notas }),
      });
      const data = await res.json();
      if (data.articulo) { setArticulo(data.articulo); setActiveTab("preview"); }
      else setError(data.error || "Error al generar el artículo.");
    } catch { setError("Error de conexión. Inténtalo de nuevo."); }
    setLoading(false);
  };

  const copiarMarkdown = () => {
    navigator.clipboard.writeText(articulo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const inputStyle = {
    width: "100%", border: `1px solid ${C.border}`, borderRadius: 6,
    padding: "0.62rem 0.8rem", fontSize: "0.88rem", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", color: C.dark, background: C.white,
  };
  const labelStyle = {
    fontSize: "0.72rem", fontWeight: 700, color: C.dark, display: "block",
    marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <>
      <Head>
        <title>Ferrolan · Generador de Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F2F2F2; font-family: 'Source Sans 3', 'Segoe UI', sans-serif; }
        input:focus, textarea:focus, select:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px rgba(227,30,36,0.1); }
        button { transition: all 0.15s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .articulo-panel { animation: fadeIn 0.3s ease; }
        @media (max-width: 800px) { .main-grid { grid-template-columns: 1fr !important; } .form-sticky { position: relative !important; top: 0 !important; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: C.white, borderBottom: `3px solid ${C.red}`, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        <img src="/logo-ferrolan.png" alt="Ferrolan" style={{ height: 40, objectFit: "contain" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Oswald', sans-serif" }}>Generador de Artículos · Herramienta interna</span>
        </div>
      </header>

      {/* RED STRIPE */}
      <div style={{ background: C.red, padding: "0.5rem 2rem" }}>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75rem", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Blog · Powered by Claude AI
        </p>
      </div>

      {/* MAIN */}
      <div className="main-grid" style={{ maxWidth: 1140, margin: "0 auto", padding: "1.75rem 1.5rem", display: "grid", gridTemplateColumns: "360px 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* FORM */}
        <div className="form-sticky" style={{ position: "sticky", top: "1.5rem" }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ background: C.dark, padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span style={{ color: C.white, fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", letterSpacing: "0.07em" }}>Configurar artículo</span>
            </div>

            <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Ejemplos */}
              <div>
                <div style={{ ...labelStyle, color: C.muted, marginBottom: "0.5rem" }}>Ejemplos rápidos</div>
                {EJEMPLOS.map((ej, i) => (
                  <button key={i} onClick={() => { setTema(ej.tema); setCategoria(ej.categoria); setKeywords(ej.keywords); }}
                    style={{ display: "block", width: "100%", marginBottom: "0.3rem", background: C.redLight, border: `1px solid #FFCDD2`, borderRadius: 5, padding: "0.42rem 0.7rem", textAlign: "left", cursor: "pointer", fontSize: "0.78rem", color: C.redDark, lineHeight: 1.45, fontFamily: "inherit" }}
                    onMouseOver={e => e.currentTarget.style.background = "#FFCDD2"}
                    onMouseOut={e => e.currentTarget.style.background = C.redLight}>
                    {ej.tema}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${C.light}` }} />

              <div>
                <label style={labelStyle}>Tema del artículo *</label>
                <input value={tema} onChange={e => setTema(e.target.value)} placeholder="Ej: Tendencias en pavimentos 2026..." style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Categoría *</label>
                <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Selecciona una categoría...</option>
                  {CATEGORIAS.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map(item => <option key={item} value={item}>{item}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Keywords SEO <span style={{ fontWeight: 400, textTransform: "none", fontSize: "0.75rem", color: C.muted }}>(opcional)</span></label>
                <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Ej: suelo porcelánico, exterior, antideslizante" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Tono</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {TONOS.map(t => (
                    <button key={t} onClick={() => setTono(t)}
                      style={{ padding: "0.3rem 0.65rem", borderRadius: 4, border: tono === t ? `1.5px solid ${C.red}` : `1px solid ${C.border}`, background: tono === t ? C.redLight : C.white, color: tono === t ? C.redDark : C.mid, fontSize: "0.73rem", cursor: "pointer", fontFamily: "inherit", fontWeight: tono === t ? 700 : 400 }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notas adicionales <span style={{ fontWeight: 400, textTransform: "none", fontSize: "0.75rem", color: C.muted }}>(opcional)</span></label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Productos concretos, referencias, datos técnicos..." rows={3}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
              </div>

              {error && (
                <div style={{ background: C.redLight, border: `1px solid #FFCDD2`, borderRadius: 5, padding: "0.55rem 0.75rem", color: C.redDark, fontSize: "0.82rem", fontWeight: 600 }}>
                  ⚠ {error}
                </div>
              )}

              <button onClick={generarArticulo} disabled={loading}
                style={{ background: loading ? C.redDark : C.red, color: C.white, border: "none", borderRadius: 6, padding: "0.9rem", fontWeight: 700, fontSize: "0.92rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                onMouseOver={e => !loading && (e.currentTarget.style.background = C.redDark)}
                onMouseOut={e => !loading && (e.currentTarget.style.background = C.red)}>
                {loading
                  ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.85s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Generando...</>
                  : "Generar artículo"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: "0.85rem", background: C.white, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.red}`, borderRadius: "0 6px 6px 0", padding: "0.75rem 1rem" }}>
            <div style={{ fontSize: "0.7rem", color: C.dark, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Oswald', sans-serif", marginBottom: "0.3rem" }}>Cada artículo incluye</div>
            <div style={{ fontSize: "0.75rem", color: C.mid, lineHeight: 1.65 }}>
              Tono informativo sin presión comercial · Estructura editorial · Links internos · CTA de servicio · Meta SEO · Slug y etiquetas
            </div>
          </div>
        </div>

        {/* RESULT */}
        <div>
          {!articulo && !loading && (
            <div style={{ background: C.white, border: `2px dashed ${C.border}`, borderRadius: 8, padding: "5rem 2rem", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: C.redLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <div style={{ color: C.dark, fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.4rem" }}>Configura y genera tu primer artículo</div>
              <div style={{ color: C.muted, fontSize: "0.85rem" }}>Rellena el formulario o usa un ejemplo rápido para empezar</div>
            </div>
          )}

          {loading && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5rem 2rem", textAlign: "center" }}>
              <div style={{ width: 46, height: 46, border: `3px solid ${C.redLight}`, borderTopColor: C.red, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.25rem" }} />
              <div style={{ color: C.dark, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.4rem" }}>Generando artículo...</div>
              <div style={{ color: C.muted, fontSize: "0.84rem" }}>Claude está redactando en el estilo de Ferrolan</div>
            </div>
          )}

          {articulo && (
            <div className="articulo-panel" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div style={{ background: C.dark, padding: "0.65rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "0.2rem" }}>
                  {[["preview", "Vista previa"], ["markdown", "Markdown"]].map(([val, label]) => (
                    <button key={val} onClick={() => setActiveTab(val)}
                      style={{ padding: "0.3rem 0.85rem", borderRadius: 4, border: "none", background: activeTab === val ? C.red : "transparent", color: activeTab === val ? C.white : "#AAAAAA", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'Oswald', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </button>
                  ))}
                </div>
                <button onClick={copiarMarkdown}
                  style={{ background: copied ? "#16a34a" : "#444", color: C.white, border: "none", borderRadius: 5, padding: "0.36rem 0.9rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  {copied ? "✓ Copiado!" : "⎘ Copiar Markdown"}
                </button>
              </div>

              <div style={{ padding: "2rem 2.5rem", maxHeight: "70vh", overflowY: "auto" }}>
                {activeTab === "preview"
                  ? <MarkdownRenderer content={articulo} />
                  : <pre style={{ fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, color: C.mid, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{articulo}</pre>
                }
              </div>

              <div style={{ borderTop: `1px solid ${C.light}`, padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", background: C.light }}>
                <button onClick={generarArticulo}
                  style={{ background: C.dark, color: C.white, border: "none", borderRadius: 5, padding: "0.5rem 1.1rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Oswald', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                  onMouseOver={e => e.currentTarget.style.background = C.red}
                  onMouseOut={e => e.currentTarget.style.background = C.dark}>
                  ↺ Regenerar
                </button>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: "0.72rem", color: C.muted }}>Listo para revisar y publicar en WordPress</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
