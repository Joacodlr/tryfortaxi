<?php
/* ------------------------------------------------------------------ *
 *  /api/reviews.php — opiniones de pasajeros (cPanel)
 *
 *  Único código de servidor del sitio. Vite lo copia a dist/ y viaja
 *  con el resto al subirlo a public_html. Necesita PHP 7.4 o superior
 *  (cualquier cPanel actual lo tiene).
 *
 *  Las opiniones se guardan en un archivo JSON FUERA de public_html:
 *      /home/<usuario>/taxi-talara-data/reviews.json
 *  Así no se borran al subir una versión nueva del sitio y nadie puede
 *  descargarlo desde el navegador. La carpeta se crea sola con la
 *  primera opinión.
 *
 *  Se publican al instante. Para borrar una: File Manager → abrir
 *  reviews.json → Edit → quitar ese bloque { ... } (y su coma) → Save.
 * ------------------------------------------------------------------ */

declare(strict_types=1);

/** public_html/api/ → dos niveles arriba es la carpeta del usuario. */
$DATA_DIR = dirname(__DIR__, 2) . '/taxi-talara-data';
$DATA_FILE = $DATA_DIR . '/reviews.json';

const MAX_STORED = 300;        // se guardan como mucho las 300 más recientes
const MAX_LISTED = 60;         // cuántas devuelve el GET
const RATE_LIMIT_SECONDS = 60; // espera mínima entre envíos de una misma IP
const LIMIT_NAME = 60;
const LIMIT_SERVICE = 60;
const LIMIT_COMMENT = 600;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean($value, int $max): string
{
    if (!is_string($value)) return '';
    $value = trim((string) preg_replace('/\s+/u', ' ', $value));
    // Quita caracteres de control y deja el texto tal cual (React lo escapa al mostrarlo).
    $value = (string) preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
    // Recorta por caracteres (no bytes) sin depender de mbstring.
    return preg_match('/^.{0,' . $max . '}/us', $value, $m) ? $m[0] : '';
}

function text_length(string $s): int
{
    return (int) preg_match_all('/./us', $s);
}

/** Estructura del archivo: { "reviews": [...], "rate": { "<hash ip>": <timestamp> } } */
function empty_store(): array
{
    return ['reviews' => [], 'rate' => []];
}

function decode_store(string $raw): array
{
    $data = json_decode($raw, true);
    if (!is_array($data)) return empty_store();
    return [
        'reviews' => isset($data['reviews']) && is_array($data['reviews']) ? $data['reviews'] : [],
        'rate' => isset($data['rate']) && is_array($data['rate']) ? $data['rate'] : [],
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* ---------------------------------- GET ---------------------------------- */

if ($method === 'GET') {
    if (!is_file($DATA_FILE)) reply(['reviews' => []]);
    $raw = @file_get_contents($DATA_FILE);
    if ($raw === false) reply(['error' => 'No se pudieron cargar las opiniones.'], 500);
    $store = decode_store($raw);
    reply(['reviews' => array_slice($store['reviews'], 0, MAX_LISTED)]);
}

if ($method !== 'POST') reply(['error' => 'Método no permitido.'], 405);

/* ---------------------------------- POST --------------------------------- */

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) reply(['error' => 'Datos inválidos.'], 400);

// Campo trampa: invisible para personas, los bots lo llenan.
if (clean($body['website'] ?? '', 200) !== '') reply(['ok' => true], 201);

$name = clean($body['name'] ?? '', LIMIT_NAME);
$service = clean($body['service'] ?? '', LIMIT_SERVICE);
$comment = clean($body['comment'] ?? '', LIMIT_COMMENT);
$rating = $body['rating'] ?? null;

if (text_length($name) < 2) reply(['error' => 'Escribe tu nombre.'], 400);
if (!is_int($rating) || $rating < 1 || $rating > 5) reply(['error' => 'Elige una calificación de 1 a 5 estrellas.'], 400);
if (text_length($comment) < 5) reply(['error' => 'Cuéntanos un poco más sobre el servicio.'], 400);
if (preg_match('/https?:\/\/|www\./i', $comment . ' ' . $name)) reply(['error' => 'Por favor no incluyas enlaces.'], 400);

if (!is_dir($DATA_DIR) && !@mkdir($DATA_DIR, 0750, true)) {
    reply(['error' => 'No se pudo guardar tu opinión. Intenta más tarde.'], 500);
}

$fh = @fopen($DATA_FILE, 'c+');
if ($fh === false) reply(['error' => 'No se pudo guardar tu opinión. Intenta más tarde.'], 500);

// Bloqueo exclusivo: dos envíos simultáneos no se pisan.
flock($fh, LOCK_EX);
$raw = stream_get_contents($fh);
$store = decode_store($raw === false ? '' : $raw);

$now = time();
// Se guarda un hash de la IP, no la IP, y solo por un minuto.
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|taxi-talara');
foreach ($store['rate'] as $k => $t) {
    if (!is_int($t) || $now - $t >= RATE_LIMIT_SECONDS) unset($store['rate'][$k]);
}
if (isset($store['rate'][$ipHash])) {
    flock($fh, LOCK_UN);
    fclose($fh);
    reply(['error' => 'Ya recibimos tu opinión. Espera un minuto para enviar otra.'], 429);
}
$store['rate'][$ipHash] = $now;

$review = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'rating' => $rating,
    'service' => $service,
    'comment' => $comment,
    'date' => gmdate('Y-m-d\TH:i:s\Z', $now),
];
array_unshift($store['reviews'], $review);
$store['reviews'] = array_slice($store['reviews'], 0, MAX_STORED);

ftruncate($fh, 0);
rewind($fh);
fwrite($fh, json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
fflush($fh);
flock($fh, LOCK_UN);
fclose($fh);

reply(['review' => $review], 201);
