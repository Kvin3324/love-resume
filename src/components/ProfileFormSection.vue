<template>
  <Panel id="form-top" :title="$t('profile.title')" :subtitle="$t('profile.subtitle')">
    <template #actions>
      <span class="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-3.5 py-2 text-xs font-semibold text-ink-600">
        <span class="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true"></span>
        {{ $t('profile.privacyBadge', { label: privacyLabel }) }}
      </span>
    </template>
    <div class="grid gap-5">
      <BaseInput
        v-model="form.fullName"
        :label="$t('profile.fullNameLabel')"
        :placeholder="$t('profile.fullNamePlaceholder')"
        autocomplete="name"
        required
        sanitize
        :maxlength="80"
      />
      <BaseInput
        v-model="form.role"
        :label="$t('profile.roleLabel')"
        :placeholder="$t('profile.rolePlaceholder')"
        autocomplete="organization-title"
        sanitize
        :maxlength="120"
      />
      <BaseTextarea
        v-model="form.bio"
        :label="$t('profile.bioLabel')"
        :placeholder="$t('profile.bioPlaceholder')"
        :hint="$t('profile.bioHint')"
        :maxlength="700"
        sanitize
      />
      <BaseSelect
        v-model="form.privacy"
        :label="$t('profile.privacyLabel')"
        :hint="privacyHint"
        :options="privacyOptions"
      />
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

const props = defineProps<{
  form: LoveResumeForm;
  privacyLabel: string;
  privacyNotice: string;
}>();

const { t } = useTranslation();

const privacyHint = computed(() => `${props.privacyNotice} ${t('profile.privacyHint')}`);

const privacyOptions = computed<SelectOption<PrivacyLevel>[]>(() => [
  { value: 'public', label: t('privacy.public') },
  { value: 'semi-private', label: t('privacy.semiPrivate') },
  { value: 'private', label: t('privacy.private') }
]);
</script>
