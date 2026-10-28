<template>
  <div class="grid gap-2" :class="grid ? 'sm:grid-cols-[minmax(9rem,0.6fr)_1fr] sm:items-start' : ''">
    <label v-if="label" :for="id" class="text-sm font-semibold text-ink-700">
      {{ label }}
      <span v-if="required" class="text-brand-600" aria-hidden="true">*</span>
    </label>
    <div class="grid gap-1.5">
      <div class="relative">
        <select
          :id="id"
          v-model="model"
          :required="required"
          :aria-describedby="hint ? hintId : undefined"
          class="min-h-12 w-full cursor-pointer appearance-none rounded-2xl border py-3 pl-4 pr-10 text-ink-900 transition hover:border-ink-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          :class="tone === 'draft' ? 'border-ink-200 bg-white' : 'border-ink-200 bg-[#fffdf9]'"
        >
          <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <svg
          class="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p v-if="hint" :id="hintId" class="text-pretty text-xs leading-relaxed text-ink-500">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
import { useFieldId } from '../../composables/useFieldId';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

withDefaults(
  defineProps<{
    label?: string;
    options: SelectOption<T>[];
    tone?: 'default' | 'draft';
    hint?: string;
    required?: boolean;
    grid?: boolean;
  }>(),
  { tone: 'default', required: false, grid: true }
);

const id = useFieldId('select');
const hintId = `${id}-hint`;
const model = defineModel<T>({ required: true });
</script>
