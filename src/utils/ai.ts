import type { Dish } from '../types/dish'

export const generateNutritionSummary = async (dishes: Dish[], apiKey: string): Promise<string> => {
  if (!dishes.length) return ''

  const response = await fetch('http://localhost:3000/api/ai-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dishes, apiKey })
  })

  const data = await response.json()
  return data.summary
}
