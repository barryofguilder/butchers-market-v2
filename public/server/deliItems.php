<?php

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));
$key = (int)$_GET['id'];

$deliItems = getDeliItemsFromFile();

switch ($method) {
  case 'GET':
    if ($key === 0) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      return;
    }

    $deliItem = searchForId($key, $deliItems['deliItems']);

    if ($deliItem === null) {
      header('HTTP/1.1 404 Not Found', true, 404);
      return;
    }

    echo '{"deliItem": ' . json_encode($deliItem) . '}';
    return;
  case 'PUT':
    $rawDeliItem = $body->deliItem;

    $deliItem = new \stdClass;
    $deliItem->id = $key;
    $deliItem->title = clean_var($rawDeliItem->{"title"});
    $deliItem->ingredients = clean_var($rawDeliItem->{"ingredients"});
    $deliItem->imageUrl = clean_var($rawDeliItem->{"imageUrl"});

    $deliItemIndex = getIndexForId($key, $deliItems['deliItems']);

    array_splice($deliItems['deliItems'], $deliItemIndex, 1);
    array_push($deliItems['deliItems'], $deliItem);

    $deliItemsJson = json_encode($deliItems);

    if (!file_put_contents("../data/deliItems.json", $deliItemsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the deli item');

      return;
    }

    echo '{"deliItem": ' . json_encode($deliItem) . '}';
    return;

  case 'POST':
    $rawDeliItem = $body->deliItem;

    $deliItem = new \stdClass;
    $deliItem->id = generateId($deliItems['events']);
    $deliItem->title = clean_var($rawDeliItem->{"title"});
    $deliItem->ingredients = clean_var($rawDeliItem->{"ingredients"});
    $deliItem->imageUrl = clean_var($rawDeliItem->{"imageUrl"});

    array_push($deliItems['deliItems'], $deliItem);

    $deliItemsJson = json_encode($deliItems);

    if (!file_put_contents("../data/deliItems.json", $deliItemsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the deli item');

      return;
    }

    echo '{"deliItem": ' . json_encode($deliItem) . '}';
    return;

  case 'DELETE':
    $deliItemIndex = getIndexForId($key, $deliItems['deliItems']);

    array_splice($deliItems['deliItems'], $deliItemIndex, 1);

    $deliItemsJson = json_encode($deliItems);

    if (!file_put_contents("../data/deliItems.json", $deliItemsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not delete the deli item');

      return;
    }

    header('HTTP/1.1 204 No Content', true, 204);
    return;
}

function getDeliItemsFromFile() {
  $jsonFile = file_get_contents('../data/deliItems.json');
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

function searchForId($id, $deliItems) {
  foreach ($deliItems as $deliItem) {
    $deliItemId = $deliItem['id'];

    if ($deliItemId === $id) {
      return $deliItem;
    }
  }

  return null;
}

function getIndexForId($id, $deliItems) {
  $index = 0;

  foreach ($deliItems as $deliItem) {
    $deliItemId = $deliItem['id'];

    if ($deliItemId === $id) {
      return $index;
    }

    $index++;
  }

  return null;
}

function generateId($deliItems) {
  $highestId = 0;

  foreach ($deliItems as $deliItem) {
    $deliItemId = $deliItem['id'];

    if ($deliItemId > $highestId) {
      $highestId = $deliItemId;
    }
  }

  return $highestId + 1;
}

?>
