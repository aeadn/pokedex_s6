export function sanitizeFilename(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const GAME_COVER_FILE_BASES = {
  red: "rouge",
  blue: "bleue",
  yellow: "jaune",
  gold: "or",
  silver: "argent",
  crystal: "cristal",
  ruby: "rubis",
  sapphire: "saphir",
  emerald: "emeraude",
  firered: "rouge-feu",
  leafgreen: "vert-feuille",
  diamond: "diamant",
  pearl: "perle",
  platinum: "platine",
  heartgold: "or-heartgold",
  soulsilver: "argent-soul-silver",
  black: "noire",
  white: "blanche",
  "black-2": "noire-2",
  "white-2": "blanche-2",
  x: "x",
  y: "y",
  "omega-ruby": "rubis-omega",
  "alpha-sapphire": "saphir-alpha",
  sun: "soleil",
  moon: "lune",
  "ultra-sun": "ultra-soleil",
  "ultra-moon": "ultra-lune",
  sword: "epee",
  shield: "bouclier",
  scarlet: "ecarlate",
  violet: "violet",
  "lets-go-eevee": "let-s-go-evoli",
  "lets-go-pikachu": "let-s-go-pikachu",
  "legends-arceus": "legendes-pokemon-arceus",
  "brilliant-diamond": "diamant-etincelant",
  "shining-pearl": "perle-scintillante",
};
