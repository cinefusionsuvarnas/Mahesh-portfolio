<?php
require 'api/db.php';

$password = 'password123';
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'");
    $stmt->execute([$hash]);
    
    if ($stmt->rowCount() > 0) {
        echo "<h1>Success!</h1>";
        echo "<p>The password for the 'admin' user has been successfully reset to: <strong>password123</strong></p>";
    } else {
        // If the admin user doesn't exist yet, insert it
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash) VALUES ('admin', ?)");
        $stmt->execute([$hash]);
        echo "<h1>Success!</h1>";
        echo "<p>The 'admin' user was created with password: <strong>password123</strong></p>";
    }
    
    echo '<p><a href="pages/admin.html">Go to Admin Login</a></p>';
    
    // Optionally delete this file after it runs for security
    // unlink(__FILE__);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
