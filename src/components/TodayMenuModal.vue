<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2>📅 今日菜单</h2>
      <p class="count">共 {{ dishes.length }} 道菜</p>

      <div v-if="dishes.length === 0" class="empty">
        还没有添加菜品
      </div>

      <div v-else>
        <div class="dish-list">
          <div v-for="dish in dishes" :key="dish.id" class="dish-item">
            <span class="dish-name" @click="$emit('view', dish)">{{ dish.name }}</span>
            <button class="remove-btn" @click="$emit('remove', dish.id)">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dish } from '../types/dish'

defineProps<{ dishes: Dish[]; aiSummary?: string; loading?: boolean }>()
defineEmits<{ close: []; view: [dish: Dish]; remove: [id: number]; generateSummary: [] }>()
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
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

h2 { margin: 0 0 5px; color: #2c3e50; }
.count { color: #7f8c8d; font-size: 14px; margin: 0 0 20px; }

.empty {
  text-align: center;
  color: #95a5a6;
  padding: 40px 0;
}

.dish-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;
}

.dish-item:hover { background: #e9ecef; }

.dish-name {
  flex: 1;
  cursor: pointer;
  color: #2c3e50;
}

.dish-name:hover { color: #27ae60; }

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover { background: #c0392b; }

.ai-summary {
  margin-top: 20px;
  padding: 15px;
  background: #f0f8ff;
  border-radius: 8px;
  border-left: 3px solid #3498db;
  display: flex;
  gap: 10px;
  align-items: start;
}

.ai-icon {
  font-size: 20px;
}

.ai-summary p {
  margin: 0;
  color: #2c3e50;
  line-height: 1.6;
  flex: 1;
}

.ai-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: linear-gradient(135deg, #3498db, #5dade2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52,152,219,0.3);
}

.loading {
  text-align: center;
  color: #7f8c8d;
  margin-top: 15px;
}
</style>
