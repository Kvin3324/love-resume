import { cva, type VariantProps } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        brand: 'bg-brand-500/15 text-brand-100',
        neutral: 'bg-slate-800 text-slate-200',
      },
    },
    defaultVariants: {
      variant: 'brand',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
