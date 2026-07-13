<template>
  <Panel :title="$t('skills.title')">
    <div class="flex items-center justify-center">
      <svg viewBox="0 0 120 120" class="h-40 w-40">
        <circle cx="60" cy="60" r="44" class="fill-none stroke-slate-800 stroke-[32]" />
        <circle
          v-for="segment in segments"
          :key="segment.name"
          cx="60"
          cy="60"
          r="44"
          fill="none"
          :stroke="segment.color"
          stroke-width="32"
          :stroke-dasharray="`${276.5 * segment.ratio} 276.5`"
          :stroke-dashoffset="segment.offset"
          stroke-linecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
    </div>
    <div class="mt-5 grid gap-3 text-sm text-slate-300">
      <div v-for="segment in segments" :key="segment.name" class="flex items-center gap-3">
        <span :style="{ background: segment.color }" class="inline-flex h-3 w-3 rounded-full"></span>
        <span class="font-medium text-slate-100">{{ segment.name }}</span>
        <span class="ml-auto text-slate-400">{{ segment.label }}</span>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Panel from './ui/Panel.vue';

export interface VibeSegment {
  name: string;
  label: string;
  color: string;
  ratio: number;
  offset: number;
}

defineProps<{
  segments: VibeSegment[];
}>();
</script>
