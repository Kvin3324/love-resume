<template>
  <section class="rounded-3xl bg-slate-900/80 p-6 shadow-glow ring-1 ring-white/10 backdrop-blur-xl">
    <div v-if="title || $slots.actions" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div v-if="title">
        <h2 class="text-xl font-semibold text-white">{{ title }}</h2>
        <p v-if="subtitle" class="text-slate-400">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <div :class="title || $slots.actions ? 'mt-6' : ''">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>
