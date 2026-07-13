<template>
  <Panel id="form-top" :title="$t('profile.title')" :subtitle="$t('profile.subtitle')">
    <template #actions>
      <span class="shrink-0 whitespace-nowrap rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
        {{ $t('profile.privacyBadge', { label: privacyLabel }) }}
      </span>
    </template>
    <div class="grid gap-6">
      <BaseInput v-model="form.fullName" :label="$t('profile.fullNameLabel')" :placeholder="$t('profile.fullNamePlaceholder')" />
      <BaseInput v-model="form.role" :label="$t('profile.roleLabel')" :placeholder="$t('profile.rolePlaceholder')" />
      <BaseTextarea v-model="form.bio" :label="$t('profile.bioLabel')" :placeholder="$t('profile.bioPlaceholder')" />
      <BaseSelect v-model="form.privacy" :label="$t('profile.privacyLabel')" :options="privacyOptions" />
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { LoveResumeForm, PrivacyLevel } from '../types';
import Panel from './ui/Panel.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseTextarea from './ui/BaseTextarea.vue';
import BaseSelect, { type SelectOption } from './ui/BaseSelect.vue';

defineProps<{
  form: LoveResumeForm;
  privacyLabel: string;
}>();

const { t } = useTranslation();

const privacyOptions = computed<SelectOption<PrivacyLevel>[]>(() => [
  { value: 'public', label: t('privacy.public') },
  { value: 'semi-private', label: t('privacy.semiPrivate') },
  { value: 'link-only', label: t('privacy.linkOnly') }
]);
</script>
