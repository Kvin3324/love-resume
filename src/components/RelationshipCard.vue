<template>
  <div class="border-t border-ink-200 pt-5 first:border-t-0 first:pt-0">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h3 class="font-display text-xl leading-tight text-ink-900">{{ entry.partnerName }}</h3>
        <p v-if="dateRange" class="mt-1 text-sm text-ink-500">{{ dateRange }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-1">
        <template v-if="isEditing">
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.save')} ${entry.partnerName}`"
            @click="save"
          >
            {{ $t('common.save') }}
          </BaseButton>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.cancel')} ${entry.partnerName}`"
            @click="cancel"
          >
            {{ $t('common.cancel') }}
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('common.edit')} ${entry.partnerName}`"
            @click="startEditing"
          >
            {{ $t('common.edit') }}
          </BaseButton>
          <BaseButton
            variant="text"
            size="sm"
            :aria-label="`${$t('relationships.remove')} ${entry.partnerName}`"
            @click="$emit('remove')"
          >
            {{ $t('relationships.remove') }}
          </BaseButton>
        </template>
      </div>
    </div>

    <div
      v-if="!isEditing && (entry.duration || entry.reason)"
      class="mt-4 grid gap-4 border-t border-ink-100 pt-3 sm:grid-cols-3"
    >
      <div v-if="entry.duration">
        <p class="text-xs font-semibold text-ink-500">{{ $t('relationships.durationLabelInput') }}</p>
        <p class="mt-0.5 text-sm text-ink-800">{{ entry.duration }}</p>
      </div>
      <div v-if="entry.reason" :class="entry.duration ? 'sm:col-span-2' : 'sm:col-span-3'">
        <p class="text-xs font-semibold text-ink-500">{{ $t('relationships.reasonLabelInput') }}</p>
        <p class="mt-0.5 text-sm text-ink-800">{{ entry.reason }}</p>
      </div>
    </div>

    <div v-if="isEditing" class="mt-4 grid gap-3">
      <div class="grid gap-3 sm:grid-cols-3">
        <BaseInput
          v-model="draft.partnerName"
          :label="$t('relationships.partnerNameLabel')"
          :placeholder="$t('relationships.partnerNamePlaceholder')"
          :grid="false"
          tone="draft"
          required
          :maxlength="40"
          @enter="save"
        />
        <BaseInput
          v-model="draft.startDate"
          type="month"
          :label="$t('relationships.startDateLabel')"
          :grid="false"
          tone="draft"
        />
        <BaseInput
          v-model="draft.endDate"
          type="month"
          :label="$t('relationships.endDateLabel')"
          :grid="false"
          tone="draft"
        />
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <BaseInput
          v-model="draft.duration"
          :label="$t('relationships.durationLabelInput')"
          :placeholder="$t('relationships.durationPlaceholder')"
          :grid="false"
          tone="draft"
          :maxlength="40"
          @enter="save"
        />
        <BaseInput
          v-model="draft.reason"
          :label="$t('relationships.reasonLabelInput')"
          :placeholder="$t('relationships.reasonPlaceholder')"
          :grid="false"
          tone="draft"
          :maxlength="100"
          @enter="save"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import type { RelationshipDraft, RelationshipEntry } from '../types';
import { formatDateRange } from '../utils/dates';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';

const props = defineProps<{
  entry: RelationshipEntry;
}>();

const emit = defineEmits<{
  remove: [];
  update: [draft: RelationshipDraft];
}>();

const { i18next } = useTranslation();
const isEditing = ref(false);
const dateRange = computed(() => formatDateRange(props.entry.startDate, props.entry.endDate, i18next.language));

const draft = reactive<RelationshipDraft>({
  partnerName: '',
  startDate: '',
  endDate: '',
  duration: '',
  reason: ''
});

const startEditing = (): void => {
  draft.partnerName = props.entry.partnerName;
  draft.startDate = props.entry.startDate;
  draft.endDate = props.entry.endDate;
  draft.duration = props.entry.duration;
  draft.reason = props.entry.reason;
  isEditing.value = true;
};

const save = (): void => {
  if (!draft.partnerName.trim()) return;
  emit('update', { ...draft });
  isEditing.value = false;
};

const cancel = (): void => {
  isEditing.value = false;
};
</script>
