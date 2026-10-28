<template>
  <div class="print-only print-root" aria-hidden="true">
    <ResumeDocument
      :form="form"
      :relationships="relationships"
      :references="references"
      variant="print"
    />
  </div>
</template>

<script setup lang="ts">
import type { LoveResumeForm, ReferenceEntry, RelationshipEntry } from '../types';
import ResumeDocument from './ResumeDocument.vue';

defineProps<{
  form: LoveResumeForm;
  relationships: RelationshipEntry[];
  references: ReferenceEntry[];
}>();
</script>
