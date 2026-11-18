<?php
/**
 * Libro de Reclamaciones virtual — Transportes Tomy D.
 *
 * Recibe la hoja en JSON, le asigna un código correlativo, la guarda en
 * un archivo fuera del alcance web y la envía por correo a la empresa y
 * una copia al consumidor.
 */

declare(strict_types=1);

const COMPANY_EMAIL = 'miguel_pallin@gmail.com';
const COMPANY_NAME  = 'Transportes Tomy D. E.I.R.L.';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function out(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['error' => 'Método no permitido.']);

$raw = file_get_contents('php://input', false, null, 0, 20000);
$b = json_decode($raw ?: '', true);
if (!is_array($b)) out(400, ['error' => 'Solicitud inválida.']);

// Trampa para bots
if (!empty($b['website'])) out(200, ['code' => 'OK']);

$s = function (string $k, int $max) use ($b): string {
    $v = isset($b[$k]) && is_string($b[$k]) ? $b[$k] : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
};

$d = [
    'name'            => $s('name', 120),
    'docType'         => $s('docType', 30),
    'docNumber'       => $s('docNumber', 20),
    'address'         => $s('address', 200),
    'phone'           => $s('phone', 30),
    'email'           => $s('email', 120),
    'minor'           => !empty($b['minor']),
    'guardian'        => $s('guardian', 120),
    'goodType'        => $s('goodType', 20),
    'amount'          => $s('amount', 20),
    'goodDescription' => $s('goodDescription', 300),
    'kind'            => $s('kind', 20) === 'Queja' ? 'Queja' : 'Reclamo',
    'detail'          => $s('detail', 3000),
    'request'         => $s('request', 1500),
];

foreach (['name', 'docNumber', 'address', 'phone', 'email', 'goodDescription', 'detail', 'request'] as $k) {
    if ($d[$k] === '') out(400, ['error' => 'Completa todos los campos obligatorios.']);
}
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) out(400, ['error' => 'El correo no es válido.']);
if ($d['minor'] && $d['guardian'] === '') out(400, ['error' => 'Indica el nombre del padre, madre o apoderado.']);
if (empty($b['accept'])) out(400, ['error' => 'Debes aceptar la declaración.']);

// Correlativo guardado fuera de public_html (un nivel arriba).
$dir = dirname(__DIR__, 2) . '/reclamaciones';
if (!is_dir($dir) && !@mkdir($dir, 0700, true)) out(500, ['error' => 'No se pudo registrar la hoja.']);
$counterFile = $dir . '/contador.txt';
$fp = @fopen($counterFile, 'c+');
if (!$fp) out(500, ['error' => 'No se pudo registrar la hoja.']);
flock($fp, LOCK_EX);
$n = (int) stream_get_contents($fp) + 1;
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, (string) $n);
flock($fp, LOCK_UN);
fclose($fp);

$year = date('Y');
$code = sprintf('%s-%05d-%s', $year, $n, strtoupper(substr($d['kind'], 0, 1)));
$date = date('d/m/Y H:i');

$text = "HOJA DE RECLAMACIÓN N° $code\n"
      . COMPANY_NAME . "\nFecha: $date\n\n"
      . "1. CONSUMIDOR\n"
      . "Nombre: {$d['name']}\n"
      . "Documento: {$d['docType']} {$d['docNumber']}\n"
      . "Domicilio: {$d['address']}\n"
      . "Teléfono: {$d['phone']}\nCorreo: {$d['email']}\n"
      . ($d['minor'] ? "Menor de edad — Apoderado: {$d['guardian']}\n" : '')
      . "\n2. BIEN CONTRATADO\n"
      . "Tipo: {$d['goodType']}\nMonto: " . ($d['amount'] !== '' ? "S/ {$d['amount']}" : '—') . "\n"
      . "Descripción: {$d['goodDescription']}\n"
      . "\n3. DETALLE ({$d['kind']})\n{$d['detail']}\n\nPedido:\n{$d['request']}\n\n"
      . "El proveedor dará respuesta en un plazo no mayor a 15 días hábiles.\n";

@file_put_contents("$dir/$code.txt", $text, LOCK_EX);

$host = preg_replace('/[^a-z0-9.-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$from = 'no-responder@' . preg_replace('/^www\./', '', $host);
$subject = '=?UTF-8?B?' . base64_encode("Libro de Reclamaciones — $code") . '?=';
$headers = "From: " . COMPANY_NAME . " <$from>\r\nContent-Type: text/plain; charset=UTF-8\r\n";

$okCompany = @mail(COMPANY_EMAIL, $subject, $text, $headers . "Reply-To: {$d['email']}\r\n");
@mail($d['email'], $subject, $text, $headers . 'Reply-To: ' . COMPANY_EMAIL . "\r\n");

if (!$okCompany) out(500, ['error' => "La hoja $code se registró, pero no se pudo enviar el correo."]);

out(201, ['code' => $code]);
