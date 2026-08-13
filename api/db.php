<?php
$host = 'localhost';
$dbname = 'suvarna_db';
$username = 'root'; // Default XAMPP username
$password = ''; // Default XAMPP password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Ensure charset is utf8mb4
    $pdo->exec("SET NAMES utf8mb4");
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}
?>
