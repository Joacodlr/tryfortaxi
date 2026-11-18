<?php
/**
 * Tema "Tomy D. 2026": cualquier URL del sitio (/, /servicios, /flota…)
 * devuelve la app ya compilada; React decide qué página mostrar.
 */
if (!defined('ABSPATH')) exit;

status_header(200);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

readfile(get_template_directory() . '/app.html');
