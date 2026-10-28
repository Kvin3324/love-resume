<template>
  <section id="preview" class="min-w-0" aria-labelledby="preview-title">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 id="preview-title" class="font-display text-2xl leading-tight text-ink-900 sm:text-[1.7rem]">
          {{ $t('preview.title') }}
        </h2>
        <p class="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-600">{{ $t('preview.subtitle') }}</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink-200 bg-white/60 px-3 py-1.5 text-xs font-semibold text-ink-600">
        <span class="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true"></span>
        {{ privacyLabel }}
      </span>
    </div>
    <div class="mx-auto mt-6 w-full max-w-[31rem]">
      <ResumeDocument
        :form="form"
        :relationships="relationships"
        :references="references"
        variant="preview"
      />
      <p class="mt-3 px-1 text-xs leading-relaxed text-ink-600">{{ privacyNotice }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LoveResumeForm, ReferenceEntry, RelationshipEntry } from '../types';
import ResumeDocument from './ResumeDocument.vue';

defineProps<{
  form: LoveResumeForm;
  privacyLabel: string;
  privacyNotice: string;
  relationships: RelationshipEntry[];
  references: ReferenceEntry[];
}>();
</script>
