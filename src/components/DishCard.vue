<template>
  <div class="dish-card" @click="$emit('click')">
    <div class="card-header">
      <span class="type-badge">{{ typeIcon }} {{ dish.type }}</span>
    </div>
    <h3>{{ dish.name }}</h3>
    <p class="category">{{ dish.category }}</p>
    <div class="card-footer">
      <span>📝 {{ dish.ingredients.length }} 种食材</span>
      <span>👨‍🍳 {{ dish.steps.length }} 个步骤</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Dish } from '../types/dish'

const props = defineProps<{ dish: Dish }>()
defineEmits<{ click: [] }>()

const TYPE_ICONS: Record<string, string> = { '荤菜': '🥩', '素菜': '🥬', '面食': '🍜' }
const typeIcon = computed(() => TYPE_ICONS[props.dish.type] || '🍽️')
</script>

<style scoped>
.dish-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.dish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.card-header { margin-bottom: 10px; }

.type-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #ecf0f1;
  border-radius: 12px;
  font-size: 12px;
  color: #34495e;
}

h3 {
  margin: 10px 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.category {
  color: #95a5a6;
  font-size: 13px;
  margin: 5px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
  font-size: 12px;
  color: #7f8c8d;
}
</style>
