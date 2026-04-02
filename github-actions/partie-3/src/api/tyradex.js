import axios from "axios";

// Fallback data for generations when API fails
const generationFallbacks = {
    1: [
        { 
            pokedex_id: 1, 
            name: { fr: "Bulbizarre", en: "Bulbasaur", jp: "フシギダネ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/1/regular.png", shiny: null, gmax: null },
            types: [
                { name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" },
                { name: "Poison", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/poison.png" }
            ],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.25 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 2 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 2, 
            name: { fr: "Herbizarre", en: "Ivysaur", jp: "フシギソウ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/2/regular.png", shiny: null, gmax: null },
            types: [
                { name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" },
                { name: "Poison", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/poison.png" }
            ],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.25 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 2 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 3, 
            name: { fr: "Florizarre", en: "Venusaur", jp: "フシギバナ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/3/regular.png", shiny: null, gmax: null },
            types: [
                { name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" },
                { name: "Poison", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/poison.png" }
            ],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.25 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 2 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 4, 
            name: { fr: "Salamèche", en: "Charmander", jp: "ヒトカゲ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/4/regular.png", shiny: null, gmax: null },
            types: [{ name: "Feu", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/feu.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 2 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 0.5 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 2 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 0.5 },
                { name: "Roche", multiplier: 2 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 5, 
            name: { fr: "Reptincel", en: "Charmeleon", jp: "リザード" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/5/regular.png", shiny: null, gmax: null },
            types: [{ name: "Feu", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/feu.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 2 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 0.5 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 2 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 0.5 },
                { name: "Roche", multiplier: 2 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 6, 
            name: { fr: "Dracaufeu", en: "Charizard", jp: "リザードン" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/6/regular.png", shiny: null, gmax: null },
            types: [
                { name: "Feu", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/feu.png" },
                { name: "Vol", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/vol.png" }
            ],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.25 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 2 }, { name: "Électrik", multiplier: 2 }, { name: "Glace", multiplier: 1 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 0 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 0.25 },
                { name: "Roche", multiplier: 4 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 0.5 }
            ]
        },
        { 
            pokedex_id: 7, 
            name: { fr: "Carapuce", en: "Squirtle", jp: "ゼニガメ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/7/regular.png", shiny: null, gmax: null },
            types: [{ name: "Eau", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/eau.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 2 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 2 }, { name: "Glace", multiplier: 0.5 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 8, 
            name: { fr: "Carabaffe", en: "Wartortle", jp: "カメール" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/8/regular.png", shiny: null, gmax: null },
            types: [{ name: "Eau", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/eau.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 2 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 2 }, { name: "Glace", multiplier: 0.5 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 9, 
            name: { fr: "Tortank", en: "Blastoise", jp: "カメックス" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/9/regular.png", shiny: null, gmax: null },
            types: [{ name: "Eau", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/eau.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 2 }, { name: "Feu", multiplier: 0.5 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 2 }, { name: "Glace", multiplier: 0.5 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 10, 
            name: { fr: "Chenipan", en: "Caterpie", jp: "キャタピー" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/10/regular.png", shiny: null, gmax: null },
            types: [{ name: "Insecte", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/insecte.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 1 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 1 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 2 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 25, 
            name: { fr: "Pikachu", en: "Pikachu", jp: "ピカチュウ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/25/regular.png", shiny: null, gmax: null },
            types: [{ name: "Électrik", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/electrik.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 1 }, { name: "Feu", multiplier: 1 },
                { name: "Eau", multiplier: 1 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 1 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 2 },
                { name: "Vol", multiplier: 0.5 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 0.5 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 150, 
            name: { fr: "Mewtwo", en: "Mewtwo", jp: "ミュウツー" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/150/regular.png", shiny: null, gmax: null },
            types: [{ name: "Psy", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/psy.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 1 }, { name: "Feu", multiplier: 1 },
                { name: "Eau", multiplier: 1 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 1 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 0.5 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 2 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 2 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        },
        { 
            pokedex_id: 151, 
            name: { fr: "Mew", en: "Mew", jp: "ミュウ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/151/regular.png", shiny: null, gmax: null },
            types: [{ name: "Psy", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/psy.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 1 }, { name: "Feu", multiplier: 1 },
                { name: "Eau", multiplier: 1 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 1 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 1 }, { name: "Sol", multiplier: 1 },
                { name: "Vol", multiplier: 1 }, { name: "Psy", multiplier: 0.5 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 2 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 2 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    2: [
        { 
            pokedex_id: 152, 
            name: { fr: "Germignon", en: "Chikorita", jp: "チコリータ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/152/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    3: [
        { 
            pokedex_id: 252, 
            name: { fr: "Arcko", en: "Treecko", jp: "キモリ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/252/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    4: [
        { 
            pokedex_id: 387, 
            name: { fr: "Tortipouss", en: "Turtwig", jp: "ナエトル" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/387/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    5: [
        { 
            pokedex_id: 495, 
            name: { fr: "Vipélierre", en: "Snivy", jp: "ツタージャ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/495/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    6: [
        { 
            pokedex_id: 650, 
            name: { fr: "Marisson", en: "Chespin", jp: "ハリマロン" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/650/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    7: [
        { 
            pokedex_id: 722, 
            name: { fr: "Brindibou", en: "Rowlet", jp: "モクロー" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/722/regular.png", shiny: null, gmax: null },
            types: [
                { name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" },
                { name: "Vol", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/vol.png" }
            ],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.25 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 1 }, { name: "Glace", multiplier: 4 },
                { name: "Combat", multiplier: 0.5 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 1 },
                { name: "Roche", multiplier: 2 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    8: [
        { 
            pokedex_id: 810, 
            name: { fr: "Ouistempo", en: "Grookey", jp: "サルノリ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/810/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ],
    9: [
        { 
            pokedex_id: 906, 
            name: { fr: "Poussacha", en: "Sprigatito", jp: "ニャオハ" }, 
            sprites: { regular: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/906/regular.png", shiny: null, gmax: null },
            types: [{ name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" }],
            resistances: [
                { name: "Normal", multiplier: 1 }, { name: "Plante", multiplier: 0.5 }, { name: "Feu", multiplier: 2 },
                { name: "Eau", multiplier: 0.5 }, { name: "Électrik", multiplier: 0.5 }, { name: "Glace", multiplier: 2 },
                { name: "Combat", multiplier: 1 }, { name: "Poison", multiplier: 2 }, { name: "Sol", multiplier: 0.5 },
                { name: "Vol", multiplier: 2 }, { name: "Psy", multiplier: 1 }, { name: "Insecte", multiplier: 2 },
                { name: "Roche", multiplier: 1 }, { name: "Spectre", multiplier: 1 }, { name: "Dragon", multiplier: 1 },
                { name: "Ténèbres", multiplier: 1 }, { name: "Acier", multiplier: 1 }, { name: "Fée", multiplier: 1 }
            ]
        }
    ]
};

export const fetchPokemonForGeneration = async (generation = 1) => {
    let listPokemon = [];
    try {
        const baseUrl = import.meta.env.DEV ? '/api/tyradex' : 'https://tyradex.vercel.app';
        const req = await axios.get(`${baseUrl}/api/v1/gen/${generation}`);
        listPokemon = req.data;
        const serverErrorStartNumber = 400;
        if(req.data?.status >= serverErrorStartNumber) {
            throw new Error("", {cause: req.data} );
        }

        return listPokemon;
    } catch (error) {
        console.warn(`Impossible de charger la génération ${generation} depuis l'API, utilisation des données par défaut:`, error.message);
        return generationFallbacks[generation] || [];
    }
}

export const fetchPokemon = async (pkmnId, region = null) => {
    try {
        const baseUrl = import.meta.env.DEV ? '/api/tyradex' : 'https://tyradex.vercel.app';
        const regionName = region ? `/${region}` : "";
        const req = await axios.get(`${baseUrl}/api/v1/pokemon/${pkmnId}${regionName}`);

        return req.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const fetchAllTypes = async () => {
    try {
        const baseUrl = import.meta.env.DEV ? '/api/tyradex' : 'https://tyradex.vercel.app';
        const req = await axios.get(`${baseUrl}/api/v1/types`);
        return req.data;
    } catch (error) {
        throw new Error(error);
    }
}
