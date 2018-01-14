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
    $hour->label = clean_var($rawHour->{"label"});
    $hour->active = $rawHour->{"active"};
    $hour->line1 = clean_var($rawHour->{"line1"});
    $hour->line2 = clean_var($rawHour->{"line2"});
    $hour->line3 = clean_var($rawHour->{"line3"});

    $hours = updateActive($hour, $hours);

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

function updateActive($editHour, $hours) {
  $editHourId = $editHour->{"id"};
  $editHourType = $editHour->{"type"};
  $index = 0;

  foreach ($hours['hours'] as $hour) {
    $hourId = $hour['id'];
    $hourType = $hour['type'];

    if ($hourType === $editHourType && $hourId !== $editHourId) {
      $hour['active'] = !$editHour->{"active"};

      array_splice($hours['hours'], $index, 1);
      array_push($hours['hours'], $hour);
    }

    $index++;
  }

  return $hours;
}

?>
