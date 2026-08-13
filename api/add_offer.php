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
    $title = $_POST['title'] ?? '';
    $type = $_POST['type'] ?? '';
    $description = $_POST['description'] ?? '';
    $price_basic = $_POST['price_basic'] ?? '';
    $price_advanced = $_POST['price_advanced'] ?? '';
    $price_premium = $_POST['price_premium'] ?? '';
    $imagePath = '';

    if (empty($title) || empty($type) || empty($description) || empty($price_basic) || empty($price_advanced) || empty($price_premium)) {
        echo json_encode(['success' => false, 'message' => 'All text fields are required.']);
        exit;
    }
    
    // Handle Image Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        // Ensure upload directory exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFilePath = $uploadDir . $fileName;
        
        // Allow certain file formats
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
                $imagePath = 'uploads/' . $fileName; // Path to store in DB
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
        $stmt = $pdo->prepare('INSERT INTO offers (title, type, description, price_basic, price_advanced, price_premium, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$title, $type, $description, $price_basic, $price_advanced, $price_premium, $imagePath]);
        
        echo json_encode(['success' => true, 'message' => 'Offer added successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
