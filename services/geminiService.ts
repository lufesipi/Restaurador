import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImageForRestorationPrompt = async (file: File): Promise<string> => {
    const { data, mimeType } = await fileToBase64(file);
    const imagePart = { inlineData: { data, mimeType } };
    const textPart = { 
        text: "Analise esta foto antiga. Descreva os defeitos como arranhões, rasgos, desbotamento de cor e falta de nitidez. Com base na sua análise, crie um prompt detalhado em português para uma IA de imagem para restaurar esta foto. O prompt deve ser um comando direto, começando com 'Restaure esta foto...'. Seja específico sobre as ações a serem tomadas." 
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Falha ao analisar a imagem. Tente novamente.");
    }
};

export const restoreImage = async (prompt: string, file: File): Promise<string> => {
    const { data, mimeType } = await fileToBase64(file);
    const imagePart = { inlineData: { data, mimeType } };
    const textPart = { text: prompt };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                const responseMimeType = part.inlineData.mimeType || 'image/png';
                return `data:${responseMimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Nenhuma imagem foi retornada pela API.");
    } catch (error) {
        console.error("Error restoring image:", error);
        throw new Error("Falha ao restaurar a imagem. Verifique o console para detalhes.");
    }
};