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
    $title = $_POST['title'] ?? '';
    $type = $_POST['type'] ?? '';
    $description = $_POST['description'] ?? '';
    $price_basic = $_POST['price_basic'] ?? '';
    $price_advanced = $_POST['price_advanced'] ?? '';
    $price_premium = $_POST['price_premium'] ?? '';
    $imagePath = null; // null means don't update

    if (empty($id) || empty($title) || empty($type) || empty($description) || empty($price_basic) || empty($price_advanced) || empty($price_premium)) {
        echo json_encode(['success' => false, 'message' => 'All text fields are required.']);
        exit;
    }
    
    // Handle Image Upload if a new image was provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFilePath = $uploadDir . $fileName;
        
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
                $imagePath = 'uploads/' . $fileName;
                
                // Optionally, we could delete the old image here by fetching it first
                $stmt = $pdo->prepare('SELECT image_path FROM offers WHERE id = ?');
                $stmt->execute([$id]);
                $oldOffer = $stmt->fetch();
                if ($oldOffer && $oldOffer['image_path'] && file_exists('../' . $oldOffer['image_path'])) {
                    unlink('../' . $oldOffer['image_path']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
                exit;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid file format. Only JPG, PNG, WEBP, and GIF are allowed.']);
            exit;
        }
    }

    try {
        if ($imagePath !== null) {
            $stmt = $pdo->prepare('UPDATE offers SET title = ?, type = ?, description = ?, price_basic = ?, price_advanced = ?, price_premium = ?, image_path = ? WHERE id = ?');
            $stmt->execute([$title, $type, $description, $price_basic, $price_advanced, $price_premium, $imagePath, $id]);
        } else {
            $stmt = $pdo->prepare('UPDATE offers SET title = ?, type = ?, description = ?, price_basic = ?, price_advanced = ?, price_premium = ? WHERE id = ?');
            $stmt->execute([$title, $type, $description, $price_basic, $price_advanced, $price_premium, $id]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Offer updated successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
