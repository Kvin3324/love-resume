<template>
  <div class="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.22em] text-slate-400">{{ entry.partnerName || $t('relationships.exPartner') }}</p>
        <h3 class="text-lg font-semibold text-white">{{ entry.partnerName }}</h3>
      </div>
      <div class="flex items-center gap-4">
        <template v-if="isEditing">
          <BaseButton variant="text" @click="save">{{ $t('common.save') }}</BaseButton>
          <BaseButton variant="text" @click="cancel">{{ $t('common.cancel') }}</BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="text" @click="startEditing">{{ $t('common.edit') }}</BaseButton>
          <BaseButton variant="text" @click="$emit('remove')">{{ $t('relationships.remove') }}</BaseButton>
        </template>
      </div>
    </div>

    <div v-if="!isEditing" class="grid gap-3 sm:grid-cols-3">
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ entry.startDate }} → {{ entry.endDate }}</span>
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ $t('relationships.durationLabel', { value: entry.duration }) }}</span>
      <span class="rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">{{ $t('relationships.reasonLabel', { value: entry.reason }) }}</span>
    </div>

    <div v-else class="grid gap-2">
      <div class="grid gap-2 sm:grid-cols-3">
        <BaseInput
          v-model="draft.partnerName"
          :placeholder="$t('relationships.partnerNamePlaceholder')"
          :grid="false"
          tone="draft"
          @enter="save"
        />
        <BaseInput v-model="draft.startDate" type="month" :grid="false" tone="draft" @enter="save" />
        <BaseInput v-model="draft.endDate" type="month" :grid="false" tone="draft" @enter="save" />
      </div>
      <div class="grid gap-2 sm:grid-cols-2">
        <BaseInput
          v-model="draft.duration"
          :placeholder="$t('relationships.durationPlaceholder')"
          :grid="false"
          tone="draft"
          @enter="save"
        />
        <BaseInput
          v-model="draft.reason"
          :placeholder="$t('relationships.reasonPlaceholder')"
          :grid="false"
          tone="draft"
          @enter="save"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { RelationshipDraft, RelationshipEntry } from '../types';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';

const props = defineProps<{
  entry: RelationshipEntry;
}>();

const emit = defineEmits<{
  remove: [];
  update: [draft: RelationshipDraft];
}>();

const isEditing = ref(false);

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
  if (!draft.partnerName.trim()) {
    return;
  }

  emit('update', { ...draft });
  isEditing.value = false;
};

const cancel = (): void => {
  isEditing.value = false;
};
</script>
