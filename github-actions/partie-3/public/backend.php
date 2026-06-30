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

function fetchJson(string $url): ?array
{
    $headers = [
        'Accept: application/vnd.github+json',
        'User-Agent: pokedex-s6',
        'X-GitHub-Api-Version: 2022-11-28',
    ];
    $token = getenv('GITHUB_TOKEN');
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 10,
        ]);
        $body = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        unset($curl);
    } else {
        $context = stream_context_create(['http' => [
            'header' => implode("\r\n", $headers),
            'ignore_errors' => true,
            'timeout' => 10,
        ]]);
        $body = @file_get_contents($url, false, $context);
        $status = 200;
    }

    if (!is_string($body) || $status < 200 || $status >= 300) {
        return null;
    }

    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
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

if ($action === 'contributors') {
    $resource = getenv('GITHUB_TOKEN') ? 'collaborators' : 'contributors';
    $contributors = fetchJson('https://api.github.com/repos/aeadn/pokedex_s6/' . $resource . '?per_page=100');
    if ($contributors === null) {
        respond(['error' => 'Impossible de charger les contributeurs GitHub.'], 502);
    }

    $profiles = [];
    foreach ($contributors as $contributor) {
        $profile = isset($contributor['url']) ? fetchJson($contributor['url']) : null;
        $profiles[] = [
            'login' => $contributor['login'] ?? '',
            'name' => $profile['name'] ?? null,
            'avatar_url' => $contributor['avatar_url'] ?? '',
            'html_url' => $contributor['html_url'] ?? '',
        ];
    }

    respond($profiles);
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
