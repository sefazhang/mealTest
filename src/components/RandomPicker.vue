<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="picker-modal">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2>🎲 今天吃什么？</h2>

      <div class="type-options">
        <button
          v-for="opt in options"
          :key="opt.value"
          :class="['type-btn', { active: selected === opt.value }]"
          @click="selected = opt.value; result = null"
        >
          {{ opt.icon }} {{ opt.label }}
        </button>
      </div>

      <button class="pick-btn" :disabled="!selected || rolling" @click="pick">
        🎰 开始抽取
      </button>

      <div v-if="rolling" class="rolling-wrap">
        <span class="dice">🎲</span>
      </div>

      <transition name="pop">
        <div v-if="result" class="result">
          <p class="result-label">今天就吃</p>
          <h3>{{ result.name }}</h3>
          <p class="result-meta">{{ result.type }} · {{ result.ingredients.length }} 种食材 · {{ result.steps.length }} 个步骤</p>
          <div class="result-actions">
            <button class="again-btn" @click="pick">再抽一次</button>
            <button class="again-btn" @click="$emit('view', result)">查看菜谱</button>
            <button class="view-btn" @click="$emit('addToMenu', result)">纳入菜单 →</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Dish } from '../types/dish'

const props = defineProps<{ dishes: Dish[] }>()
const emit = defineEmits<{ close: []; view: [dish: Dish]; addToMenu: [dish: Dish] }>()

const options = [
  { value: '荤菜', label: '荤菜', icon: '🥩' },
  { value: '素菜', label: '素菜', icon: '🥬' },
]

const selected = ref('')
const result = ref<Dish | null>(null)
const rolling = ref(false)

const pick = () => {
  const pool = props.dishes.filter(d => d.type === selected.value)
  if (!pool.length) return
  result.value = null
  rolling.value = true
  setTimeout(() => {
    rolling.value = false
    result.value = pool[Math.floor(Math.random() * pool.length)]
  }, 1500)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 90%;
  max-width: 420px;
  text-align: center;
  position: relative;
  box-shadow: 0 12px 48px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ecf0f1;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  color: #7f8c8d;
  transition: all 0.2s;
}
.close-btn:hover { background: #e74c3c; color: white; }

h2 { margin: 0 0 28px; color: #2c3e50; font-size: 1.6em; }

.type-options {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
}

.type-btn {
  padding: 12px 22px;
  border: 2px solid #ecf0f1;
  border-radius: 12px;
  background: white;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  color: #555;
}
.type-btn:hover { border-color: #27ae60; color: #27ae60; }
.type-btn.active { border-color: #27ae60; background: #27ae60; color: white; }

.pick-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.pick-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(39,174,96,0.4); }
.pick-btn:disabled { background: #bdc3c7; cursor: not-allowed; }

.rolling-wrap {
  margin-top: 28px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice {
  font-size: 56px;
  display: inline-block;
  animation: roll 0.4s linear infinite;
  transform-origin: center;
}

@keyframes roll {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(90deg) scale(1.15); }
  50%  { transform: rotate(180deg) scale(1); }
  75%  { transform: rotate(270deg) scale(1.15); }
  100% { transform: rotate(360deg) scale(1); }
}

.result {
  margin-top: 28px;
  padding: 24px;
  background: #f8fffe;
  border: 2px solid #d5f5e3;
  border-radius: 14px;
}

.result-label { color: #7f8c8d; font-size: 13px; margin: 0 0 8px; }

.result h3 { font-size: 2em; color: #27ae60; margin: 0 0 8px; }

.result-meta { color: #95a5a6; font-size: 13px; margin: 0 0 20px; }

.result-actions { display: flex; gap: 8px; justify-content: center; }

.again-btn {
  padding: 9px 16px;
  border: 2px solid #27ae60;
  border-radius: 8px;
  background: white;
  color: #27ae60;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.again-btn:hover { background: #27ae60; color: white; }

.add-btn {
  padding: 9px 16px;
  border: 2px solid #3498db;
  border-radius: 8px;
  background: white;
  color: #3498db;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.add-btn:hover { background: #3498db; color: white; }

.view-btn {
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  background: #27ae60;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.view-btn:hover { background: #219a52; }

.pop-enter-active { animation: pop 0.3s ease; }
@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
