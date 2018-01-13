<?php

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));
$key = (int)$_GET['id'];

$performances = getPerformancesFromFile();

switch ($method) {
  case 'GET':
    if ($key === 0) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      return;
    }

    $performance = searchForId($key, $performances['performances']);

    if ($performance === null) {
      header('HTTP/1.1 404 Not Found', true, 404);
      return;
    }

    echo '{"performance": ' . json_encode($performance) . '}';
    return;
  case 'PUT':
    $rawPerformance = $body->performance;

    $performance->id = $key;
    $performance->title = clean_var($rawPerformance->{"title"});
    $performance->link = clean_var($rawPerformance->{"link"});

    $performanceIndex = getIndexForId($key, $performances['performances']);

    array_splice($performances['performances'], $performanceIndex, 1);
    array_push($performances['performances'], $performance);

    $performancesJson = json_encode($performances);

    if (!file_put_contents("../data/performances.json", $performancesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the performance');

      return;
    }

    echo '{"performance": ' . json_encode($performance) . '}';
    return;

  case 'POST':
    $rawPerformance = $body->performance;

    $performance->id = generateId($performances['performances']);
    $performance->title = clean_var($rawPerformance->{"title"});
    $performance->link = clean_var($rawPerformance->{"link"});

    array_push($performances['performances'], $performance);

    $performancesJson = json_encode($performances);

    if (!file_put_contents("../data/performances.json", $performancesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the performance');

      return;
    }

    echo '{"performance": ' . json_encode($performance) . '}';
    return;

  case 'DELETE':
    $performanceIndex = getIndexForId($key, $performances['performances']);

    array_splice($performances['performances'], $performanceIndex, 1);

    $performancesJson = json_encode($performances);

    if (!file_put_contents("../data/performances.json", $performancesJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not delete the performance');

      return;
    }

    header('HTTP/1.1 204 No Content', true, 204);
    return;
}

function getPerformancesFromFile() {
  $jsonFile = file_get_contents('../data/performances.json');
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

function searchForId($id, $performances) {
  foreach ($performances as $performance) {
    $performanceId = $performance['id'];

    if ($performanceId === $id) {
      return $performance;
    }
  }

  return null;
}

function getIndexForId($id, $performances) {
  $index = 0;

  foreach ($performances as $performance) {
    $performanceId = $performance['id'];

    if ($performanceId === $id) {
      return $index;
    }

    $index++;
  }

  return null;
}

function generateId($performances) {
  $highestId = 0;

  foreach ($performances as $performance) {
    $performanceId = $performance['id'];

    if ($performanceId > $highestId) {
      $highestId = $performanceId;
    }
  }

  return $highestId + 1;
}

?>
