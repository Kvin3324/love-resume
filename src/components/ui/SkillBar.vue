<template>
  <div>
    <div class="flex justify-between text-xs">
      <span class="font-medium text-slate-100">{{ name }}</span>
      <span class="text-brand-300">{{ level }}/10</span>
    </div>
    <div class="mt-0.5 h-1 rounded-full bg-slate-700">
      <div :style="{ width: `${level * 10}%` }" class="h-full rounded-full bg-brand-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  level: number;
}>();
</script>
