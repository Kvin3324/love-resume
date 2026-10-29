<template>
  <div class="min-h-screen">
    <a
      href="#form-top"
      class="screen-only sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
    >
      {{ $t('app.skipToForm') }}
    </a>

    <div class="screen-only mx-auto w-full max-w-[88rem] pb-[calc(7rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pb-12 lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
      <AppHeader
        :can-export="canExport"
        :is-exporting="isExporting"
        :save-label="saveLabel"
        :save-status="saveStatus"
        @generate-pdf="generatePdf"
        @retry-save="retrySave"
      />

      <section
        v-if="isFirstRun"
        class="mt-6 flex flex-col gap-4 rounded-[1.75rem] border border-brand-200 bg-brand-50/75 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div class="max-w-2xl">
          <h2 class="text-balance font-display text-2xl leading-tight text-ink-900">{{ $t('onboarding.firstTitle') }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-ink-600">{{ $t('onboarding.firstBody') }}</p>
        </div>
        <BaseButton variant="secondary" class="shrink-0" @click="loadExample">{{ $t('onboarding.loadExample') }}</BaseButton>
      </section>

      <section
        v-else-if="isExample"
        class="mt-6 flex flex-col gap-3 rounded-[1.75rem] border border-ink-200 bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div class="flex items-start gap-3">
          <span class="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            {{ $t('onboarding.exampleBadge') }}
          </span>
          <p class="max-w-2xl text-sm leading-relaxed text-ink-600">{{ $t('onboarding.exampleBody') }}</p>
        </div>
        <BaseButton variant="secondary" class="shrink-0" @click="clearAll">{{ $t('onboarding.clearCta') }}</BaseButton>
      </section>

      <main id="main" class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start">
        <div class="min-w-0 space-y-6">
          <ProfileFormSection :form="form" :privacy-label="privacyLabel" :privacy-notice="privacyNotice" />

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
            @update="updateRelationship"
            @remove="removeRelationship"
          />

          <ReferencesSection
            :references="form.references"
            :draft="referenceDraft"
            @add="addReference"
            @update="updateReference"
            @remove="removeReference"
          />

          <SkillsSection
            :skills="form.coupleSkills"
            :draft="skillDraft"
            @add="addSkill"
            @remove="removeSkill"
          />
        </div>

        <aside class="aside-scroll min-w-0 space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
          <ResumePreview
            :form="form"
            :privacy-label="privacyLabel"
            :privacy-notice="privacyNotice"
            :relationships="visibleRelationships"
            :references="visibleReferences"
          />

          <PrivacyLegendSection :current-privacy="form.privacy" />

          <div id="local-data" class="rounded-[1.75rem] border border-ink-200 bg-paper/55 p-5">
            <div class="flex items-start gap-3">
              <span class="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <svg viewBox="0 0 24 24" class="h-[1.15rem] w-[1.15rem]" fill="none" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
              </span>
              <div>
                <h2 class="font-display text-lg text-ink-900">{{ $t('onboarding.localTitle') }}</h2>
                <p class="mt-1 text-sm leading-relaxed text-ink-600">{{ $t('onboarding.localBody') }}</p>
              </div>
            </div>
            <BaseButton v-if="hasContent" variant="text" size="sm" class="mt-3" @click="clearAll">
              {{ $t('onboarding.clearCta') }}
            </BaseButton>
          </div>
        </aside>
      </main>

      <footer class="mt-10 border-t border-ink-200 pt-6 text-sm text-ink-600">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p class="font-display text-lg text-ink-900">{{ $t('app.brand') }} · {{ $t('app.brandTagline') }}</p>
          <p class="text-xs">{{ $t('footer.rights') }}</p>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-relaxed">
          <a href="#confidentialite" class="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800">
            {{ $t('footer.privacyTitle') }}
          </a>
          <span>{{ $t('footer.analytics') }}</span>
          <span>{{ $t('footer.disclaimer') }}</span>
        </div>
      </footer>
    </div>

    <div
      class="screen-only fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-ink-200 bg-[#fffdf9] pb-[calc(0.75rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-3 shadow-[0_-12px_35px_-28px_rgba(72,45,34,0.7)] lg:hidden"
    >
      <a
        href="#preview"
        class="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800"
      >
        {{ $t('app.mobilePreview') }}
      </a>
      <BaseButton class="flex-1" :disabled="!canExport" :loading="isExporting" @click="generatePdf">
        {{ isExporting ? $t('export.loading') : $t('app.mobileDownload') }}
      </BaseButton>
    </div>

    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="screen-only fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex items-start gap-3 rounded-2xl bg-ink-900 px-4 py-3 text-sm leading-relaxed text-paper shadow-card lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-md"
        role="status"
        aria-live="polite"
      >
        <p class="min-w-0 flex-1">{{ toastMessage }}</p>
        <button
          v-if="toastActionLabel"
          type="button"
          class="min-h-11 shrink-0 rounded-full px-2 text-sm font-semibold text-paper underline decoration-paper/50 underline-offset-4 hover:decoration-paper"
          @click="runToastAction"
        >
          {{ toastActionLabel }}
        </button>
      </div>
    </Transition>

    <ConfirmDialog />

    <PdfDocument
      :form="form"
      :relationships="visibleRelationships"
      :references="visibleReferences"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import ProfileFormSection from './components/ProfileFormSection.vue';
import TraitsSection from './components/TraitsSection.vue';
import RelationshipsSection from './components/RelationshipsSection.vue';
import ReferencesSection from './components/ReferencesSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import ResumePreview from './components/ResumePreview.vue';
import PrivacyLegendSection from './components/PrivacyLegendSection.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import PdfDocument from './components/PdfDocument.vue';
import BaseButton from './components/ui/BaseButton.vue';
import { useLoveResumeForm } from './composables/useLoveResumeForm';

const {
  form,
  isExample,
  isFirstRun,
  hasContent,
  canExport,
  isExporting,
  saveStatus,
  saveLabel,
  retrySave,
  toastMessage,
  toastActionLabel,
  runToastAction,
  newTrait,
  newValue,
  relationshipDraft,
  referenceDraft,
  skillDraft,
  addTrait,
  addValue,
  removeTrait,
  removeValue,
  addRelationship,
  updateRelationship,
  removeRelationship,
  addReference,
  updateReference,
  removeReference,
  addSkill,
  removeSkill,
  resetTraits,
  loadExample,
  clearAll,
  generatePdf,
  privacyLabel,
  privacyNotice,
  visibleRelationships,
  visibleReferences
} = useLoveResumeForm();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
