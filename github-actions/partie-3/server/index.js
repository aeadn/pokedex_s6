import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FRENCH_GAMES_NAME } from "../src/utils/dataDictonaries.js";
import { GAME_COVER_FILE_BASES, sanitizeFilename } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const game = (req.body.game || "unknown").toString();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${sanitizeFilename(game)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const app = express();
app.use(express.json());

// Allow CORS from Vite dev server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send(
    `<html><head><title>Upload API</title></head><body><h1>Upload backend</h1><p>Use <a href="/games">/games</a> to list games and <code>POST /upload</code> to upload a cover.</p></body></html>`
  );
});

app.get("/games", (req, res) => {
  const games = Object.keys(FRENCH_GAMES_NAME).map((key) => ({ id: key, name: FRENCH_GAMES_NAME[key] }));
  res.json(games);
});

app.post("/upload", upload.single("cover"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ ok: true, filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

app.get("/uploads/list", (req, res) => {
  fs.readdir(uploadDir, (error, files) => {
    if (error) return res.status(500).json({ error: "Impossible de lire le dossier des jaquettes." });
    const images = files.filter((filename) => /\.(png|jpe?g|gif|webp|avif)$/i.test(filename));
    res.json(images.map((filename) => ({ filename, url: `/uploads/${encodeURIComponent(filename)}` })));
  });
});

app.get("/uploads/game-covers", (req, res) => {
  fs.readdir(uploadDir, (error, files) => {
    if (error) return res.status(500).json({ error: "Impossible de lire le dossier des jaquettes." });

    const gameKeys = Object.keys(FRENCH_GAMES_NAME);
    const sanitizedKeys = gameKeys.map((key) => ({
      key,
      candidates: [sanitizeFilename(key), GAME_COVER_FILE_BASES[key]].filter(Boolean),
    }));

    const covers = {};
    files
      .filter((filename) => /\.(png|jpe?g|gif|webp|avif)$/i.test(filename))
      .forEach((filename) => {
        const base = filename.replace(/\.[^.]+$/, "");
        const withoutPrefix = base.replace(/^\d+-/, "");

        const match = sanitizedKeys.find(({ candidates }) =>
          candidates.includes(withoutPrefix)
        );
        if (!match) return;

        const fileUrl = `/uploads/${encodeURIComponent(filename)}`;
        const timestamp = Number(base.split("-")[0]) || 0;

        if (!covers[match.key] || covers[match.key].timestamp < timestamp) {
          covers[match.key] = { filename, url: fileUrl, timestamp };
        }
      });

    res.json(Object.fromEntries(
      Object.entries(covers).map(([key, value]) => [key, { filename: value.filename, url: value.url }])
    ));
  });
});

app.use("/uploads", express.static(uploadDir));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Upload server listening on http://localhost:${port}`));
