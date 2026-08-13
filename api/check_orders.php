<?php
require 'db.php';
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'orders'");
    if ($stmt->rowCount() > 0) {
        echo "Table orders exists.\n";
        $stmt2 = $pdo->query("DESCRIBE orders");
        print_r($stmt2->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo "Table orders does NOT exist.\n";
        // Create it just in case
        $sql = "CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(50) NOT NULL,
            transaction_id VARCHAR(255) NOT NULL,
            items_json TEXT NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $pdo->exec($sql);
        echo "Created orders table.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
