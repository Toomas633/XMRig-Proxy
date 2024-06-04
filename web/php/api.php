<?php
function fetchData($endpoint)
{
    $url = "http://localhost:8080/1/$endpoint";
    $json = file_get_contents($url);

    if (!$json) {
        return json_encode(array('error' => 'Error fetching data'));
    }

    return $json;
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'summary':
            echo fetchData('summary');
            break;

        case 'workers':
            echo fetchData('workers');
            break;

        default:
            echo json_encode(array('error' => 'Unknown action'));
            break;
    }
}
