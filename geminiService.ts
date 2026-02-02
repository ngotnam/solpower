
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTechAdvice(productType: string, issue: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là kỹ thuật viên cao cấp tại SOLPOWER, một công ty năng lượng mặt trời. 
      Khách hàng đang gặp vấn đề với thiết bị sau:
      Loại sản phẩm: ${productType}
      Loại sự cố: ${issue}
      Mô tả của khách hàng: ${description}

      Hãy cung cấp:
      1. Chẩn đoán sơ bộ.
      2. 3-4 bước kiểm tra nhanh tại chỗ (an toàn).
      3. Lời khuyên có nên đợi kỹ thuật viên đến hay không.
      
      Phản hồi bằng tiếng Việt, ngắn gọn, chuyên nghiệp, định dạng Markdown.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Rất tiếc, hệ thống tư vấn thông minh đang bận. Vui lòng gửi yêu cầu hỗ trợ, kỹ thuật viên sẽ liên hệ lại ngay.";
  }
}
