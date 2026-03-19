<template>
  <div class="history-page">
    <header>
      <h1>📅 历史</h1>
      <div class="actions">
        <button class="export-btn" @click="handleExport">导出</button>
        <button class="import-btn" @click="triggerImport">导入</button>
        <button class="clear-btn" @click="handleClear">清空</button>
        <input ref="fileInput" type="file" accept=".json" @change="handleImport" style="display: none">
        <button class="back-btn" @click="$emit('back')">← 返回</button>
      </div>
    </header>

    <div v-if="history.length === 0" class="empty">暂无历史记录</div>

    <div v-else class="history-list">
      <div v-for="record in history" :key="record.date" class="record">
        <h3>{{ record.date }}</h3>
        <div class="dishes">
          <span v-for="dish in record.dishes" :key="dish.id" class="dish-tag">
            {{ dish.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Dish } from '../types/dish'
import { exportData, importData, clearAllRecords } from '../utils/db'

interface DailyRecord {
  date: string
  dishes: Dish[]
}

defineProps<{ history: DailyRecord[] }>()
const emit = defineEmits<{ back: []; refresh: [] }>()

const fileInput = ref<HTMLInputElement>()

const handleExport = async () => {
  const data = await exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `menu-history-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  fileInput.value?.click()
}

const handleImport = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  await importData(text)
  emit('refresh')
}

const handleClear = async () => {
  if (confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
    await clearAllRecords()
    emit('refresh')
  }
}
</script>

<style scoped>
.history-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 { color: #2c3e50; margin: 0; }

.actions {
  display: flex;
  gap: 10px;
}

.export-btn, .import-btn, .clear-btn, .back-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover, .import-btn:hover, .back-btn:hover {
  background: #f0f0f0;
}

.clear-btn {
  border-color: #e74c3c;
  color: #e74c3c;
}

.clear-btn:hover {
  background: #e74c3c;
  color: white;
}

.empty {
  text-align: center;
  color: #95a5a6;
  padding: 60px 0;
  font-size: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.record h3 {
  color: #27ae60;
  margin: 0 0 15px;
  font-size: 1.1em;
}

.dishes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish-tag {
  padding: 6px 12px;
  background: #e8f5e9;
  color: #27ae60;
  border-radius: 6px;
  font-size: 14px;
}
</style>
