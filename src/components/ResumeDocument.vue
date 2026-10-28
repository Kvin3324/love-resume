<template>
  <article :class="shellClass" :aria-label="$t('preview.title')">
    <header class="print-avoid-break flex items-start justify-between gap-5 border-b-2 border-ink-900/80 pb-5">
      <div class="min-w-0">
        <h1 :class="nameClass" class="text-balance font-display leading-[0.95] tracking-[-0.025em] text-ink-900">
          {{ displayName }}
        </h1>
        <p :class="roleClass" class="mt-2 text-pretty font-display italic text-brand-700">{{ displayRole }}</p>
      </div>
      <div class="flex shrink-0 flex-col items-end gap-2">
        <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-paper font-display text-sm font-bold text-ink-700">
          {{ initials }}
        </span>
      </div>
    </header>

    <div v-if="showEmptyHint" class="print-avoid-break mt-5 border-y border-dashed border-ink-300 py-4">
      <p class="font-display text-lg text-ink-900">{{ $t('preview.emptyTitle') }}</p>
      <p class="mt-1 text-xs leading-relaxed text-ink-500">{{ $t('preview.emptyHint') }}</p>
    </div>

    <div :class="bodyGridClass" class="mt-5">
      <div class="space-y-5">
        <section v-if="displayBio" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.whoIAm') }}</h2>
          <p :class="bodyTextClass" class="mt-2 text-pretty text-ink-700">{{ displayBio }}</p>
        </section>

        <section v-if="relationships.length" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.journey') }}</h2>
          <div class="mt-3 space-y-3">
            <article
              v-for="relationship in relationships"
              :key="relationship.id"
              class="border-l border-ink-200 pl-3.5"
            >
              <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 class="font-display text-base text-ink-900">{{ relationship.partnerName }}</h3>
                <span v-if="relationshipDate(relationship)" class="text-xs tabular-nums text-ink-500">
                  {{ relationshipDate(relationship) }}
                </span>
              </div>
              <p v-if="relationship.duration" class="mt-0.5 text-xs text-ink-500">{{ relationship.duration }}</p>
              <p v-if="relationship.reason" class="mt-1 text-pretty text-xs leading-relaxed text-ink-700">
                {{ relationship.reason }}
              </p>
            </article>
          </div>
        </section>

        <section v-if="references.length" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.reviews') }}</h2>
          <div class="mt-3 space-y-3">
            <blockquote
              v-for="reference in references"
              :key="reference.id"
              class="border-l border-brand-300 pl-3.5"
            >
              <p class="text-pretty font-display text-[0.95rem] leading-relaxed text-ink-800">“{{ reference.quote }}”</p>
              <cite class="mt-1.5 block text-xs not-italic text-ink-500">
                {{ reference.name }}<template v-if="reference.relation"> · {{ reference.relation }}</template>
              </cite>
            </blockquote>
          </div>
        </section>

        <section v-if="form.privacy === 'private' && variant === 'preview'" class="print-avoid-break rounded-2xl bg-ink-50 p-3.5">
          <h2 class="font-display text-base text-ink-900">{{ $t('preview.privateTitle') }}</h2>
          <p class="mt-1 text-xs leading-relaxed text-ink-500">{{ $t('preview.privateBody') }}</p>
        </section>

        <p v-if="showEmptySections" class="text-xs leading-relaxed text-ink-500">
          {{ emptySectionsLabel }}
        </p>
      </div>

      <aside class="space-y-5">
        <section v-if="form.personalityTraits.length" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.personality') }}</h2>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <span
              v-for="trait in form.personalityTraits"
              :key="trait"
              class="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-800"
            >
              {{ trait }}
            </span>
          </div>
        </section>

        <section v-if="form.values.length" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.values') }}</h2>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <span
              v-for="value in form.values"
              :key="value"
              class="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700"
            >
              {{ value }}
            </span>
          </div>
        </section>

        <section v-if="form.coupleSkills.length" class="print-avoid-break">
          <h2 :class="sectionTitleClass">{{ $t('preview.skills') }}</h2>
          <div class="mt-3 space-y-2.5">
            <SkillBar v-for="skill in form.coupleSkills" :key="skill.id" :name="skill.name" :level="skill.level" />
          </div>
        </section>
      </aside>
    </div>

    <footer class="print-avoid-break mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t border-ink-200 pt-3.5">
      <span class="font-display text-sm text-ink-900">{{ $t('app.brand') }}</span>
      <span class="text-xs text-ink-500">{{ $t('preview.createYours', { url: APP_DOMAIN }) }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { LoveResumeForm, ReferenceEntry, RelationshipEntry } from '../types';
import { formatDateRange } from '../utils/dates';
import SkillBar from './ui/SkillBar.vue';
import { APP_DOMAIN } from '../config';

const props = withDefaults(
  defineProps<{
    form: LoveResumeForm;
    relationships: RelationshipEntry[];
    references: ReferenceEntry[];
    variant?: 'preview' | 'print';
  }>(),
  { variant: 'preview' }
);

const { t, i18next } = useTranslation();

const isPreview = computed(() => props.variant === 'preview');
const displayName = computed(() => props.form.fullName || t('preview.defaultName'));
const displayRole = computed(() => props.form.role || t('preview.defaultRole'));
const displayBio = computed(() => props.form.bio || (isPreview.value ? t('preview.defaultBio') : ''));

const initials = computed(() => {
  const parts = props.form.fullName.trim().split(/\s+/).filter(Boolean);
  const value = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return value || 'LR';
});

const shellClass = computed(() =>
  isPreview.value
    ? 'paper-texture rounded-[1.35rem] border border-ink-200 p-5 text-ink-900 shadow-paper sm:p-6'
    : 'resume-print bg-white text-ink-900'
);

const nameClass = computed(() => (isPreview.value ? 'text-[2.25rem]' : 'text-[3.2rem]'));
const roleClass = computed(() => (isPreview.value ? 'text-[0.95rem]' : 'text-[1.15rem]'));
const sectionTitleClass = computed(() =>
  isPreview.value
    ? 'flex items-center gap-2 font-display text-[0.98rem] font-semibold text-ink-900 before:h-px before:w-3 before:bg-brand-400'
    : 'flex items-center gap-2 font-display text-[1.05rem] font-semibold text-ink-900 before:h-px before:w-3 before:bg-brand-400'
);
const bodyTextClass = computed(() => (isPreview.value ? 'text-[0.76rem] leading-relaxed' : 'text-[0.86rem] leading-relaxed'));
const bodyGridClass = computed(() =>
  isPreview.value ? 'grid grid-cols-1 gap-5' : 'grid grid-cols-[1.55fr_0.85fr] gap-7'
);

const showEmptyHint = computed(() => isPreview.value && !props.form.fullName && !props.form.bio);
const showEmptySections = computed(
  () =>
    isPreview.value &&
    !props.relationships.length &&
    !props.references.length &&
    props.form.privacy !== 'private'
);
const emptySectionsLabel = computed(() =>
  [t('preview.noRelationships'), t('preview.noReferences')].join(' ')
);

const relationshipDate = (relationship: RelationshipEntry): string =>
  formatDateRange(relationship.startDate, relationship.endDate, i18next.language);
</script>
