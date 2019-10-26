<?php

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));
$key = (int)$_GET['id'];

$bundles = getPackageBundlesFromFile();

switch ($method) {
  case 'GET':
    if ($key === 0) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      return;
    }

    $bundle = searchForId($key, $bundles['packageBundles']);

    if ($bundle === null) {
      header('HTTP/1.1 404 Not Found', true, 404);
      return;
    }

    echo '{"packageBundle": ' . json_encode($bundle) . '}';
    return;
  case 'PUT':
    $rawBundle = $body->packageBundle;

    $bundle = new \stdClass;
    $bundle->id = $key;
    $bundle->title = clean_var($rawBundle->title);
    $bundle->displayOrder = $rawBundle->displayOrder;
    $bundle->flyerDownloadLink = clean_var($rawBundle->flyerDownloadLink);
    $bundle->prices = $rawBundle->prices;
    $bundle->items = $rawBundle->items;

    $bundleIndex = getIndexForId($key, $bundles['packageBundles']);

    array_splice($bundles['packageBundles'], $bundleIndex, 1);
    array_push($bundles['packageBundles'], $bundle);

    $bundlesJson = json_encode($bundles);

    if (!file_put_contents("../data/packageBundles.json", $bundlesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the package bundle');

      return;
    }

    echo '{"packageBundle": ' . json_encode($bundle) . '}';
    return;
  case 'POST':
    $rawBundle = $body->packageBundle;

    $bundle = new \stdClass;
    $bundle->id = $key;
    $bundle->title = clean_var($rawBundle->title);
    $bundle->displayOrder = $rawBundle->displayOrder;
    $bundle->flyerDownloadLink = clean_var($rawBundle->flyerDownloadLink);
    $bundle->prices = $rawBundle->prices;
    $bundle->items = $rawBundle->items;

    array_push($bundles['packageBundles'], $bundle);

    $bundlesJson = json_encode($bundles);

    if (!file_put_contents("../data/packageBundles.json", $bundlesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the package bundle');

      return;
    }

    echo '{"packageBundle": ' . json_encode($bundle) . '}';
    return;

  case 'DELETE':
    $bundleIndex = getIndexForId($key, $bundles['packageBundles']);

    array_splice($bundles['packageBundles'], $bundleIndex, 1);

    $bundlesJson = json_encode($bundles);

    if (!file_put_contents("../data/packageBundles.json", $bundlesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not delete the package bundle');

      return;
    }

    header('HTTP/1.1 204 No Content', true, 204);
    return;
}

function getPackageBundlesFromFile() {
  $jsonFile = file_get_contents('../data/packageBundles.json');
  $jsonObject = json_decode($jsonFile, true);

  return $jsonObject;
}

function clean_var($variable) {
  $content = strip_tags(stripslashes(trim(rtrim($variable))));

  if ($content == "") {
    return null;
  }

  return $content;
}

function searchForId($id, $bundles) {
  foreach ($bundles as $bundle) {
    $bundleId = $bundle['id'];

    if ($bundleId === $id) {
      return $bundle;
    }
  }

  return null;
}

function getIndexForId($id, $bundles) {
  $index = 0;

  foreach ($bundles as $bundle) {
    $bundleId = $bundle['id'];

    if ($bundleId === $id) {
      return $index;
    }

    $index++;
  }

  return null;
}

function generateId($bundles) {
  $highestId = 0;

  foreach ($bundles as $bundle) {
    $bundleId = $bundle['id'];

    if ($bundleId > $highestId) {
      $highestId = $bundleId;
    }
  }

  return $highestId + 1;
}

?>
