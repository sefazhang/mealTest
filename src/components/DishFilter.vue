<template>
  <div class="filters">
    <div class="filter-group">
      <span>🏷️</span>
      <select :value="typeFilter" @change="$emit('update:typeFilter', ($event.target as HTMLSelectElement).value)">
        <option value="">全部分类</option>
        <option value="荤菜">🥩 荤菜</option>
        <option value="素菜">🥬 素菜</option>
        <option value="面食">🍜 面食</option>
      </select>
    </div>

    <div class="filter-group">
      <span>🥘</span>
      <select :value="ingredientFilter" @change="$emit('update:ingredientFilter', ($event.target as HTMLSelectElement).value)">
        <option value="">选择食材</option>
        <option v-for="ing in ingredients" :key="ing" :value="ing">{{ ing }}</option>
      </select>
    </div>

    <button v-if="typeFilter || ingredientFilter" class="clear-btn" @click="$emit('clear')">
      ✕ 清除筛选
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  typeFilter: string
  ingredientFilter: string
  ingredients: string[]
}>()

defineEmits<{
  'update:typeFilter': [value: string]
  'update:ingredientFilter': [value: string]
  'clear': []
}>()
</script>

<style scoped>
.filters {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 5px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.filter-group select {
  padding: 8px 15px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
}

.filter-group select:focus { outline: none; }

.clear-btn {
  padding: 8px 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.clear-btn:hover { background: #c0392b; }
</style>
