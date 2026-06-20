import { expect, describe, it } from 'vitest';

import {
    cleanString,
    getEvolutionChain,
    FRENCH_GAMES_NAME,
    POKEDEX,
} from "#src/utils/index.js";
import { evolutionLine, evolutionLineFr, pokedex } from "#mocks/index.js";


describe("POKEDEX", () => {
    it("translates Unova pokedex names into French", () => {
        expect(POKEDEX["original-unova"]).toBe("Unys");
        expect(POKEDEX["updated-unova"]).toBe("Unys (N2B2)");
    });

    it("translates Crown Tundra correctly", () => {
        expect(POKEDEX["crown-tundra"]).toBe("Couronneige");
    });
});

describe("FRENCH_GAMES_NAME", () => {
    it("should return the French name for Ruby version", () => {
        expect(FRENCH_GAMES_NAME["ruby"]).toMatch(/rubis/i);
    });
});

describe("cleanString", () => {
    it("should remove all accents and lowercase string", () => {
        expect(cleanString("Stéphane")).toBe("stephane");
    });
});

describe("getEvolutionChain", () => {
    it("should not return more than three levels of evolutions", () => {
        const res = getEvolutionChain(
            evolutionLine,
            evolutionLineFr,
            pokedex
        )

        expect(res.length).toBeLessThan(4);
        expect(res[0].length).toBeLessThan(4);
    });

    it("should return a nested array", () => {
        const res = getEvolutionChain(
            evolutionLine,
            evolutionLineFr,
            pokedex
        );

        res.forEach((item) => {
            expect(Array.isArray(item)).toBeTruthy();
        });
    });
});
