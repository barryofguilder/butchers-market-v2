<?php

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));
$key = (int)$_GET['id'];

$events = getEventsFromFile();

switch ($method) {
  case 'GET':
    if ($key === 0) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      return;
    }

    $event = searchForId($key, $events['events']);

    if ($event === null) {
      header('HTTP/1.1 404 Not Found', true, 404);
      return;
    }

    echo '{"event": ' . json_encode($event) . '}';
    return;
  case 'PUT':
    $rawEvent = $body->event;

    $event->id = $key;
    $event->title = clean_var($rawEvent->{"title"});
    $event->leadIn = clean_var($rawEvent->{"leadIn"});
    $event->startTime = clean_var($rawEvent->{"startTime"});
    $event->endTime = clean_var($rawEvent->{"endTime"});
    $event->link = clean_var($rawEvent->{"link"});

    $eventIndex = getIndexForId($key, $events['events']);

    array_splice($events['events'], $eventIndex, 1);
    array_push($events['events'], $event);

    $eventsJson = json_encode($events);

    if (!file_put_contents("../data/events.json", $eventsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the event');

      return;
    }

    echo '{"event": ' . json_encode($event) . '}';
    return;

  case 'POST':
    $rawEvent = $body->event;

    $event->id = generateId($events['events']);
    $event->title = clean_var($rawEvent->{"title"});
    $event->leadIn = clean_var($rawEvent->{"leadIn"});
    $event->startTime = clean_var($rawEvent->{"startTime"});
    $event->endTime = clean_var($rawEvent->{"endTime"});
    $event->link = clean_var($rawEvent->{"link"});

    array_push($events['events'], $event);

    $eventsJson = json_encode($events);

    if (!file_put_contents("../data/events.json", $eventsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not save the event');

      return;
    }

    echo '{"event": ' . json_encode($event) . '}';
    return;

  case 'DELETE':
    $eventIndex = getIndexForId($key, $events['events']);

    array_splice($events['events'], $eventIndex, 1);

    $eventsJson = json_encode($events);

    if (!file_put_contents("../data/events.json", $eventsJson)) {
      header('HTTP/1.1 400 Bad Request', true, 400);
      echo json_encode('Could not delete the event');

      return;
    }

    header('HTTP/1.1 204 No Content', true, 204);
    return;
}

function getEventsFromFile() {
  $jsonFile = file_get_contents('../data/events.json');
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

function searchForId($id, $events) {
  foreach ($events as $event) {
    $eventId = $event['id'];

    if ($eventId === $id) {
      return $event;
    }
  }

  return null;
}

function getIndexForId($id, $events) {
  $index = 0;

  foreach ($events as $event) {
    $eventId = $event['id'];

    if ($eventId === $id) {
      return $index;
    }

    $index++;
  }

  return null;
}

function generateId($events) {
  $highestId = 0;

  foreach ($events as $event) {
    $eventId = $event['id'];

    if ($eventId > $highestId) {
      $highestId = $eventId;
    }
  }

  return $highestId + 1;
}

?>
