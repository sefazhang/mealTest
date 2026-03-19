export interface Dish {
  id: number
  name: string
  category: string
  type: string
  ingredients: string[]
  steps: string[]
  tips?: string
  link?: string
}
