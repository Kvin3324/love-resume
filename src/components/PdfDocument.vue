<template>
  <div class="pointer-events-none fixed left-[-9999px] top-0" aria-hidden="true">
    <div id="pdf-export-root" class="w-[794px] bg-white p-[45px]">
      <ResumeDocument
        :form="form"
        :relationships="relationships"
        :references="references"
        variant="print"
      />
    </div>
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
