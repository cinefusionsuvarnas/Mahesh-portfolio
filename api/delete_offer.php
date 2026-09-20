<?php

session_start();

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {

    // --------------------------------------------------
    // CHECK ADMIN LOGIN
    // --------------------------------------------------
    if (
        !isset($_SESSION['admin_logged_in']) ||
        $_SESSION['admin_logged_in'] !== true
    ) {
        http_response_code(401);

        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Please login again.'
        ]);

        exit;
    }

    // --------------------------------------------------
    // ONLY POST
    // --------------------------------------------------
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);

        echo json_encode([
            'success' => false,
            'message' => 'Only POST requests are allowed.'
        ]);

        exit;
    }

    // --------------------------------------------------
    // GET OFFER ID
    // --------------------------------------------------
    $id = $_POST['id'] ?? null;

    // Also support JSON
    if ($id === null) {

        $raw = file_get_contents('php://input');

        if (!empty($raw)) {

            $json = json_decode($raw, true);

            if (is_array($json)) {
                $id = $json['id'] ?? null;
            }
        }
    }

    // --------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------
    if ($id === null || $id === '' || !is_numeric($id)) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid offer ID.',
            'received_id' => $id
        ]);

        exit;
    }

    $id = (int)$id;

    // --------------------------------------------------
    // FIND OFFER FIRST
    // --------------------------------------------------
    $stmt = $pdo->prepare(
        'SELECT id, image_path FROM offers WHERE id = :id'
    );

    $stmt->execute([
        ':id' => $id
    ]);

    $offer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$offer) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Offer not found.',
            'id' => $id
        ]);

        exit;
    }

    // --------------------------------------------------
    // DELETE OFFER
    // --------------------------------------------------
    $stmt = $pdo->prepare(
        'DELETE FROM offers WHERE id = :id'
    );

    $stmt->execute([
        ':id' => $id
    ]);

    if ($stmt->rowCount() !== 1) {

        http_response_code(500);

        echo json_encode([
            'success' => false,
            'message' => 'Database did not delete the offer.'
        ]);

        exit;
    }

    // --------------------------------------------------
    // DELETE IMAGE FROM LOCAL SERVER
    // --------------------------------------------------
    if (!empty($offer['image_path'])) {

        $imagePath = __DIR__ . '/../' . ltrim(
            $offer['image_path'],
            '/\\'
        );

        if (is_file($imagePath)) {
            @unlink($imagePath);
        }
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------
    echo json_encode([
        'success' => true,
        'message' => 'Offer deleted successfully.',
        'id' => $id
    ]);

    exit;

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Database error while deleting offer.',
        'error' => $e->getMessage(),
        'sql_state' => $e->getCode()
    ]);

    exit;

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Server error while deleting offer.',
        'error' => $e->getMessage()
    ]);

    exit;
}
?>