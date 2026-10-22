import { NextResponse } from "next/server";
import { NativeAmilcarAI } from "amilcar-ai/native";
import { NeuralAmilcarAI } from "amilcar-ai/neural";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_BODY_CHARS = 12_000;
const requestsByIp = new Map<string, number[]>();
const neural = new NeuralAmilcarAI({ maxNewTokens: 48, maxPromptChars: 220, temperature: 0, maxMessageLength: 2000 });

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9ñ\s]/g, " ").replace(/\s+/g, " ").trim();
}

function isPlausibleAnswer(question: string, answer: string) {
  const cleaned = answer.trim();
  const words = normalize(cleaned).split(" ").filter((word) => word.length > 2);
  const uniqueRatio = new Set(words).size / Math.max(1, words.length);
  const meaningfulQuestion = normalize(question).split(" ").filter((word) => word.length > 3 && !["para", "como", "cuando", "donde", "porque", "quiero", "puedes", "ayuda"].includes(word));
  const overlap = meaningfulQuestion.filter((word) => words.includes(word)).length;
  const repeatedRun = /(.)\1{4,}/i.test(cleaned);
  return cleaned.length >= 28 && words.length >= 5 && uniqueRatio >= 0.42 && !repeatedRun && (meaningfulQuestion.length === 0 || overlap >= 1);
}

function consumeRateLimit(ip: string) {
  const now = Date.now();
  const active = (requestsByIp.get(ip) || []).filter((stamp) => now - stamp < WINDOW_MS);
  if (active.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByIp.set(ip, active);
    return false;
  }
  active.push(now);
  requestsByIp.set(ip, active);
  if (requestsByIp.size > 1000) {
    for (const [key, stamps] of requestsByIp) {
      if (!stamps.some((stamp) => now - stamp < WINDOW_MS)) requestsByIp.delete(key);
      if (requestsByIp.size <= 800) break;
    }
  }
  return true;
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    engine: "AMILCAR-AI hybrid",
    externalApi: false,
    localNeuralModelAvailable: neural.isAvailable(),
    model: "AMI-Base experimental"
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim().slice(0, 64);
  if (!consumeRateLimit(ip)) {
    return jsonError("Has enviado demasiados mensajes. Espera un minuto antes de volver a intentarlo.", 429, { "Retry-After": "60" });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_CHARS) return jsonError("La solicitud es demasiado grande.", 413);

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return jsonError("La solicitud es demasiado grande.", 413);
    payload = JSON.parse(raw);
  } catch {
    return jsonError("Envía un JSON válido.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return jsonError("El cuerpo de la solicitud no es válido.", 400);
  const body = payload as { message?: unknown; history?: unknown };
  if (typeof body.message !== "string" || !body.message.trim()) return jsonError("Escribe un mensaje antes de enviarlo.", 400);
  const message = body.message.trim();
  if (message.length > 2000) return jsonError("El mensaje supera el límite de 2000 caracteres.", 413);

  let history: string[] = [];
  if (body.history !== undefined) {
    if (!Array.isArray(body.history) || body.history.length > 4) return jsonError("El historial debe contener como máximo cuatro mensajes.", 400);
    for (const item of body.history) {
      if (!item || typeof item !== "object" || Array.isArray(item) || (item as { role?: unknown }).role !== "user" || typeof (item as { content?: unknown }).content !== "string") {
        return jsonError("El historial contiene un mensaje no válido.", 400);
      }
      const content = (item as { content: string }).content.trim();
      if (!content || content.length > 1000) return jsonError("Cada mensaje del historial debe tener entre 1 y 1000 caracteres.", 400);
      history.push(content);
    }
  }

  try {
    const native = new NativeAmilcarAI({ maxHistory: 6, maxMessageLength: 2000 });
    for (const previousMessage of history) await native.chat(previousMessage);
    const result = await native.chat(message);
    if (result.intent === "unknown" && neural.isAvailable()) {
      try {
        const generated = await neural.chat(message);
        if (isPlausibleAnswer(message, generated.reply)) {
          return NextResponse.json({
            reply: generated.reply.trim(),
            model: generated.model,
            engine: "AMILCAR-AI + AMI-Base",
            usedNeural: true,
            externalApi: false,
            experimental: true
          }, { headers: { "Cache-Control": "no-store" } });
        }
      } catch {
        // El motor principal sigue disponible si el apoyo neuronal no carga.
      }
    }
    return NextResponse.json({
      reply: result.reply,
      model: result.model,
      engine: "AMILCAR-AI",
      usedNeural: false,
      externalApi: false,
      experimental: true
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return jsonError("El motor local no pudo procesar el mensaje. Inténtalo otra vez en unos segundos.", 503);
  }
}
