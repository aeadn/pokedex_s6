import { describe, expect, it } from "vitest";

import { GAME_COVER_FILE_BASES, sanitizeFilename } from "../server/utils.js";

describe("sanitizeFilename", () => {
    it("normalizes case, accents, spaces and punctuation", () => {
        expect(sanitizeFilename("Let's_Go Évoli")).toBe("let-s-go-evoli");
    });
});

describe("GAME_COVER_FILE_BASES", () => {
    it("maps PokeAPI game names to sanitized French cover names", () => {
        expect(GAME_COVER_FILE_BASES["lets-go-eevee"]).toBe("let-s-go-evoli");
        expect(GAME_COVER_FILE_BASES["brilliant-diamond"]).toBe("diamant-etincelant");
    });
});
