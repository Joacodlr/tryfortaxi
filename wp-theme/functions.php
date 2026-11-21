<?php
/**
 * Tema "Tomy D. 2026" — Libro de Reclamaciones.
 *
 * - Cada hoja se guarda como entrada privada "Reclamaciones" en el panel
 *   de WordPress (menú lateral), con su código correlativo.
 * - Se envía por correo a la empresa y una copia al consumidor.
 * - El formulario la manda a  POST /wp-json/tomyd/v1/reclamo
 */
if (!defined('ABSPATH')) exit;

const TOMYD_COMPANY_EMAIL = 'transportestomyd@gmail.com';
const TOMYD_COMPANY_NAME  = 'Transportes Tomy D. E.I.R.L.';

add_action('init', function () {
    register_post_type('tomyd_reclamo', [
        'labels' => [
            'name'          => 'Reclamaciones',
            'singular_name' => 'Reclamación',
            'all_items'     => 'Libro de Reclamaciones',
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-book-alt',
        'menu_position'   => 25,
        'supports'        => ['title', 'editor'],
        'capability_type' => 'post',
        'capabilities'    => ['create_posts' => 'do_not_allow'],
        'map_meta_cap'    => true,
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('tomyd/v1', '/reclamo', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'tomyd_reclamo',
    ]);
});

function tomyd_reclamo(WP_REST_Request $req) {
    $b = $req->get_json_params();
    if (!is_array($b)) return new WP_REST_Response(['error' => 'Solicitud inválida.'], 400);

    // Trampa para bots
    if (!empty($b['website'])) return new WP_REST_Response(['code' => 'OK'], 200);

    // Límite simple: 5 hojas por IP cada 10 minutos
    $ip  = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '');
    $key = 'tomyd_rl_' . md5($ip);
    $hits = (int) get_transient($key);
    if ($hits >= 5) return new WP_REST_Response(['error' => 'Demasiados envíos. Intenta en unos minutos.'], 429);
    set_transient($key, $hits + 1, 10 * MINUTE_IN_SECONDS);

    $s = function ($k, $max) use ($b) {
        $v = isset($b[$k]) && is_string($b[$k]) ? $b[$k] : '';
        return mb_substr(trim(sanitize_textarea_field($v)), 0, $max);
    };

    $d = [
        'name'            => $s('name', 120),
        'docType'         => $s('docType', 30),
        'docNumber'       => $s('docNumber', 20),
        'address'         => $s('address', 200),
        'phone'           => $s('phone', 30),
        'email'           => sanitize_email($b['email'] ?? ''),
        'minor'           => !empty($b['minor']),
        'guardian'        => $s('guardian', 120),
        'goodType'        => $s('goodType', 20),
        'amount'          => $s('amount', 20),
        'goodDescription' => $s('goodDescription', 300),
        'kind'            => $s('kind', 20) === 'Queja' ? 'Queja' : 'Reclamo',
        'detail'          => $s('detail', 3000),
        'request'         => $s('request', 1500),
    ];

    foreach (['name', 'docNumber', 'address', 'phone', 'goodDescription', 'detail', 'request'] as $k) {
        if ($d[$k] === '') return new WP_REST_Response(['error' => 'Completa todos los campos obligatorios.'], 400);
    }
    if (!is_email($d['email'])) return new WP_REST_Response(['error' => 'El correo no es válido.'], 400);
    if ($d['minor'] && $d['guardian'] === '') return new WP_REST_Response(['error' => 'Indica el nombre del padre, madre o apoderado.'], 400);
    if (empty($b['accept'])) return new WP_REST_Response(['error' => 'Debes aceptar la declaración.'], 400);

    // Correlativo por año
    $year = wp_date('Y');
    $opt  = 'tomyd_reclamo_n_' . $year;
    $n    = (int) get_option($opt, 0) + 1;
    update_option($opt, $n, false);
    $code = sprintf('%s-%05d-%s', $year, $n, $d['kind'] === 'Queja' ? 'Q' : 'R');
    $date = wp_date('d/m/Y H:i');

    $text = "HOJA DE RECLAMACIÓN N° $code\n"
          . TOMYD_COMPANY_NAME . "\nFecha: $date\n\n"
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

    $post_id = wp_insert_post([
        'post_type'    => 'tomyd_reclamo',
        'post_status'  => 'private',
        'post_title'   => "$code — {$d['kind']} — {$d['name']}",
        'post_content' => $text,
    ], true);
    if (is_wp_error($post_id)) return new WP_REST_Response(['error' => 'No se pudo registrar la hoja.'], 500);

    $subject = "Libro de Reclamaciones — $code";
    wp_mail(TOMYD_COMPANY_EMAIL, $subject, $text, ['Reply-To: ' . $d['email']]);
    wp_mail($d['email'], $subject, $text, ['Reply-To: ' . TOMYD_COMPANY_EMAIL]);

    // La hoja ya quedó guardada en el panel aunque el correo falle.
    return new WP_REST_Response(['code' => $code], 201);
}

/* El tema no usa nada del front-end de WordPress: quitamos lo que sobra. */
add_filter('show_admin_bar', '__return_false');
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/* Las rutas (/servicios, /flota…) las maneja React: que WordPress no
   redirija ni "adivine" otra página parecida. */
add_filter('redirect_canonical', '__return_false');
add_filter('do_redirect_guess_404_permalink', '__return_false');
