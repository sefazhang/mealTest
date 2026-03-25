import { ref, onMounted } from 'vue'
import type { Dish } from '../types/dish'
import { initDB, saveRecord, getAllRecords } from '../utils/db'
import { ref as dbRef, onValue, set } from 'firebase/database'
import { db } from '../firebase'

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
    history.value = await getAllRecords()
    history.value.sort((a, b) => b.date.localeCompare(a.date))

    // 监听 Firebase 今日菜单
    const menuRef = dbRef(db, `dailyMenus/${getToday()}`)
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        todayMenu.value = data
      }
    })
  }

  const saveData = async () => {
    const menuRef = dbRef(db, `dailyMenus/${getToday()}`)
    await set(menuRef, todayMenu.value)
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
