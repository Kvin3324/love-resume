<template>
  <div
    id="pdf-export-root"
    class="w-[794px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-14 text-slate-100"
  >
    <!-- Header -->
    <header class="pdf-avoid-break flex items-start justify-between gap-6 border-b border-brand-500/30 pb-8">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.4em] text-brand-300">{{ $t('app.brand') }}</p>
        <h1 class="mt-4 text-5xl font-bold text-white">{{ form.fullName || $t('preview.defaultName') }}</h1>
        <p class="mt-2 text-lg text-brand-200">{{ form.role || $t('preview.defaultRole') }}</p>
      </div>
      <Badge variant="brand" class="shrink-0 whitespace-nowrap px-5">{{ privacyLabel }}</Badge>
    </header>

    <!-- Bio -->
    <section class="pdf-avoid-break">
      <h2 class="pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">{{ $t('preview.whoIAm') }}</h2>
      <p class="mt-3 text-base leading-relaxed text-slate-200">{{ form.bio || $t('preview.defaultBio') }}</p>
    </section>

    <!-- Personality & Values -->
    <section class="pdf-avoid-break grid grid-cols-2 gap-8">
      <div>
        <h2 class="pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">{{ $t('preview.personality') }}</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <Badge v-for="trait in form.personalityTraits" :key="trait" variant="brand">{{ trait }}</Badge>
        </div>
      </div>
      <div>
        <h2 class="pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">{{ $t('preview.values') }}</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <Badge v-for="value in form.values" :key="value" variant="neutral">{{ value }}</Badge>
        </div>
      </div>
    </section>

    <!-- Vibes chart -->
    <section class="pdf-avoid-break mt-14 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
      <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-brand-300">{{ $t('skills.title') }}</h2>
      <div class="mt-6 flex items-center gap-10">
        <svg viewBox="0 0 120 120" class="h-40 w-40 shrink-0">
          <circle cx="60" cy="60" r="44" class="fill-none stroke-slate-800 stroke-[32]" />
          <circle
            v-for="segment in skillSegments"
            :key="segment.name"
            cx="60"
            cy="60"
            r="44"
            fill="none"
            :stroke="segment.color"
            stroke-width="32"
            :stroke-dasharray="`${276.5 * segment.ratio} 276.5`"
            :stroke-dashoffset="segment.offset"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div class="flex-1">
          <div
            v-for="segment in skillSegments"
            :key="segment.name"
            class="mt-3 flex items-center gap-3 first:mt-0"
          >
            <span :style="{ background: segment.color }" class="h-3 w-3 shrink-0 rounded-full"></span>
            <span class="flex-1 font-medium text-slate-100">{{ segment.name }}</span>
            <span class="text-slate-400">{{ segment.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section class="pdf-avoid-break">
      <h2 class="pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">{{ $t('preview.skills') }}</h2>
      <div class="mt-4 grid gap-4">
        <div v-for="skill in form.coupleSkills" :key="skill.id">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-slate-100">{{ skill.name }}</span>
            <span class="text-brand-300">{{ skill.level }}/10</span>
          </div>
          <div class="mt-1.5 h-2 rounded-full bg-slate-800">
            <div :style="{ width: `${skill.level * 10}%` }" class="h-full rounded-full bg-brand-500"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Relationships -->
    <section v-if="form.relationships.length > 0">
      <h2 class="pdf-avoid-break pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">
        {{ $t('preview.journey') }}
      </h2>
      <div class="mt-4 grid gap-3">
        <div
          v-for="rel in form.relationships"
          :key="rel.id"
          class="pdf-avoid-break rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
        >
          <div class="flex items-baseline justify-between gap-3">
            <p class="text-base font-semibold text-white">{{ rel.partnerName }}</p>
            <p class="text-xs text-slate-400">{{ rel.startDate }} → {{ rel.endDate }}</p>
          </div>
          <p class="mt-1 text-sm text-slate-400">{{ rel.duration }}</p>
          <p class="mt-2 text-sm text-slate-300">{{ rel.reason }}</p>
        </div>
      </div>
    </section>

    <!-- References -->
    <section v-if="form.references.length > 0">
      <h2 class="pdf-avoid-break pt-14 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">
        {{ $t('preview.reviews') }}
      </h2>
      <div class="mt-4 grid gap-3">
        <div
          v-for="ref in form.references"
          :key="ref.id"
          class="pdf-avoid-break rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
        >
          <p class="text-base italic leading-relaxed text-slate-100">"{{ ref.quote }}"</p>
          <p class="mt-3 text-sm text-slate-400">— {{ ref.name }} · {{ ref.relation }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="pdf-avoid-break mt-14 border-t border-white/10 pt-6 text-center">
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">{{ $t('app.brand') }}</p>
      <a :href="APP_URL" class="mt-4 inline-block text-sm font-medium text-brand-300">
        {{ $t('preview.createYours', { url: APP_DOMAIN }) }}
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { LoveResumeForm } from '../types';
import type { VibeSegment } from './VibesChartSection.vue';
import { Badge } from '@/components/ui/badge';
import { APP_DOMAIN, APP_URL } from '../config';

defineProps<{
  form: LoveResumeForm;
  privacyLabel: string;
  skillSegments: VibeSegment[];
}>();
</script>
