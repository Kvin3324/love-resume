<template>
  <div class="grid gap-2">
    <label v-if="label" class="text-sm font-medium text-slate-200">{{ label }}</label>
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      class="min-h-[120px] rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { censorText } from '../../utils/profanityFilter';

withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    rows?: number;
  }>(),
  { rows: 4 }
);

const rawModel = defineModel<string>({ default: '' });

const model = computed<string>({
  get: () => rawModel.value,
  set: (value) => {
    rawModel.value = typeof value === 'string' ? censorText(value) : value;
  }
});
</script>
