import { ref, computed, onMounted } from 'vue'
import dishesData from '../data/dishes.json'
import type { Dish } from '../types/dish'
import { ref as dbRef, onValue, set } from 'firebase/database'
import { db } from '../firebase'

const EXCLUDE_INGREDIENTS = [
  '盐', '酱油', '醋', '糖', '料酒', '淀粉', '油', '花椒', '辣椒', '葱', '姜', '蒜',
  '郫县豆瓣酱', '豆瓣酱', '甜面酱', '芝麻酱', '辣椒油', '花椒粉', '鸡精', '胡椒粉',
  '冰糖', '八角', '桂皮', '香叶', '芝麻', '葱花', '姜末', '蒜末', '姜片', '蒜片',
  '葱段', '泡椒', '干辣椒', '花生碎'
]

export function useDishes() {
  const dishes = ref<Dish[]>(dishesData)
  const typeFilter = ref('')
  const ingredientFilter = ref('')

  // 监听 Firebase 菜品变化
  onMounted(() => {
    const dishesRef = dbRef(db, 'dishes')
    onValue(dishesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        dishes.value = data
      } else {
        // 首次初始化数据
        set(dishesRef, dishesData)
      }
    })
  })

  const allIngredients = computed(() => {
    const ings = new Set<string>()
    dishes.value.forEach(d => {
      d.ingredients.forEach(i => {
        const name = i.split(' ')[0]
        if (!EXCLUDE_INGREDIENTS.some(e => name.includes(e))) ings.add(name)
      })
    })
    return Array.from(ings).sort()
  })

  const filteredDishes = computed(() =>
    dishes.value.filter(d => {
      if (typeFilter.value && d.type !== typeFilter.value) return false
      if (ingredientFilter.value && !d.ingredients.some(i => i.includes(ingredientFilter.value))) return false
      return true
    })
  )

  const clearFilters = () => {
    typeFilter.value = ''
    ingredientFilter.value = ''
  }

  const addDish = async (dish: Dish) => {
    const dishesRef = dbRef(db, 'dishes')
    const newDishes = [...dishes.value, dish]
    await set(dishesRef, newDishes)
  }

  return { dishes, typeFilter, ingredientFilter, allIngredients, filteredDishes, clearFilters, addDish }
}
