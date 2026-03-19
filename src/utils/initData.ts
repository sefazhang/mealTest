import { saveRecord } from './db'
import type { Dish } from '../types/dish'

const sampleDishes: Dish[] = [
  {
    id: 1,
    name: '宫保鸡丁',
    category: '川菜',
    type: '荤菜',
    ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒'],
    steps: ['鸡肉切丁腌制', '炒花生米', '爆香辣椒', '快炒收汁']
  },
  {
    id: 2,
    name: '麻婆豆腐',
    category: '川菜',
    type: '荤菜',
    ingredients: ['豆腐', '牛肉末', '豆瓣酱', '花椒'],
    steps: ['豆腐焯水', '炒肉末', '加豆瓣酱', '煮豆腐']
  },
  {
    id: 3,
    name: '清炒时蔬',
    category: '家常菜',
    type: '素菜',
    ingredients: ['青菜', '蒜', '盐'],
    steps: ['青菜洗净', '蒜爆香', '快炒', '调味']
  },
  {
    id: 4,
    name: '番茄炒蛋',
    category: '家常菜',
    type: '素菜',
    ingredients: ['番茄', '鸡蛋', '糖', '盐'],
    steps: ['鸡蛋打散', '炒蛋盛出', '炒番茄', '混合翻炒']
  },
  {
    id: 5,
    name: '红烧肉',
    category: '家常菜',
    type: '荤菜',
    ingredients: ['五花肉', '冰糖', '酱油', '八角'],
    steps: ['肉焯水', '炒糖色', '加调料', '小火炖煮']
  },
  {
    id: 6,
    name: '炸酱面',
    category: '北方菜',
    type: '面食',
    ingredients: ['面条', '肉末', '甜面酱', '黄瓜'],
    steps: ['煮面', '炒肉酱', '准备配菜', '拌面']
  }
]

const getRandomDishes = (count: number): Dish[] => {
  const shuffled = [...sampleDishes].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const initSampleHistory = async () => {
  const today = new Date()

  // 昨天的菜单
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  await saveRecord({
    date: yesterday.toISOString().split('T')[0],
    dishes: getRandomDishes(3)
  })

  // 前天的菜单
  const dayBefore = new Date(today)
  dayBefore.setDate(dayBefore.getDate() - 2)
  await saveRecord({
    date: dayBefore.toISOString().split('T')[0],
    dishes: getRandomDishes(4)
  })
}
