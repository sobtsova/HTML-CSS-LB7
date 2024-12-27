<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        $logFile = 'event_logs.txt';

        $logEntry = "Event ID: {$data['id']}, Message: {$data['message']}, Timestamp: {$data['timestamp']}\n";

        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        echo json_encode(['status' => 'success', 'message' => 'Log entry saved']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
