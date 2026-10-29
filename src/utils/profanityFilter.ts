import leoProfanity from 'leo-profanity';

const MODERN_WORDS = [
  'fdp',
  'filsdepute',
  'ntm',
  'tg',
  'ftg',
  'ptn',
  'ptin',
  'teub',
  'zgeg',
  'zgueg',
  'zob',
  'zboub',
  'zebi',
  'zizi',
  'boloss',
  'bolos',
  'cassos',
  'kassos',
  'baltringue',
  'branlette',
  'foufoune',
  'cramouille',
  'catin',
  'morue',
  'tchoin',
  'thot',
  'chaudasse',
  'allumeuse',
  'chienasse',
  'merdasse',
  'merdique',
  'ordure',
  'tare',
  'mongol',
  'mongolien',
  'travelo',
  'pd',
  'feuj',
  'bamboula',
  'negre',
  'kys',
  'stfu',
  'gtfo',
  'chiant',
  'chiante',
  'chiants',
  'chiantes',
  'chie',
  'chies',
  'chient',
  'salopes',
  'salopards',
  'saloperies',
  'connards',
  'connardes',
  'connes',
  'cons'
];

const VERLAN_WORDS = [
  'tepu',
  'teup',
  'tebi',
  'demer',
  'lopsa',
  'dépé',
  'tainpu',
  'tainp',
  'teushi',
  'kecon',
  'renoi',
  'taspé',
  'yech'
];

const MODERN_PHRASES = [
  'te pu',
  'ken ta reum',
  'ken ta mere',
  'ken ta race',
  'gros chien de la casse',
  'chien de la casse',
  'ta gueule',
  'ferme ta gueule',
  'mange tes morts',
  'gros lard',
  'grosse vache',
  'grosse truie',
  'vieille peau',
  'peau de vache',
  'face de rat',
  'tete de rat',
  'tete a claques',
  'tete de noeud',
  'gros porc',
  'fils de chien',
  'retourne dans ton pays',
  'rentre dans ton pays'
];

const BANNED_PREFIXES = [
  'emmerd',
  'encul',
  'niqu',
  'fout',
  'merd',
  'degueu',
  'connass',
  'conner',
  'putass',
  'chier'
];

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  $: 's'
};

const normalize = (word: string): string =>
  word
    .toLowerCase()
    .replace(/\u0153/g, 'oe')
    .replace(/\u00e6/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[013456789@$]/g, (char) => LEET_MAP[char] ?? char);

leoProfanity.clearList();
leoProfanity.add(leoProfanity.getDictionary('en'));
leoProfanity.add(leoProfanity.getDictionary('fr'));
leoProfanity.add(MODERN_WORDS);
leoProfanity.add(VERLAN_WORDS);

const BANNED_WORDS = new Set(leoProfanity.list().map(normalize));
const BANNED_PHRASES = new Set(MODERN_PHRASES.map(normalize));
const MAX_PHRASE_LENGTH = Math.max(...MODERN_PHRASES.map((phrase) => phrase.split(' ').length));
const TOKEN_PATTERN = /[\p{L}\p{N}@$]+/gu;
const PHRASE_JOINER = /^[\s'’\-]*$/u;

interface Token {
  value: string;
  start: number;
  end: number;
}

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;

  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    tokens.push({ value: match[0], start: match.index, end: match.index + match[0].length });
  }

  return tokens;
};

const isBanned = (word: string): boolean => {
  const normalized = normalize(word);
  return (
    BANNED_WORDS.has(normalized) || BANNED_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
};

const findMaskedTokens = (text: string): { tokens: Token[]; masked: boolean[] } => {
  const tokens = tokenize(text);
  const masked = tokens.map((token) => isBanned(token.value));

  for (let index = 0; index < tokens.length; index += 1) {
    const maxLength = Math.min(MAX_PHRASE_LENGTH, tokens.length - index);

    for (let length = maxLength; length >= 2; length -= 1) {
      const words = tokens.slice(index, index + length).map((token) => normalize(token.value));
      if (!BANNED_PHRASES.has(words.join(' '))) continue;

      let joinable = true;
      for (let cursor = index; cursor < index + length - 1; cursor += 1) {
        if (!PHRASE_JOINER.test(text.slice(tokens[cursor].end, tokens[cursor + 1].start))) {
          joinable = false;
          break;
        }
      }

      if (!joinable) continue;

      for (let cursor = index; cursor < index + length; cursor += 1) {
        masked[cursor] = true;
      }
    }
  }

  return { tokens, masked };
};

export function containsProfanity(text: string): boolean {
  return findMaskedTokens(text).masked.some(Boolean);
}

export function censorText(text: string): string {
  const { tokens, masked } = findMaskedTokens(text);
  if (!masked.some(Boolean)) return text;

  let result = '';
  let offset = 0;

  tokens.forEach((token, index) => {
    if (!masked[index]) return;
    result += text.slice(offset, token.start);
    result += '*'.repeat(token.end - token.start);
    offset = token.end;
  });

  return result + text.slice(offset);
}
