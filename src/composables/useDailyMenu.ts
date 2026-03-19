import { ref, onMounted } from 'vue'
import type { Dish } from '../types/dish'
import { initDB, saveRecord, getAllRecords } from '../utils/db'

interface DailyRecord {
  date: string
  dishes: Dish[]
}

export function useDailyMenu() {
  const todayMenu = ref<Dish[]>([])
  const history = ref<DailyRecord[]>([])

  const getToday = () => new Date().toISOString().split('T')[0]

  const loadData = async () => {
    await initDB()

    const stored = localStorage.getItem('dailyMenu')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.date === getToday()) {
        todayMenu.value = data.dishes
      } else {
        todayMenu.value = []
      }
    }

    history.value = await getAllRecords()
    history.value.sort((a, b) => b.date.localeCompare(a.date))
  }

  const saveData = () => {
    localStorage.setItem('dailyMenu', JSON.stringify({
      date: getToday(),
      dishes: todayMenu.value
    }))
  }

  const addToMenu = (dish: Dish) => {
    if (!todayMenu.value.find(d => d.id === dish.id)) {
      todayMenu.value.push(dish)
      saveData()
    }
  }

  const removeFromMenu = (dishId: number) => {
    todayMenu.value = todayMenu.value.filter(d => d.id !== dishId)
    saveData()
  }

  const archiveToday = async () => {
    if (todayMenu.value.length > 0) {
      await saveRecord({ date: getToday(), dishes: [...todayMenu.value] })
      history.value = await getAllRecords()
      history.value.sort((a, b) => b.date.localeCompare(a.date))
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    todayMenu,
    history,
    addToMenu,
    removeFromMenu,
    archiveToday
  }
}
