import { onBeforeUnmount, type ModelRef } from 'vue';
import { censorText } from '../utils/profanityFilter';

interface SanitizerOptions {
  delay?: number;
  enabled?: () => boolean;
}

/**
 * Sanitises a text model with a debounce so profanity is checked once the user
 * stops typing (whole word), not on every keystroke — which would censor the
 * partial word (e.g. "con" while typing "confiance").
 */
export function useProfanitySanitizer(model: ModelRef<string>, options: SanitizerOptions = {}) {
  const delay = options.delay ?? 600;
  const isEnabled = options.enabled ?? (() => true);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const sanitize = (): void => {
    if (isEnabled() && typeof model.value === 'string') {
      model.value = censorText(model.value);
    }
  };

  const scheduleSanitize = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(sanitize, delay);
  };

  const sanitizeNow = (): void => {
    if (timer) clearTimeout(timer);
    sanitize();
  };

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  return { scheduleSanitize, sanitizeNow };
}
