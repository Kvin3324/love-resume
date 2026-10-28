<template>
  <div>
    <div class="flex items-baseline justify-between gap-3 text-xs">
      <span class="font-semibold text-ink-800">{{ name }}</span>
      <span class="tabular-nums text-ink-500">{{ level }}/10</span>
    </div>
    <div
      class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100"
      role="progressbar"
      :aria-label="name"
      :aria-valuenow="level"
      aria-valuemin="0"
      aria-valuemax="10"
      :aria-valuetext="`${name}: ${level}/10`"
    >
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
