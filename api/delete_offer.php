<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';

    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'Offer ID is required.']);
        exit;
    }

    try {
        // Fetch the image path so we can delete the file
        $stmt = $pdo->prepare('SELECT image_path FROM offers WHERE id = ?');
        $stmt->execute([$id]);
        $offer = $stmt->fetch();
        
        $stmt = $pdo->prepare('DELETE FROM offers WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            // Delete the image file if it exists
            if ($offer && $offer['image_path'] && file_exists('../' . $offer['image_path'])) {
                unlink('../' . $offer['image_path']);
            }
            
            echo json_encode(['success' => true, 'message' => 'Offer deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Offer not found.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
