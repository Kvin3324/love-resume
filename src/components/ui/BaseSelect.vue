<template>
  <div class="grid gap-2 sm:grid-cols-2">
    <label v-if="label" class="text-sm font-medium text-slate-200">{{ label }}</label>
    <select
      v-model="model"
      class="rounded-2xl border border-slate-700 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
      :class="tone === 'draft' ? 'bg-slate-950' : 'bg-slate-950/90'"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

withDefaults(
  defineProps<{
    label?: string;
    options: SelectOption<T>[];
    tone?: 'default' | 'draft';
  }>(),
  { tone: 'default' }
);

const model = defineModel<T>({ required: true });
</script>
