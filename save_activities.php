<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = urldecode($_POST['data']);
    file_put_contents('activities.csv', $data, FILE_APPEND);
    echo "Activity saved.";
} else {
    echo "Invalid request.";
}
?>
