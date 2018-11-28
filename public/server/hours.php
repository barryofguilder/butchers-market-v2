<?php

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));
$key = (int)$_GET['id'];

$hours = getHoursFromFile();

switch ($method) {
  case 'GET':
    if ($key === 0) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      return;
    }

    $hour = searchForId($key, $hours['hours']);

    if ($hour === null) {
      header('HTTP/1.1 404 Not Found', true, 404);
      return;
    }

    echo '{"hour": ' . json_encode($hour) . '}';
    return;
  case 'PUT':
    $rawHour = $body->hour;
    $oldHour = searchForId($key, $hours['hours']);

    $hour = new \stdClass;
    $hour->id = $key;
    $hour->type = $oldHour["type"];
    $hour->default = $oldHour["default"];
    $hour->label = clean_var($rawHour->{"label"});
    $hour->activeStartDate = clean_var($rawHour->{"activeStartDate"});
    $hour->activeEndDate = clean_var($rawHour->{"activeEndDate"});
    $hour->line1 = clean_var($rawHour->{"line1"});
    $hour->line2 = clean_var($rawHour->{"line2"});
    $hour->line3 = clean_var($rawHour->{"line3"});

    $hourIndex = getIndexForId($key, $hours['hours']);

    array_splice($hours['hours'], $hourIndex, 1);
    array_push($hours['hours'], $hour);

    $hoursJson = json_encode($hours);

    if (!file_put_contents("../data/hours.json", $hoursJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the hours');

      return;
    }

    echo '{"hour": ' . json_encode($hour) . '}';
    return;
  case 'POST':
    $rawHour = $body->hour;

    $hour = new \stdClass;
    $hour->id = generateId($hours['hours']);
    $hour->type = clean_var($rawHour->{"type"});
    $hour->default = false;
    $hour->label = clean_var($rawHour->{"label"});
    $hour->activeStartDate = clean_var($rawHour->{"activeStartDate"});
    $hour->activeEndDate = clean_var($rawHour->{"activeEndDate"});
    $hour->line1 = clean_var($rawHour->{"line1"});
    $hour->line2 = clean_var($rawHour->{"line2"});
    $hour->line3 = clean_var($rawHour->{"line3"});

    array_push($hours['hours'], $hour);

    $hoursJson = json_encode($hours);

    if (!file_put_contents("../data/hours.json", $hoursJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the hours');

      return;
    }

    echo '{"hour": ' . json_encode($hour) . '}';
    return;

  case 'DELETE':
    $hourIndex = getIndexForId($key, $hours['hours']);

    array_splice($hours['hours'], $hourIndex, 1);

    $hoursJson = json_encode($hours);

    if (!file_put_contents("../data/hours.json", $hoursJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not delete the hours');

      return;
    }

    header('HTTP/1.1 204 No Content', true, 204);
    return;
}

function getHoursFromFile() {
  $jsonFile = file_get_contents('../data/hours.json');
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

function searchForId($id, $hours) {
  foreach ($hours as $hour) {
    $hourId = $hour['id'];

    if ($hourId === $id) {
      return $hour;
    }
  }

  return null;
}

function getIndexForId($id, $hours) {
  $index = 0;

  foreach ($hours as $hour) {
    $hourId = $hour['id'];

    if ($hourId === $id) {
      return $index;
    }

    $index++;
  }

  return null;
}

function generateId($hours) {
  $highestId = 0;

  foreach ($hours as $hour) {
    $hourId = $hour['id'];

    if ($hourId > $highestId) {
      $highestId = $hourId;
    }
  }

  return $highestId + 1;
}

?>
