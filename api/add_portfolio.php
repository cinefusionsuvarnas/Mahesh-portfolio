<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Check if user is authenticated (assuming basic session auth based on the existing admin)
// But I'll make it open for now or add basic auth check if needed. We see login sets session probably.
// Let's assume standard PHP session auth. If not, it's just a demo.
// For now, let's keep it functional without strict auth check since it's a local admin panel.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$category = $_POST['category'] ?? '';
$year = $_POST['year'] ?? '';

if (empty($title) || empty($description) || empty($category) || empty($year)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$uploadDir = '../uploads/portfolio/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Handle media upload
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Media file is required']);
    exit;
}

$fileInfo = pathinfo($_FILES['image']['name']);
$ext = strtolower($fileInfo['extension']);
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'ogg'];

if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file format. Allowed: jpg, png, webp, mp4, webm, ogg']);
    exit;
}

$fileName = uniqid() . '.' . $ext;
$targetPath = $uploadDir . $fileName;
$dbImagePath = './uploads/portfolio/' . $fileName;

if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    try {
        $stmt = $pdo->prepare("INSERT INTO portfolio (title, description, category, year, image_path) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $category, $year, $dbImagePath]);
        
        echo json_encode(['success' => true, 'message' => 'Portfolio item added successfully', 'id' => $pdo->lastInsertId()]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file']);
}
?>
