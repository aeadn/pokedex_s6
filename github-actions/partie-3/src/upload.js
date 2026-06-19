const API_BASE = "http://localhost:3000";

async function fetchUploadedFiles() {
  const list = document.getElementById("uploaded-files");
  list.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/uploads/list`);
    const files = await res.json();
    if (!Array.isArray(files) || files.length === 0) {
      list.innerHTML = `<li class="text-slate-600">Aucune jaquette uploadée pour l'instant.</li>`;
      return;
    }

    files.forEach((file) => {
      const item = document.createElement("li");
      item.className = "rounded-md border border-slate-200 bg-white p-3 shadow-sm";
      item.innerHTML = `<a href="${file.url}" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-slate-700">${file.filename}</a>`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    list.innerHTML = `<li class="text-red-600">Impossible de récupérer les jaquettes téléchargées.</li>`;
  }
}

async function initUpload() {
  const select = document.getElementById("game-select");
  const form = document.getElementById("upload-form");
  const fileInput = document.getElementById("cover-input");
  const status = document.getElementById("upload-status");

  try {
    const res = await fetch(`${API_BASE}/games`);
    const games = await res.json();
    games.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    status.textContent = "Impossible de charger la liste des jeux.";
  }

  await fetchUploadedFiles();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!fileInput.files.length) {
      status.textContent = "Veuillez choisir une image.";
      return;
    }

    const fd = new FormData();
    fd.append("cover", fileInput.files[0]);
    fd.append("game", select.value);

    status.textContent = "Envoi en cours...";
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        status.textContent = `Upload réussi : ${data.filename}`;
        fileInput.value = "";
        select.value = "";
        await fetchUploadedFiles();
      } else {
        status.textContent = `Erreur: ${data.error || 'unknown'}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Erreur réseau lors de l'upload.";
    }
  });
}

document.addEventListener("DOMContentLoaded", initUpload);
