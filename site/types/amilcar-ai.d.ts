declare module "amilcar-ai/native" {
  export class NativeAmilcarAI {
    constructor(options?: { maxHistory?: number; maxMessageLength?: number });
    chat(message: string): Promise<{ reply: string; model: string; trained: boolean; mode: string; intent: string; confidence: number }>;
  }
}

declare module "amilcar-ai/neural" {
  export class NeuralAmilcarAI {
    constructor(options?: { modelPath?: string; temperature?: number; topK?: number; topP?: number; maxNewTokens?: number; maxPromptChars?: number; maxMessageLength?: number });
    isAvailable(): boolean;
    chat(message: string, options?: { temperature?: number; topK?: number; topP?: number; maxNewTokens?: number; seed?: number }): Promise<{ reply: string; model: string; trained: boolean; mode: string; intent: string; confidence: number; tokens: number }>;
  }
}
