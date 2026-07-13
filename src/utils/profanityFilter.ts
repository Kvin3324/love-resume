import leoProfanity from 'leo-profanity';

leoProfanity.clearList();
leoProfanity.add(leoProfanity.getDictionary('en'));
leoProfanity.add(leoProfanity.getDictionary('fr'));

export function containsProfanity(text: string): boolean {
  return leoProfanity.check(text);
}

export function censorText(text: string): string {
  return leoProfanity.clean(text);
}
