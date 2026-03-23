const LAPTOP_IP = '192.168.11.17';
const OLLAMA_URL = `http://${LAPTOP_IP}:11434`;

export async function analyzeFoodPhoto(imageUri) {
  try {
    console.log('Читаю фото...', imageUri);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    console.log('Отправляю в Ollama...');

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava',
        prompt: `Look at this food photo carefully. Identify exactly what food is shown.
Then calculate the realistic nutritional values for this specific food.
Respond ONLY with a JSON object, no other text:
{
  "dish": "name of the dish in Russian",
  "weight": estimated weight in grams as a number,
  "calories": realistic calories for this portion as a number,
  "protein": realistic protein in grams as a number,
  "carbs": realistic carbs in grams as a number,
  "fat": realistic fat in grams as a number,
  "confidence": your confidence from 0 to 1
}
Do NOT use placeholder values. Analyze the actual food in the image.`,
        images: [base64],
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 200,
        }
      })
    });

    console.log('Статус ответа:', ollamaResponse.status);
    const data = await ollamaResponse.json();
    console.log('Ответ Ollama:', data.response);

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