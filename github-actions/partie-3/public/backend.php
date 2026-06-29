<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$games = [
    'red' => 'Pokémon Rouge', 'blue' => 'Pokémon Bleue', 'yellow' => 'Pokémon Jaune',
    'gold' => 'Pokémon Or', 'silver' => 'Pokémon Argent', 'crystal' => 'Pokémon Crystal',
    'sapphire' => 'Pokémon Saphir', 'ruby' => 'Pokémon Rubis', 'emerald' => 'Pokémon Émeraude',
    'firered' => 'Pokémon Rouge feu', 'leafgreen' => 'Pokémon Vert feuille',
    'diamond' => 'Pokémon Diamant', 'pearl' => 'Pokémon Perle', 'platinum' => 'Pokémon Platine',
    'heartgold' => 'Pokémon Or HeartGold', 'soulsilver' => 'Pokémon Argent SoulSilver',
    'white' => 'Pokémon Blanche', 'black' => 'Pokémon Noire', 'black-2' => 'Pokémon Noire 2',
    'white-2' => 'Pokémon Blanche 2', 'x' => 'Pokémon X', 'y' => 'Pokémon Y',
    'omega-ruby' => 'Pokémon Rubis Oméga', 'alpha-sapphire' => 'Pokémon Saphir Alpha',
    'sun' => 'Pokémon Soleil', 'moon' => 'Pokémon Lune', 'ultra-moon' => 'Pokémon Ultra-Lune',
    'ultra-sun' => 'Pokémon Ultra-Soleil', 'sword' => 'Pokémon Épée',
    'shield' => 'Pokémon Bouclier', 'violet' => 'Pokémon Violet', 'scarlet' => 'Pokémon Écarlate',
    'lets-go-eevee' => "Pokémon Let's Go, Évoli", 'lets-go-pikachu' => "Pokémon Let's Go, Pikachu",
    'legends-arceus' => 'Légendes Pokémon : Arceus',
    'brilliant-diamond' => 'Pokémon Diamant Étincelant', 'shining-pearl' => 'Pokémon Perle Scintillante',
];

$coverBases = [
    'red' => 'rouge', 'blue' => 'bleue', 'yellow' => 'jaune', 'gold' => 'or',
    'silver' => 'argent', 'crystal' => 'cristal', 'ruby' => 'rubis', 'sapphire' => 'saphir',
    'emerald' => 'emeraude', 'firered' => 'rouge-feu', 'leafgreen' => 'vert-feuille',
    'diamond' => 'diamant', 'pearl' => 'perle', 'platinum' => 'platine',
    'heartgold' => 'or-heartgold', 'soulsilver' => 'argent-soul-silver', 'black' => 'noire',
    'white' => 'blanche', 'black-2' => 'noire-2', 'white-2' => 'blanche-2',
    'omega-ruby' => 'rubis-omega', 'alpha-sapphire' => 'saphir-alpha',
    'sun' => 'soleil', 'moon' => 'lune', 'ultra-sun' => 'ultra-soleil',
    'ultra-moon' => 'ultra-lune', 'sword' => 'epee', 'shield' => 'bouclier',
    'scarlet' => 'ecarlate', 'lets-go-eevee' => 'let-s-go-evoli',
    'lets-go-pikachu' => 'let-s-go-pikachu', 'legends-arceus' => 'legendes-pokemon-arceus',
    'brilliant-diamond' => 'diamant-etincelant', 'shining-pearl' => 'perle-scintillante',
];

$uploadDirectory = __DIR__ . '/uploads';
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0755, true);
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function imageFiles(string $directory): array
{
    $files = is_dir($directory) ? scandir($directory) : [];
    return array_values(array_filter($files ?: [], static fn (string $file): bool =>
        preg_match('/\.(png|jpe?g|gif|webp|avif)$/i', $file) === 1
    ));
}

$action = $_GET['action'] ?? '';

if ($action === 'games') {
    respond(array_map(
        static fn (string $id, string $name): array => ['id' => $id, 'name' => $name],
        array_keys($games),
        array_values($games)
    ));
}

if ($action === 'list') {
    respond(array_map(static fn (string $filename): array => [
        'filename' => $filename,
        'url' => '/uploads/' . rawurlencode($filename),
    ], imageFiles($uploadDirectory)));
}

if ($action === 'covers') {
    $covers = [];
    foreach (imageFiles($uploadDirectory) as $filename) {
        $base = pathinfo($filename, PATHINFO_FILENAME);
        foreach ($games as $key => $_name) {
            if ($base === $key || $base === ($coverBases[$key] ?? null)) {
                $covers[$key] = ['filename' => $filename, 'url' => '/uploads/' . rawurlencode($filename)];
                break;
            }
        }
    }
    respond($covers);
}

if ($action === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $game = (string) ($_POST['game'] ?? '');
    $file = $_FILES['cover'] ?? null;
    if (!isset($games[$game]) || !is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        respond(['error' => 'Jeu ou fichier invalide.'], 400);
    }

    $mimeTypes = [
        'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif',
        'image/webp' => 'webp', 'image/avif' => 'avif',
    ];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset($mimeTypes[$mime])) {
        respond(['error' => 'Le fichier doit être une image.'], 400);
    }

    $filename = $game . '.' . $mimeTypes[$mime];
    $oldCoverBases = array_unique([$game, $coverBases[$game] ?? $game]);
    foreach ($oldCoverBases as $oldCoverBase) {
        foreach (glob($uploadDirectory . '/' . $oldCoverBase . '.*') ?: [] as $oldCover) {
            unlink($oldCover);
        }
    }
    if (!move_uploaded_file($file['tmp_name'], $uploadDirectory . '/' . $filename)) {
        respond(['error' => "Impossible d'enregistrer la jaquette."], 500);
    }
    respond(['ok' => true, 'filename' => $filename, 'path' => '/uploads/' . rawurlencode($filename)]);
}

respond(['error' => 'Route inconnue.'], 404);
