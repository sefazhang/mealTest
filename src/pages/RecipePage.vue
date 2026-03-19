<template>
  <div v-if="showHistory">
    <HistoryPage :history="history" @back="showHistory = false" @refresh="refreshHistory" />
  </div>
  <div v-else class="recipe-page">
    <transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>

    <header>
      <h1>🍳 先点菜吧</h1>
      <div class="header-actions">
        <button class="menu-btn" @click="showTodayMenu = true">
          📜 菜单 <span v-if="todayMenu.length">({{ todayMenu.length }})</span>
        </button>
        <button class="history-btn" @click="showHistory = true">📅 历史</button>
        <button class="random-entry" @click="showPicker = true">🎲 吃啥</button>
      </div>
    </header>

    <DishFilter
      v-model:typeFilter="typeFilter"
      v-model:ingredientFilter="ingredientFilter"
      :ingredients="allIngredients"
      @clear="clearFilters"
    />

    <div class="dish-list">
      <DishCard
        v-for="dish in filteredDishes"
        :key="dish.id"
        :dish="dish"
        @click="selected = dish"
      />
    </div>

    <DishModal
      v-if="selected"
      :dish="selected"
      @close="selected = null"
      @addToMenu="addToMenuWithToast"
    />

    <RandomPicker
      v-if="showPicker"
      :dishes="dishes"
      @close="showPicker = false"
      @view="d => selected = d"
      @addToMenu="addToMenuWithToast"
    />

    <TodayMenuModal
      v-if="showTodayMenu"
      :dishes="todayMenu"
      @close="showTodayMenu = false"
      @view="d => { selected = d; showTodayMenu = false }"
      @remove="removeFromMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDishes } from '../composables/useDishes'
import { useDailyMenu } from '../composables/useDailyMenu'
import { initSampleHistory } from '../utils/initData'
import DishFilter from '../components/DishFilter.vue'
import DishCard from '../components/DishCard.vue'
import DishModal from '../components/DishModal.vue'
import RandomPicker from '../components/RandomPicker.vue'
import TodayMenuModal from '../components/TodayMenuModal.vue'
import HistoryPage from './HistoryPage.vue'
import type { Dish } from '../types/dish'

const { dishes, typeFilter, ingredientFilter, allIngredients, filteredDishes, clearFilters } = useDishes()
const { todayMenu, history, addToMenu, removeFromMenu, archiveToday } = useDailyMenu()

const selected = ref<Dish | null>(null)
const showPicker = ref(false)
const showTodayMenu = ref(false)
const showHistory = ref(false)
const toast = ref('')

const addToMenuWithToast = (dish: Dish) => {
  addToMenu(dish)
  toast.value = `已添加「${dish.name}」到今日菜单`
  setTimeout(() => {
    toast.value = ''
  }, 2000)
}

const refreshHistory = async () => {
  const { getAllRecords } = await import('../utils/db')
  history.value = await getAllRecords()
  history.value.sort((a, b) => b.date.localeCompare(a.date))
}

let timer: number

onMounted(async () => {
  if (history.value.length === 0) {
    await initSampleHistory()
    await refreshHistory()
  }

  const checkMidnight = () => {
    const now = new Date()
    if (now.getHours() === 23 && now.getMinutes() === 0) {
      archiveToday()
    }
  }
  timer = setInterval(checkMidnight, 60000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.recipe-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  padding-top: 50px;
}

.header-actions {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  header {
    padding-top: 0;
  }

  .header-actions {
    position: static;
    justify-content: center;
    margin-top: 15px;
  }
}

.menu-btn, .history-btn, .random-entry {
  padding: 10px 18px;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn {
  background: linear-gradient(135deg, #3498db, #5dade2);
  box-shadow: 0 2px 10px rgba(52,152,219,0.3);
}
.menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(52,152,219,0.45);
}

.history-btn {
  background: linear-gradient(135deg, #9b59b6, #bb8fce);
  box-shadow: 0 2px 10px rgba(155,89,182,0.3);
}
.history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(155,89,182,0.45);
}

.random-entry {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  box-shadow: 0 2px 10px rgba(39,174,96,0.3);
}
.random-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(39,174,96,0.45);
}

h1 {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 2.5em;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.dish-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #27ae60;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  font-weight: 500;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}


</style>
