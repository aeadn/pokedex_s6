import 'core-js/actual/object';

import {
    fetchPokemonDetails,
    fetchAllTypes,
    fetchPokemonExternalData,
    fetchPokemon,
    fetchEvolutionChain,
    fetchAbilityData,
} from "#api";

import {
    FRENCH_GAMES_NAME,
    POKEDEX,
    cleanString,
    clearTagContent,
    replaceImage,
    getEvolutionChain,
    statistics,
    getPkmnIdFromURL,
    FORMS,
    onTransitionsEnded,
    NB_NUMBER_INTEGERS_PKMN_ID,
    modal_DOM, modal
} from "./utils";

import {
    createSensibility,
    createAlternateForm,
    createSibling,
    createStatisticEntry,
    getAbilityForLang,
} from "#src/utils/pokemon-modal.utils.js"

import modalPulldownClose from "#src/modal-pulldown-close.js"
import WaveSurfer from "wavesurfer.js";

import { listPokemon, setTitleTagForGeneration, hasReachPokedexEnd, rippleEffect } from "./main";
import loadingImage from "/images/loading.svg";
import loadingImageRaw from "/images/loading.svg?raw";

// Fallback data for types when API fails
const defaultTypesList = [
    { name: "Acier", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/acier.png" },
    { name: "Combat", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/combat.png" },
    { name: "Dragon", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/dragon.png" },
    { name: "Eau", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/eau.png" },
    { name: "Électrik", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/electrik.png" },
    { name: "Fée", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/fee.png" },
    { name: "Feu", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/feu.png" },
    { name: "Glace", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/glace.png" },
    { name: "Insecte", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/insecte.png" },
    { name: "Normal", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/normal.png" },
    { name: "Plante", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" },
    { name: "Poison", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/poison.png" },
    { name: "Psy", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/psy.png" },
    { name: "Roche", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/roche.png" },
    { name: "Sol", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/sol.png" },
    { name: "Spectre", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/spectre.png" },
    { name: "Ténèbres", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/tenebres.png" },
    { name: "Vol", image: "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/vol.png" }
];

const closeModalBtn = document.querySelector("[data-close-modal]");

const pkmnSensibilityTemplateRaw = document.querySelector(
    "[data-tpl-id='pokemon-sensibility']"
);
const pkmnHighlightTemplateRaw = document.querySelector(
    "[data-tpl-id='pokemon-highlight']"
);

const pkmnTemplateRaw = document.querySelector("[data-tpl-id='pokemon']");
const listPokemonSpritesTemplateRaw = document.querySelector(
    "[data-tpl-id='pokemon-list-sprites']"
);
const pokemonSpriteTemplateRaw = document.querySelector(
    "[data-tpl-id='pokemon-sprite']"
);
const pokemonSiblingTemplateRaw = document.querySelector(
    "[data-tpl-id='pokemon-sibling']"
);
const btnLoadGenerationTemplateRaw = document.querySelector(
    "[data-tpl-id='load-generation-btn']"
);
const pokemonStatisticTempalteRaw = document.querySelector(
    "[data-tpl-id='pokemon-statistic']"
);

const loadGenerationBtn = document.querySelector("[data-load-generation]");

const dataCache = {};
let listAbilitiesCache = [];
const initialPageTitle = document.title;

const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const faviconElement = document.querySelector('[data-favicon]');
let previousThemeColor = themeColorMeta?.content;
let previousFaviconHref = faviconElement?.href;
let wavesurferInstance = null;

const resetThemeAndFavicon = () => {
    if (themeColorMeta && previousThemeColor) {
        themeColorMeta.content = previousThemeColor;
    }
    if (faviconElement && previousFaviconHref) {
        faviconElement.href = previousFaviconHref;
    }
};

const getTCGDexCards = async (pokemonName) => {
    const key = `tcgdex_${pokemonName.toLowerCase()}`;
    if (dataCache[key]) return dataCache[key];

    try {
        const baseUrl = import.meta.env.DEV ? '/api/tcgdex' : 'https://tcgdex.dev';
        const response = await fetch(`${baseUrl}/api/cards?name=${encodeURIComponent(pokemonName)}&lang=fr`);
        if (!response.ok) return [];
        const payload = await response.json();
        const cards = payload?.data || payload || [];
        dataCache[key] = cards;
        return cards;
    } catch (_error) {
        return [];
    }
};

const getCryUrl = (name) => {
    return `https://play.pokemonshowdown.com/audio/cries/${name.toLowerCase().replace(/[^a-z0-9-]/g, "")}.ogg`;
};

const initWaveSurfer = (url) => {
    if (!modal_DOM.waveForm || !modal_DOM.playCry) return;
    if (wavesurferInstance) {
        wavesurferInstance.destroy();
        wavesurferInstance = null;
    }

    wavesurferInstance = WaveSurfer.create({
        container: modal_DOM.waveForm,
        waveColor: "#7dd3fc",
        progressColor: "#0ea5e9",
        height: 60,
        responsive: true,
    });

    wavesurferInstance.load(url);

    modal_DOM.playCry.onclick = () => {
        if (!wavesurferInstance) return;
        if (wavesurferInstance.isPlaying()) {
            wavesurferInstance.pause();
        } else {
            wavesurferInstance.play();
        }
    };
};

// Liste de types par défaut en cas d'échec de l'API
const defaultTypes = [
    { name: { fr: "Normal", en: "Normal" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/normal.png" } },
    { name: { fr: "Feu", en: "Fire" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/feu.png" } },
    { name: { fr: "Eau", en: "Water" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/eau.png" } },
    { name: { fr: "Plante", en: "Grass" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/plante.png" } },
    { name: { fr: "Électrik", en: "Electric" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/electrik.png" } },
    { name: { fr: "Glace", en: "Ice" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/glace.png" } },
    { name: { fr: "Combat", en: "Fighting" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/combat.png" } },
    { name: { fr: "Poison", en: "Poison" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/poison.png" } },
    { name: { fr: "Sol", en: "Ground" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/sol.png" } },
    { name: { fr: "Vol", en: "Flying" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/vol.png" } },
    { name: { fr: "Psy", en: "Psychic" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/psy.png" } },
    { name: { fr: "Insecte", en: "Bug" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/insecte.png" } },
    { name: { fr: "Roche", en: "Rock" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/roche.png" } },
    { name: { fr: "Spectre", en: "Ghost" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/spectre.png" } },
    { name: { fr: "Dragon", en: "Dragon" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/dragon.png" } },
    { name: { fr: "Ténèbres", en: "Dark" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/tenebres.png" } },
    { name: { fr: "Acier", en: "Steel" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/acier.png" } },
    { name: { fr: "Fée", en: "Fairy" }, sprites: { "32x32": "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/fee.png" } }
];

let listTypes = defaultTypes.map((item) => ({
    sprite: item.sprites["32x32"],
    name: {
        fr: cleanString(item.name.fr),
        en: cleanString(item.name.en)
    },
}));

// Charger les types depuis l'API de manière asynchrone
const loadTypesAsync = async () => {
    try {
        const fetchedTypes = await fetchAllTypes();
        if (fetchedTypes && fetchedTypes.length > 0) {
            listTypes = fetchedTypes.map((item) => ({
                sprite: item.sprites?.["32x32"] || item.sprites,
                name: {
                    fr: cleanString(item.name.fr),
                    en: cleanString(item.name.en)
                },
            }));
        }
    } catch (error) {
        console.warn("Impossible de charger les types depuis l'API, utilisation des types par défaut:", error.message);
    }
};

// Charger les types au démarrage (sans bloquer)
loadTypesAsync();

export { listTypes }

const initialModalSpeed = window.getComputedStyle(document.querySelector("dialog")).getPropertyValue("--animation-speed");

const resetModalPosition = () => {
    const modalOriginalBackdropBlur = parseInt(window.getComputedStyle(modal).getPropertyValue("--details-modal-blur"));

    modal.style.setProperty("--details-modal-blur", `${modalOriginalBackdropBlur}px`);
    modal.style.translate = "0px 0px";
    modal.style.opacity = 1;
}

modal.addEventListener("close", async (e) => {
    const url = new URL(location);
    if (
        "documentPictureInPicture" in window && window.documentPictureInPicture.window
    ) {
        return;
    }
    url.searchParams.delete("id");
    url.searchParams.delete("region");
    url.searchParams.delete("alternate_form_id");
    history.pushState({}, "", url);

    const modalOriginalBackdropBlur = parseInt(window.getComputedStyle(modal).getPropertyValue("--details-modal-blur"));

    modal.style.setProperty("--details-modal-blur", "0px");
    modal.dataset.hasBeenTouched = false;

    await onTransitionsEnded(e.target);

    modal.style.setProperty("--details-modal-blur", `${modalOriginalBackdropBlur}px`);

    modal.style.removeProperty("opacity");
    modal.style.removeProperty("translate");

    modal.scrollTo(0, 0);

    modal.dataset.isClosing = false;
    modal_DOM.img.src = loadingImage;
    modal_DOM.img.alt = "";
    setTitleTagForGeneration();
    resetThemeAndFavicon();

    document.querySelectorAll(".selected").forEach((item) => {
        item.classList.remove("selected");
    });
});

modal.addEventListener("transitionend", (e) => {
    const isClosing = JSON.parse(e.currentTarget.dataset?.isClosing || false)
    if (isClosing) {
        modal.close();
    }
});

modalPulldownClose(modal, modal_DOM.topInfos, resetModalPosition);

closeModalBtn.addEventListener("click", () => {
    modal.style.removeProperty('translate');
    modal.style.removeProperty('opacity');
    modal.style.setProperty("--animation-speed", initialModalSpeed);
    modal.close();
});

let displayModal = null;

const generatePokemonSiblingsUI = (pkmnData) => {
    const prevPokemon = listPokemon.find((item) => item?.pokedex_id === pkmnData.pokedex_id - 1) || {};
    let nextPokemon = listPokemon.find((item) => item?.pokedex_id === pkmnData.pokedex_id + 1) || null;

    const isLastPokemonOfGen = Number(pkmnData.generation) < Number(loadGenerationBtn.dataset.loadGeneration) && !nextPokemon;

    if (!isLastPokemonOfGen && !nextPokemon) {
        nextPokemon = {}
    }

    [prevPokemon, pkmnData, nextPokemon]
        .filter(Boolean)
        .forEach((item) => {
            const clone = createSibling({
                template: document.importNode(pokemonSiblingTemplateRaw.content, true),
                data: item,
                isCurrentPkmn: item.pokedex_id === pkmnData.pokedex_id,
                isPreviousPkmn: item.pokedex_id < pkmnData.pokedex_id,
                event: loadDetailsModal
            });

            modal_DOM.listSiblings.append(clone);
        });

    if (isLastPokemonOfGen) {
        const clone = document.importNode(
            btnLoadGenerationTemplateRaw.content,
            true
        );

        const button = clone.querySelector("button");
        button.textContent = "Charger la génération suivante";
        button.dataset.loadGeneration = Number(pkmnData.generation) + 1;

        modal_DOM.listSiblings.append(clone);
    }
}

const loadDetailsModal = async (e, region = null) => {
    e.preventDefault();

    const $el = e.currentTarget;

    const pkmnDataRaw = $el.dataset.pokemonData;
    const pkmnData = JSON.parse(pkmnDataRaw);

    const href = $el.href;
    if(pkmnData.types) {
        let rippleColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnData.types[0].name)}`)
        $el.removeAttribute("href");
        if (Math.random() > 0.5 && pkmnData.types[1]) {
            rippleColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnData.types[1].name)}`)
        }
        await rippleEffect(e, rippleColor);
    }

    $el.href = href;

    const url = new URL(location);

    if (region) {
        url.searchParams.set("region", region);
    } else {
        url.searchParams.delete("region");
    }
    if (pkmnData.alternate_form_id) {
        url.searchParams.set("alternate_form_id", pkmnData.alternate_form_id);
    } else {
        url.searchParams.delete("alternate_form_id");
    }

    url.searchParams.set("id", pkmnData.pokedex_id);

    history.pushState({}, "", url);
    displayModal(pkmnData);
};

displayModal = async (pkmnData) => {
    modal.inert = true;
    modal.setAttribute("aria-busy", true);
    loadGenerationBtn.inert = true;

    if (pkmnData.is_incomplete) {
        const cachedPokemon = listPokemon.find((item) => item?.pokedex_id === pkmnData.pokedex_id);
        if (cachedPokemon) {
            pkmnData = cachedPokemon;
        } else {
            pkmnData = await fetchPokemon(pkmnData.pokedex_id);
        }
    }
    modal.dataset.pokemonData = JSON.stringify(pkmnData);
    document.title = `Chargement - ${initialPageTitle}`;

    document.querySelectorAll(".selected").forEach((item) => {
        item.classList.remove("selected");
    });

    const $itemInList = document.querySelector(`[data-pokemon-id="${pkmnData.pokedex_id}"]`);
    if ($itemInList) {
        $itemInList.classList.add("selected");
    }

    modal_DOM.img.src = loadingImage;

    const pkmnId = pkmnData?.alternate_form_id || pkmnData.pokedex_id;

    let pkmnExtraData = dataCache[pkmnId]?.extras;
    let listDescriptions = dataCache[pkmnId]?.descriptions;
    let evolutionLine = dataCache[pkmnId]?.evolutionLine;
    let listAbilities = dataCache[pkmnId]?.listAbilities;

    if (!dataCache[pkmnId]) {
        try {
            listDescriptions = await fetchPokemonExternalData(pkmnData.pokedex_id);
        } catch (_e) {
            listDescriptions = {};
        }

        try {
            const evolutionReq = await fetchEvolutionChain(listDescriptions.evolution_chain.url);
            evolutionLine = getEvolutionChain(
                evolutionReq,
                {
                    ...pkmnData.evolution,
                    self: {
                        name: pkmnData.name.fr,
                        pokedex_id: pkmnData.pokedex_id,
                        // condition: pkmnData.evolution.pre?.map((item) => item.condition)[0]
                    }
                }, listPokemon);
        } catch (_e) {
            evolutionLine = [];
        }

        try {
            pkmnExtraData = await fetchPokemonDetails(pkmnId);
        } catch (_e) {
            pkmnExtraData = {};
        }

        const listAbilitiesDescriptions = []

        for (const ability of (pkmnExtraData?.abilities || [])) {
            const abilityInCache = listAbilitiesCache.find((item) => item.name.en.toLowerCase() === ability.ability.name.toLowerCase());
            if (abilityInCache) {
                listAbilitiesDescriptions.push(abilityInCache);
            } else {
                try {
                    const abilityData = await fetchAbilityData(ability.ability.url);
                    listAbilitiesDescriptions.push(getAbilityForLang(abilityData));
                } catch (_e) {}
            }
        }

        const listKnownAbilities = listAbilitiesDescriptions.map((item) => cleanString(item.name.fr.toLowerCase().replace("-", "")));
        listAbilities = (pkmnData?.talents || [])
            .filter((item) => listKnownAbilities.includes(cleanString(item.name.toLowerCase().replace("-", ""))))
            .map((item) => ({
                ...item,
                ...listAbilitiesDescriptions.find((description) => cleanString(description.name.fr.toLowerCase().replace("-", "")) === cleanString(item.name.toLowerCase().replace("-", "")))
            }));

        listPokemon[pkmnData.pokedex_id - 1] = pkmnData;

        listAbilitiesCache = [
            ...listAbilitiesCache,
            ...listAbilitiesDescriptions,
        ];

        listAbilitiesCache = Array.from(new Set(listAbilitiesCache.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));

        dataCache[pkmnId] = {
            descriptions: listDescriptions,
            extras: pkmnExtraData,
            evolutionLine,
            listAbilities,
        };
    }

    modal.style.setProperty("--background-sprite", `url("${pkmnExtraData.sprites.other["official-artwork"].front_default}")`);
    replaceImage(modal_DOM.img, pkmnData.sprites.regular);
    modal_DOM.img.alt = `sprite de ${pkmnData.name.fr}`;

    modal.setAttribute("aria-labelledby", `Fiche détail de ${pkmnData.name.fr}`);

    modal_DOM.pkmnName.textContent = `#${String(pkmnData.pokedex_id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${pkmnData.name.fr}`;
    document.title = `${modal_DOM.pkmnName.textContent} - ${initialPageTitle}`;

    if (modal_DOM.foreignNames) {
        modal_DOM.foreignNames.textContent = `EN: ${pkmnData.name.en || "-"} • JP: ${pkmnData.name.jp || "-"}`;
    }

    if (modal_DOM.pokepediaLink) {
        const link = document.createElement("a");
        link.href = `https://www.pokepedia.fr/${encodeURIComponent(pkmnData.name.fr)}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Voir la fiche sur poképedia.fr";
        link.className = "text-blue-700 hover:underline";
        modal_DOM.pokepediaLink.innerHTML = "";
        modal_DOM.pokepediaLink.append(link);
    }

    if (themeColorMeta && pkmnData.types?.[0]) {
        const themeColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnData.types[0].name)}`) || "#0f172a";
        themeColorMeta.content = themeColor;
    }

    if (faviconElement && pkmnData.sprites?.regular) {
        faviconElement.href = pkmnData.sprites.regular;
    }

    if (listDescriptions?.is_legendary || listDescriptions?.is_mythical) {
        const cloneHighlight = document.importNode(
            pkmnHighlightTemplateRaw.content,
            true
        );
        const span = cloneHighlight.querySelector("span");
        span.textContent = listDescriptions.is_legendary
            ? "Pokémon Légendaire"
            : "Pokémon Fabuleux";
        span.classList.add(
            listDescriptions.is_legendary ? "bg-amber-400!" : "bg-slate-400!",
            "text-black!"
        );
        modal_DOM.pkmnName.append(cloneHighlight);
    }

    modal_DOM.category.textContent = pkmnData.category;

    clearTagContent(modal_DOM.listTypes);

    const url = new URL(location);
    url.searchParams.set("id", pkmnData.pokedex_id);

    pkmnData.types.forEach((type, idx) => {
        const parser = new DOMParser();

        const liString = `
            <li
                class="py-0.5 px-2 rounded-md gap-1 flex items-center type-name w-fit"
                aria-label="Type ${idx + 1} ${type.name}"
                style="background-color: var(--type-${cleanString(type.name)})"
            >
                    ${type.name}
            </li>
        `
        const li = parser.parseFromString(liString, "text/html").body.firstChild;

        const imgTag = document.createElement("img");
        imgTag.alt = `icône type ${type.name}`;
        replaceImage(imgTag, type.image);

        const encodedData = window.btoa(loadingImageRaw.replaceAll("#037ef3", "#fff"));
        imgTag.src = `data:image/svg+xml;base64,${encodedData}`;

        imgTag.fetchpriority = "low";
        imgTag.loading = "lazy";
        imgTag.classList.add(...["h-5"]);

        li.prepend(imgTag);

        modal_DOM.listTypes.append(li);
    });

    const firstBorderColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnData.types[0].name)}`);
    const secondaryBorderColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnData.types[1]?.name || "")}`);

    modal.style.borderTopColor = firstBorderColor;
    modal.style.color = `rgb(from ${firstBorderColor} r g b / 0.4)`;
    modal.style.borderLeftColor = firstBorderColor;
    modal.style.borderRightColor = secondaryBorderColor ? secondaryBorderColor : firstBorderColor;
    modal.style.borderBottomColor = secondaryBorderColor ? secondaryBorderColor : firstBorderColor;
    modal.style.setProperty("--bg-modal-color", firstBorderColor);
    modal.style.setProperty("--dot-color-1", firstBorderColor);
    modal.style.setProperty("--dot-color-2", secondaryBorderColor ? secondaryBorderColor : firstBorderColor);

    modal.querySelector("[data-top-infos]").style.borderImage = `linear-gradient(to right, ${firstBorderColor} 0%, ${firstBorderColor} 50%, ${secondaryBorderColor ? secondaryBorderColor : firstBorderColor} 50%, ${secondaryBorderColor ? secondaryBorderColor : firstBorderColor} 100%) 1`;
    const descriptionsContainer = modal.querySelector("dl");

    clearTagContent(descriptionsContainer);
    listDescriptions.flavor_text_entries?.filter((item) => item.language.name === "fr").forEach((description) => {
        const dt = document.createElement("dt");
        const versionName = FRENCH_GAMES_NAME[description.version.name] || "Unknown";
        dt.textContent = versionName;
        dt.classList.add("font-bold");
        descriptionsContainer.append(dt);

        const dd = document.createElement("dd");
        dd.textContent = description.flavor_text;
        dd.classList.add("mb-2");
        descriptionsContainer.append(dd);
    });

    const thresholdNbTotalEvolutions = 7;

    clearTagContent(modal_DOM.listEvolutions);
    const listEvolutionConditions = [];
    if(evolutionLine.length > 1) {
        evolutionLine.forEach((evolution, idx) => {
            const li = document.createElement("li");
            const ol = document.createElement("ol");
            if(evolution.length > 3) {
                ol.classList.add(...["grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-y-6"]);
            } else {
                ol.classList.add(...["flex"]);
            }
            ol.classList.add(...["gap-x-2", "gap-y-6"]);
            evolution.forEach((item) => {
                const clone = document.importNode(
                    pokemonSpriteTemplateRaw.content,
                    true
                );

                const img = clone.querySelector("img");
                img.alt = `Sprite de ${item.name}`;
                img.classList.replace("w-52", "w-36");
                replaceImage(img, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${item.pokedex_id}.png`);

                const evolutionName = clone.querySelector("p");
                evolutionName.textContent = `#${String(item.pokedex_id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${item.name}`;
                evolutionName.classList.toggle("font-bold", item.pokedex_id === pkmnData.pokedex_id);
                evolutionName.classList.add(...["group-hocus:bg-slate-900", "group-hocus:text-white", "whitespace-pre-line"])

                if (idx > 0) {
                    const evolutionCondition = document.createElement("p");
                    evolutionCondition.classList.add("text-xs", "text-center");
                    evolutionCondition.style.maxWidth = "75%";
                    evolutionCondition.textContent = item.condition;
                    listEvolutionConditions.push(item.condition?.toLowerCase());
                    clone.querySelector("li div").insertAdjacentElement("afterbegin", evolutionCondition);
                }

                const divTag = clone.querySelector("div");
                const evolutionURL = new URL(location);
                evolutionURL.searchParams.set("id", item.pokedex_id);
                const aTag = document.createElement('a');
                aTag.innerHTML = divTag.innerHTML;
                aTag.href = evolutionURL;
                aTag.classList = divTag.classList;
                aTag.classList.add(...["hocus:bg-slate-100", "rounded-md", "p-2"]);
                aTag.dataset.pokemonData = JSON.stringify({ ...item, is_incomplete: true });
                aTag.addEventListener("click", (e) => loadDetailsModal(e));

                divTag.parentNode.replaceChild(aTag, divTag);

                ol.append(clone);
            });

            li.append(ol);
            modal_DOM.listEvolutions.append(li);

            const nextArrow = document.createElement("li");
            if(evolutionLine.flat().length >= thresholdNbTotalEvolutions) {
                nextArrow.textContent = "►";
                nextArrow.classList.add("justify-center");
            } else {
                nextArrow.classList.add("justify-around");
                (evolutionLine?.[idx + 1] || []).forEach(() => {
                    const span = document.createElement("span");
                    span.textContent = "▼";

                    nextArrow.append(span);
                })
            }

            nextArrow.inert = true;
            nextArrow.classList.add(...["flex", "items-center", "last:hidden", "arrow", "font-['serif']"])
            modal_DOM.listEvolutions.append(nextArrow);
        });
    }

    const listAcronymsDOM = Array.from(modal_DOM.acronymVersions.querySelectorAll("[data-acronym]"));
    const listAcronyms = listAcronymsDOM.map((item) => item.dataset.acronym)
    modal_DOM.acronymVersions.classList.toggle("hidden", !listEvolutionConditions.filter(Boolean).some(
        v => listAcronyms.some(acronym => {
            const re = new RegExp(String.raw`[(\s]${acronym}[)\s]`, 'gi');
            return re.test(v.toLowerCase())
        })
    ));

    listAcronyms.forEach((item) => {
        modal_DOM.acronymVersions.querySelector(`[data-acronym="${item}"]`).classList.toggle(
            "hidden",
            !listEvolutionConditions.filter(Boolean).some(evolutionCondition => evolutionCondition.includes(item.toLowerCase()))
        );
    });

    const megaEvolutionLine = pkmnData.evolution?.mega || []; //(pkmnData.evolution?.mega || alternateEvolutions)
    modal_DOM.extraEvolutions.classList.toggle("hidden", !megaEvolutionLine.length);
    if (megaEvolutionLine.length) {
        const extraEvolutionsContainer = modal_DOM.extraEvolutions.querySelector("ul");
        clearTagContent(extraEvolutionsContainer);
        megaEvolutionLine.forEach((item) => {
            const clone = document.importNode(
                pokemonSpriteTemplateRaw.content,
                true
            );

            const img = clone.querySelector("img");
            img.alt = `Sprite de ${item.name}`;
            img.classList.replace("w-52", "w-36");
            replaceImage(img, item.sprites.regular);

            const textContainer = clone.querySelector("p");
            textContainer.textContent = item.orbe ? `avec ${item.orbe}` : "";

            extraEvolutionsContainer.append(clone);
        });
    }

    modal_DOM.noEvolutionsText.classList.toggle("hidden", (evolutionLine.length > 1 || megaEvolutionLine.length > 0))
    modal_DOM.noEvolutionsText.textContent = `${pkmnData.name.fr} n'a pas d'évolution et n'est l'évolution d'aucun Pokémon.`;

    modal_DOM.listEvolutions.classList.toggle("horizontal-evolution-layout", evolutionLine.flat().length >= thresholdNbTotalEvolutions)
    modal_DOM.listEvolutions.classList.toggle("vertical-evolution-layout", evolutionLine.flat().length < thresholdNbTotalEvolutions)

    const hasNoEvolutions = (evolutionLine.flat().length === 0) && (pkmnData.evolution?.mega || []).length === 0;
    modal_DOM.listEvolutions.closest("details").inert = hasNoEvolutions;
    if (hasNoEvolutions) {
        modal_DOM.listEvolutions.closest("details").removeAttribute("open");
    }

    clearTagContent(modal_DOM.listSensibilities);

    for (const sensibility of pkmnData.resistances) {
        const clone = await createSensibility(
            document.importNode(
                pkmnSensibilityTemplateRaw.content,
                true
            ),
            sensibility,
            listTypes
        );

        modal_DOM.listSensibilities.append(clone);
    }

    modal_DOM.sexLabelMale.forEach((item) => {
        item.hidden = pkmnData.sexe?.male === 0 || pkmnData.sexe?.male === undefined;
    });

    modal_DOM.sexLabelFemale.forEach((item) => {
        item.hidden = pkmnData.sexe?.female === 0 || pkmnData.sexe?.female === undefined;
    });

    modal_DOM.sexAsexualBarContainer.classList.toggle(
        "hidden",
        !(
            pkmnData.sexe?.female === undefined &&
            pkmnData.sexe?.male === undefined
        )
    );

    modal_DOM.sexMaleBarContainer.style.width = `${pkmnData.sexe?.male}%`;
    modal_DOM.sexMaleBarContainer.classList.toggle("rounded-md", pkmnData.sexe?.female === 0);
    modal_DOM.sexMaleBarContainer.classList.toggle("hidden", pkmnData.sexe?.male === undefined);
    ["px-2", "py-1"].forEach((className) => {
        modal_DOM.sexMaleBarContainer.classList.toggle(
            className,
            pkmnData.sexe?.male > 0 && pkmnData.sexe?.male !== undefined
        );
    });
    modal_DOM.sexRateMale.forEach((item) => {
        item.textContent = `${pkmnData.sexe?.male}%`;
    });

    modal_DOM.sexFemaleBarContainer.style.width = `${pkmnData.sexe?.female}%`;
    modal_DOM.sexFemaleBarContainer.classList.toggle("rounded-md", pkmnData.sexe?.male === 0);
    modal_DOM.sexFemaleBarContainer.classList.toggle("hidden", pkmnData.sexe?.female === undefined);
    ["px-2", "py-1"].forEach((className) => {
        modal_DOM.sexFemaleBarContainer.classList.toggle(
            className,
            pkmnData.sexe?.female > 0 && pkmnData.sexe?.female !== undefined
        );
    });
    modal_DOM.sexRateFemale.forEach((item) => {
        item.textContent = `${pkmnData.sexe?.female}%`;
    });

    modal_DOM.height.textContent = pkmnData.height;
    modal_DOM.weight.textContent = pkmnData.weight;
    modal_DOM.catchRate.textContent = pkmnData.catch_rate;

    clearTagContent(modal_DOM.listAbilities);

    listAbilities.forEach((item) => {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = item.name.fr;
        summary.classList.add(...["hocus:marker:text-(color:--bg-modal-color)"])

        const abilityDescription = document.createElement("p");
        abilityDescription.textContent = item.description?.replaceAll("\\n", " ");
        abilityDescription.classList.add("ml-4");

        if (item.tc) {
            const clone = document.importNode(
                pkmnHighlightTemplateRaw.content,
                true
            );
            summary.append(clone);
        }
        details.append(summary);
        details.insertAdjacentElement("beforeend", abilityDescription);
        details.classList.add("mb-1.5");

        modal_DOM.listAbilities.append(details);
    });

    clearTagContent(modal_DOM.spritesContainer);

    const listSpritesObj = pkmnExtraData.sprites?.other.home || {};
    const listSprites = [];
    const maxPercentage = 100;
    Object.entries(listSpritesObj).forEach(([key, value]) => {
        if (value === null) {
            return;
        }
        let sexLabel = value.includes("female") ? "female" : "male";
        if (pkmnData.sexe?.male === maxPercentage) {
            sexLabel = "male";
        } else if (pkmnData.sexe?.female === maxPercentage) {
            sexLabel = "female";
        }

        listSprites.push({ name: key, sprite: value, key: sexLabel  });
    });
    const groupedSprites = Object.groupBy(listSprites, ({ key }) =>
        key === "female" ? "Femelle ♀" : "Mâle ♂"
    );

    const isOnlyOneSex = pkmnData.sexe?.female === maxPercentage || pkmnData.sexe?.male === maxPercentage;
    Object.entries(groupedSprites).forEach(([key, sprites]) => {
        const listPokemonSpritesTemplate = document.importNode(
            listPokemonSpritesTemplateRaw.content,
            true
        );
        const sexLabel = listPokemonSpritesTemplate.querySelector("p");

        if (Object.keys(groupedSprites).length === 1 && !isOnlyOneSex) {
            sexLabel.classList.add("no-dimorphism")
        } else {
            if(key === "Femelle ♀") {
                sexLabel.classList.add(...["bg-pink-300"])
            } else if (key === "Mâle ♂") {
                sexLabel.classList.add(...["bg-sky-300"])
            }
        }

        sexLabel.classList.toggle("hidden", (pkmnData.sexe?.female === undefined && pkmnData.sexe?.male === undefined));

        const listSpritesUI = listPokemonSpritesTemplate.querySelector(
            "[data-list-sprites]"
        );
        sprites.forEach((item) => {
            const label = `${key} ${
                Object.keys(groupedSprites).length === 1 && !isOnlyOneSex ? "/ Femelle ♀" : ""
            }`
            sexLabel.textContent = label;

            const pokemonSpriteTemplate = document.importNode(
                pokemonSpriteTemplateRaw.content,
                true
            );

            const img = pokemonSpriteTemplate.querySelector("img");
            replaceImage(img, item.sprite);

            img.alt = `sprite ${key} de ${pkmnData.name.fr}`;

            if (!item.name.includes("shiny")) {
                pokemonSpriteTemplate
                    .querySelector("p")
                    .classList.add("hidden");
            }

            listSpritesUI.append(pokemonSpriteTemplate);
        });

        modal_DOM.spritesContainer.append(listPokemonSpritesTemplate);
    });

    clearTagContent(modal_DOM.listGames);

    const listGames = [...listDescriptions.flavor_text_entries, ...pkmnExtraData.game_indices].filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.version.name === value.version.name
        ))
    )
    .map((item) => ({...item, order: Object.keys(FRENCH_GAMES_NAME).findIndex((game) => item.version.name === game)}))
    .sort((a, b) => Number(a.order) - Number(b.order));

    listGames.forEach((item) => {
        const li = document.createElement("li");
        const versionName = FRENCH_GAMES_NAME[item.version.name] || "Unknown";
        li.textContent = versionName;

        modal_DOM.listGames.append(li);
    });
    modal_DOM.nbGames.textContent = ` (${listGames.length})`;
    modal_DOM.listGames.closest("details").inert = listGames.length === 0;

    if (modal_DOM.listRegionalPokedex && pkmnExtraData.pokedex_numbers?.length) {
        clearTagContent(modal_DOM.listRegionalPokedex);
        pkmnExtraData.pokedex_numbers.forEach((pokedexEntry) => {
            const li = document.createElement("li");
            const regionName = POKEDEX[pokedexEntry.pokedex.name] || pokedexEntry.pokedex.name;
            li.textContent = `${regionName} : ${pokedexEntry.entry_number}`;
            modal_DOM.listRegionalPokedex.append(li);
        });
        modal_DOM.pokedexNumbersSection.inert = false;
    } else if (modal_DOM.pokedexNumbersSection) {
        modal_DOM.pokedexNumbersSection.inert = true;
    }

    const tcgCards = await getTCGDexCards(pkmnData.name.en || pkmnData.name.fr);
    if (modal_DOM.tcgCardsContainer && modal_DOM.tcgCardsSection) {
        clearTagContent(modal_DOM.tcgCardsContainer);
        if (tcgCards.length) {
            tcgCards.slice(0, 6).forEach((card) => {
                const cardItem = document.createElement("a");
                cardItem.href = card.url || "#";
                cardItem.target = "_blank";
                cardItem.rel = "noopener noreferrer";
                cardItem.className = "block rounded-md border border-slate-300 overflow-hidden p-1 bg-white";

                const img = document.createElement("img");
                img.src = card.images?.small || card.imageUrl || "";
                img.alt = card.name || "Carte Pokémon";
                img.className = "w-full h-28 object-cover";

                const label = document.createElement("p");
                label.textContent = card.name || "Carte";
                label.className = "text-xs text-slate-700 mt-1 truncate";

                cardItem.append(img, label);
                modal_DOM.tcgCardsContainer.append(cardItem);

                cardItem.addEventListener("click", (event) => {
                    event.stopPropagation();
                });
            });
            modal_DOM.tcgCardsSection.inert = false;
        } else {
            modal_DOM.tcgCardsSection.inert = true;
        }
    }

    const cryUrl = getCryUrl(pkmnData.name.en || pkmnData.name.fr);
    if (cryUrl && modal_DOM.crySection) {
        initWaveSurfer(cryUrl);
    }

    const listRegions = ["alola", "hisui", "galar", "paldea"];
    let listNonRegionalForms = listDescriptions.varieties?.filter((item) => !item.is_default && !listRegions.some((region) => item.pokemon.name.includes(region))) || []
    listNonRegionalForms = listNonRegionalForms.map((item) => {
        return {
            name: item?.name || item.pokemon?.name,
            sprites: {
                regular: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${getPkmnIdFromURL(item.pokemon.url)}.png`,
                artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPkmnIdFromURL(item.pokemon.url)}.png`,
            }
        }
    });
    clearTagContent(modal_DOM.listForms);
    modal_DOM.nbForms.textContent = ` (${listNonRegionalForms?.length || 0})`;

    listNonRegionalForms.forEach((item) => {
        const clone = document.importNode(
            pokemonSpriteTemplateRaw.content,
            true
        );

        const img = clone.querySelector("img");
        img.alt = `Sprite de ${item.name}`;
        img.classList.replace("w-52", "w-36");
        replaceImage(img, item.sprites.regular, () => {
            replaceImage(img, item.sprites.artwork);
        });

        const textContainer = clone.querySelector("p");
        const separator = `${item.name.split(pkmnData.name.en.toLowerCase()).at(-1)}`.substring(1)
        if(FORMS[separator]) {
            const prefix =  FORMS[separator].displayPkmnName ? `${pkmnData.name.fr} ` : "";
            textContainer.textContent = `${prefix}${FORMS[separator].name}`;
        } else {
            textContainer.textContent = item.name;
        }

        modal_DOM.listForms.append(clone);
    });
    modal_DOM.listForms.closest("details").inert = listNonRegionalForms.length === 0;

    clearTagContent(modal_DOM.listRegionalForms);
    modal_DOM.nbRegionalForms.textContent = ` (${pkmnData.formes?.length || 0})`;

    for (const item of pkmnData?.formes || []) {
        const pkmnForm = await fetchPokemon(pkmnData.pokedex_id, item.region);
        const clone = createAlternateForm(
            document.importNode(pkmnTemplateRaw.content, true),
            {...item, ...pkmnData, ...pkmnForm, sprite: pkmnForm.sprites.regular, varieties: listDescriptions.varieties},
            loadDetailsModal
        );

        modal_DOM.listRegionalForms.append(clone);
    }

    modal_DOM.listRegionalForms.closest("details").inert = (pkmnData?.formes || []).length === 0;

    clearTagContent(modal_DOM.statistics);

    let statsTotal = 0;
    pkmnExtraData.stats.forEach((item) => {
        const clone = document.importNode(
            pokemonStatisticTempalteRaw.content,
            true
        );

        const { bar, name, value } = createStatisticEntry(clone, {...item, statistics})

        modal_DOM.statistics.append(name);
        modal_DOM.statistics.append(value);
        modal_DOM.statistics.append(bar);

        statsTotal += item.base_stat;
    })

    const totalStatEntryRow = document.importNode(
        pokemonStatisticTempalteRaw.content,
        true
    );
    const statName = totalStatEntryRow.querySelector("[data-stat-name]");
    const statValue = totalStatEntryRow.querySelector("[data-stat-value]");
    statName.textContent = "Total";
    statName.style.borderTop = "2px solid black";
    statName.style.marginTop = "1.75rem";
    statName.setAttribute("aria-label", `Total statistique de ${pkmnData.name.fr} : ${statsTotal}`);
    statName.style.borderLeftWidth = "0";

    statValue.textContent = statsTotal;
    statValue.style.borderTop = "2px solid black";
    statValue.classList.add("sm:col-span-2");
    statValue.classList.remove("text-right");
    statValue.style.marginTop = "1.75rem";
    statValue.style.borderRightWidth = "0";

    modal_DOM.statistics.append(statName);
    modal_DOM.statistics.append(statValue);

    console.log("Current Pokemon's data", pkmnData);

    loadGenerationBtn.inert = hasReachPokedexEnd;

    clearTagContent(modal_DOM.listSiblings);
    generatePokemonSiblingsUI(pkmnData);
    modal.inert = false;
    modal.setAttribute("aria-busy", false);
};

window.addEventListener("pokedexLoaded", () => {
    if(!modal.open) {
        return;
    }

    const pkmnData = JSON.parse(modal.dataset.pokemonData);
    clearTagContent(modal_DOM.listSiblings);
    generatePokemonSiblingsUI(pkmnData);
});

export { loadDetailsModal }
export default displayModal;
