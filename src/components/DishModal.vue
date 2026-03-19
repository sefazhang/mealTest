<template>
  <div class="overlay" @click.self="$emit('close')" @click.stop>
    <div class="modal">
      <div class="modal-header">
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-content">
        <h2>{{ dish.name }}</h2>

        <section>
          <h3>📝 所需食材</h3>
          <ul>
            <li v-for="(item, i) in dish.ingredients" :key="i">{{ item }}</li>
          </ul>
        </section>

        <section>
          <h3>👨‍🍳 烹饪步骤</h3>
          <ol>
            <li v-for="(step, i) in dish.steps" :key="i">{{ step }}</li>
          </ol>
        </section>

        <section v-if="dish.tips">
          <h3>⚠️ 注意事项</h3>
          <p>{{ dish.tips }}</p>
        </section>

        <section v-if="dish.link">
          <h3>🔗 参考链接</h3>
          <a :href="dish.link" target="_blank">{{ dish.link }}</a>
        </section>
      </div>
      <div class="modal-footer">
        <button class="add-to-menu-btn" @click="$emit('addToMenu', dish)">
          ➕ 纳入菜单
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dish } from '../types/dish'

defineProps<{ dish: Dish }>()
defineEmits<{ close: []; addToMenu: [dish: Dish] }>()
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 650px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 15px;
  border-radius: 16px 16px 0 0;
  z-index: 10;
}

.modal-content {
  padding: 0 40px 80px;
  overflow-y: auto;
}

.modal-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 15px 40px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
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

h2 { margin-top: 0; color: #27ae60; font-size: 2em; }

section { margin: 25px 0; }

h3 { color: #2c3e50; margin-bottom: 15px; font-size: 1.2em; }

ul, ol { padding-left: 25px; }

li { margin: 10px 0; line-height: 1.8; color: #34495e; }

a { color: #3498db; text-decoration: none; }
a:hover { text-decoration: underline; }

.add-to-menu-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39,174,96,0.3);
}
</style>
