import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FRENCH_GAMES_NAME } from "../src/utils/dataDictonaries.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const game = (req.body.game || "unknown").toString();
    const originalName = file.originalname.replace(/\s+/g, "-");
    const base = originalName.replace(/\.[^.]+$/, "");
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = sanitize(`${game}-${base}`);
    const filename = `${Date.now()}-${sanitizedBase}${ext}`;
    cb(null, filename);
  },
});

function sanitize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

app.use("/uploads", express.static(uploadDir));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Upload server listening on http://localhost:${port}`));
