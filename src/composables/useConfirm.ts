import { reactive } from 'vue';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: 'default' | 'danger';
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
}

const state = reactive<ConfirmState>({
  open: false,
  title: '',
  message: '',
  confirmLabel: '',
  cancelLabel: '',
  tone: 'default'
});

let resolver: ((value: boolean) => void) | undefined;

export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  resolver?.(false);
  Object.assign(state, options, { open: true });

  return new Promise<boolean>((resolve) => {
    resolver = resolve;
  });
}

export function settleConfirm(value: boolean): void {
  const resolve = resolver;
  resolver = undefined;
  state.open = false;
  resolve?.(value);
}

export function useConfirm() {
  return { state, confirmAction, settleConfirm };
}
