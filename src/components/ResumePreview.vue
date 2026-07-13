<template>
  <Panel :title="$t('preview.title')" :subtitle="$t('preview.subtitle')">
    <div id="pdf-preview" class="space-y-4 rounded-3xl bg-slate-950/90 p-5 overflow-y-auto max-h-[600px]">
      <!-- Header -->
      <div class="border-b border-slate-700 pb-3">
        <p class="text-xs uppercase tracking-[0.3em] text-brand-300">{{ privacyLabel }}</p>
        <h3 class="mt-2 text-2xl font-bold text-white">{{ form.fullName || $t('preview.defaultName') }}</h3>
        <p class="mt-1 text-sm text-brand-300">{{ form.role || $t('preview.defaultRole') }}</p>
      </div>

      <!-- Bio -->
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.whoIAm') }}</p>
        <p class="mt-2 text-xs text-slate-200 leading-tight">{{ form.bio || $t('preview.defaultBio') }}</p>
      </div>

      <!-- Personnalité & Valeurs -->
      <div class="grid gap-2 grid-cols-2">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.personality') }}</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <Chip v-for="trait in form.personalityTraits" :key="trait" variant="brand" size="xs">{{ trait }}</Chip>
          </div>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.values') }}</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <Chip v-for="value in form.values" :key="value" variant="neutral" size="xs">{{ value }}</Chip>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.skills') }}</p>
        <div class="mt-2 space-y-1.5">
          <SkillBar v-for="skill in form.coupleSkills" :key="skill.id" :name="skill.name" :level="skill.level" />
        </div>
      </div>

      <!-- Relations -->
      <div v-if="form.relationships.length > 0">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.journey') }}</p>
        <div class="mt-1 space-y-1">
          <div v-for="rel in form.relationships" :key="rel.id" class="rounded-lg bg-slate-900/60 p-2 border border-slate-700 text-xs">
            <p class="font-medium text-white">{{ rel.partnerName }}</p>
            <p class="text-slate-400">{{ rel.startDate }} → {{ rel.endDate }}</p>
            <p class="text-slate-500">{{ rel.reason }}</p>
          </div>
        </div>
      </div>

      <!-- Avis -->
      <div v-if="form.references.length > 0">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{{ $t('preview.reviews') }}</p>
        <div class="mt-1 space-y-1">
          <div v-for="ref in form.references" :key="ref.id" class="rounded-lg bg-slate-900/60 p-2 border border-slate-700 text-xs">
            <p class="italic text-slate-100">"{{ ref.quote }}"</p>
            <p class="text-slate-400 mt-0.5">— {{ ref.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { LoveResumeForm } from '../types';
import Panel from './ui/Panel.vue';
import Chip from './ui/Chip.vue';
import SkillBar from './ui/SkillBar.vue';

defineProps<{
  form: LoveResumeForm;
  privacyLabel: string;
}>();
</script>
