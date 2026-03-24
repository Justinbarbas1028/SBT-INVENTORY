<?php

test('composer is pinned to php 8.3 for dependency resolution', function () {
    $root = dirname(__DIR__, 2);
    $composer = json_decode(
        file_get_contents($root . DIRECTORY_SEPARATOR . 'composer.json'),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    expect($composer['config']['platform']['php'] ?? null)->toBe('8.3.30');
});

test('composer lock keeps symfony packages below v8', function () {
    $root = dirname(__DIR__, 2);
    $lock = json_decode(
        file_get_contents($root . DIRECTORY_SEPARATOR . 'composer.lock'),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    $packages = array_merge($lock['packages'] ?? [], $lock['packages-dev'] ?? []);
    $violations = [];

    foreach ($packages as $package) {
        $name = $package['name'] ?? '';

        if (! str_starts_with($name, 'symfony/') || str_starts_with($name, 'symfony/polyfill-')) {
            continue;
        }

        $version = $package['version'] ?? '';

        if (str_starts_with($version, 'v8.')) {
            $violations[] = sprintf('%s %s', $name, $version);
        }
    }

    expect($violations)->toBeEmpty();
});
