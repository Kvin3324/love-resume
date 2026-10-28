<template>
  <section
    :id="id"
    class="rounded-[1.75rem] border border-ink-200/80 bg-white/70 p-5 shadow-card sm:p-6"
    :aria-labelledby="title ? headingId : undefined"
  >
    <div v-if="title || $slots.actions" class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div v-if="title">
        <h2 :id="headingId" class="font-display text-2xl leading-tight text-ink-900 sm:text-[1.7rem]">{{ title }}</h2>
        <p v-if="subtitle" class="mt-1.5 max-w-prose text-pretty text-sm leading-relaxed text-ink-500">{{ subtitle }}</p>
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
import { useFieldId } from '../../composables/useFieldId';

defineProps<{
  title?: string;
  subtitle?: string;
  id?: string;
}>();

const headingId = useFieldId('panel-title');
</script>
