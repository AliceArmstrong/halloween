export const VOTE_OPTIONS = [
  { key: "the_deep", label: "The Deep" },
  { key: "wild_west", label: "Wild West Murder House" },
];

const optionLabels = new Map(VOTE_OPTIONS.map((option) => [option.key, option.label]));

export function getOptionLabel(optionKey) {
  return optionLabels.get(optionKey) || optionKey;
}

export const VOTE_OPTION_KEYS = VOTE_OPTIONS.map((option) => option.key);
