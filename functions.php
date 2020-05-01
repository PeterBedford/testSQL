<?php

function load_stylesheets()
{
 
    wp_register_style('bootstrap-cdn', get_template_directory_uri() . 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', );
    wp_enqueue_style('bootstrap-cdn');

    wp_register_style('codemirror-cdn', get_template_directory_uri() . 'https://codemirror.net/lib/codemirror.css', );
    wp_enqueue_style('codemirror-cdn');

    wp_register_style('jquery-cdn', get_template_directory_uri() . 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css', );
    wp_enqueue_style('jquery-cdn');

    wp_register_style('IE10-Tab-Fix', get_template_directory_uri() . '/css/ie10-viewport-bug-workaround.css', );
    wp_enqueue_style('IE10-Tab-Fix');

    wp_register_style('Custom-Style', get_template_directory_uri() . 'css/main.css', );
    wp_enqueue_style('Custom-Style');

    wp_register_style('Cloudflare-cdn', get_template_directory_uri() . 'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css', );
    wp_enqueue_style('Cloudflare-cdn');

}
add_action('wp_enqueue_scripts', 'load_stylesheets');

