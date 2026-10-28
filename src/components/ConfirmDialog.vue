<template>
  <dialog
    ref="dialogRef"
    class="confirm-dialog w-[min(92vw,30rem)] rounded-[1.75rem] border border-ink-200 bg-[#fffdf9] p-0 text-ink-900 shadow-card backdrop:bg-ink-900/35"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-description"
    @cancel.prevent="cancel"
  >
    <div class="p-6 sm:p-7">
      <h2 id="confirm-title" class="font-display text-2xl leading-tight text-ink-900">{{ state.title }}</h2>
      <p id="confirm-description" class="mt-3 text-ink-600">{{ state.message }}</p>
      <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <BaseButton ref="cancelButton" variant="secondary" @click="cancel">{{ state.cancelLabel }}</BaseButton>
        <BaseButton :variant="state.tone === 'danger' ? 'danger' : 'primary'" @click="accept">
          {{ state.confirmLabel }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import BaseButton from './ui/BaseButton.vue';
import { useConfirm } from '../composables/useConfirm';

const { state, settleConfirm } = useConfirm();
const dialogRef = ref<HTMLDialogElement>();
const cancelButton = ref<InstanceType<typeof BaseButton>>();

watch(
  () => state.open,
  async (open) => {
    await nextTick();
    if (open && !dialogRef.value?.open) {
      dialogRef.value?.showModal();
      cancelButton.value?.$el?.focus();
    } else if (!open) {
      dialogRef.value?.close();
    }
  }
);

const accept = (): void => settleConfirm(true);
const cancel = (): void => settleConfirm(false);
</script>
