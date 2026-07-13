<template>
  <div class="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <AppHeader @generate-pdf="generatePdf" />

      <section class="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <div class="space-y-6">
          <ProfileFormSection :form="form" :privacy-label="privacyLabel" />

          <TraitsSection
            :form="form"
            v-model:new-trait="newTrait"
            v-model:new-value="newValue"
            @reset="resetTraits"
            @add-trait="addTrait"
            @add-value="addValue"
            @remove-trait="removeTrait"
            @remove-value="removeValue"
          />

          <RelationshipsSection
            :relationships="form.relationships"
            :draft="relationshipDraft"
            @add="addRelationship"
            @remove="removeRelationship"
          />

          <ReferencesSection
            :references="form.references"
            :draft="referenceDraft"
            @add="addReference"
            @remove="removeReference"
          />
        </div>

        <aside class="space-y-6">
          <ResumePreview :form="form" :privacy-label="privacyLabel" />
          <PrivacyLegendSection />
          <VibesChartSection :segments="skillSegments" />
        </aside>
      </section>
    </div>

    <div class="pointer-events-none fixed left-[-9999px] top-0" aria-hidden="true">
      <PdfDocument :form="form" :privacy-label="privacyLabel" :skill-segments="skillSegments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import ProfileFormSection from './components/ProfileFormSection.vue';
import TraitsSection from './components/TraitsSection.vue';
import RelationshipsSection from './components/RelationshipsSection.vue';
import ReferencesSection from './components/ReferencesSection.vue';
import ResumePreview from './components/ResumePreview.vue';
import PrivacyLegendSection from './components/PrivacyLegendSection.vue';
import VibesChartSection from './components/VibesChartSection.vue';
import PdfDocument from './components/PdfDocument.vue';
import { useLoveResumeForm } from './composables/useLoveResumeForm';

const {
  form,
  newTrait,
  newValue,
  relationshipDraft,
  referenceDraft,
  addTrait,
  addValue,
  removeTrait,
  removeValue,
  addRelationship,
  removeRelationship,
  addReference,
  removeReference,
  resetTraits,
  generatePdf,
  privacyLabel,
  skillSegments
} = useLoveResumeForm();
</script>
