<template>
  <div class="grid gap-2">
    <label v-if="label" :for="id" class="text-sm font-semibold text-ink-700">
      {{ label }}
      <span v-if="required" class="text-brand-600" aria-hidden="true">*</span>
    </label>
    <div class="grid gap-1.5">
      <textarea
        :id="id"
        v-model="rawModel"
        :rows="rows"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxlength"
        :aria-invalid="Boolean(error) || undefined"
        :aria-describedby="describedBy"
        class="min-h-[140px] w-full resize-y rounded-3xl border px-4 py-3 text-ink-900 transition placeholder:text-ink-500 hover:border-ink-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        :class="error ? 'border-brand-500 bg-brand-50/50' : 'border-ink-200 bg-[#fffdf9]'"
        @input="scheduleSanitize"
        @blur="sanitizeNow"
      />
      <p v-if="error" :id="hintId" class="text-xs font-medium text-brand-700">{{ error }}</p>
      <p v-else-if="hint" :id="hintId" class="text-pretty text-xs leading-relaxed text-ink-500">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFieldId } from '../../composables/useFieldId';
import { useProfanitySanitizer } from '../../composables/useProfanitySanitizer';

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    rows?: number;
    hint?: string;
    error?: string;
    required?: boolean;
    sanitize?: boolean;
    maxlength?: number;
  }>(),
  {
    rows: 4,
    required: false,
    sanitize: false,
    maxlength: undefined
  }
);

const id = useFieldId('textarea');
const hintId = `${id}-hint`;
const describedBy = computed(() => (props.hint || props.error ? hintId : undefined));
const rawModel = defineModel<string>({ default: '' });

const { scheduleSanitize, sanitizeNow } = useProfanitySanitizer(rawModel, {
  enabled: () => props.sanitize
});
</script>
