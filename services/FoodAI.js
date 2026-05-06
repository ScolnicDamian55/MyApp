// services/FoodAI.js
import { Platform } from 'react-native';
import { API_URL_WEB, API_URL_MOBILE, MODEL_NAME } from '@env';

const OLLAMA_URL = Platform.OS === 'web' ? API_URL_WEB : API_URL_MOBILE;

export async function analyzeFoodPhoto(imageUri) {
  try {
    console.log('Читаю фото...', imageUri);

    // Загружаем фото и конвертируем в base64
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    console.log('Отправляю в Ollama...');

    // Запрос к Ollama
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME || 'llava',
        prompt: `Look at this food photo carefully. Identify exactly what food is shown.
Then calculate the realistic nutritional values for this specific food.
Respond ONLY with a JSON object, no other text:
{
  "dish": "название блюда на русском",
  "weight": число грамм,
  "calories": число калорий,
  "protein": число грамм белка,
  "carbs": число грамм углеводов,
  "fat": число грамм жиров,
  "confidence": число от 0 до 1
}`,
        images: [base64],
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 200,
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ошибка HTTP: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    console.log('Ответ Ollama:', data.response);

    // Ищем JSON внутри ответа
    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON не найден');

    const result = JSON.parse(jsonMatch[0]);
    console.log('Результат:', result);
    return result;

  } catch (e) {
    console.error('FoodAI error:', e.message);
    return null;
  }
}
