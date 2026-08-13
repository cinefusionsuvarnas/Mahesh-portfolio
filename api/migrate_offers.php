<?php
require_once 'db.php';

try {
    // Rename price to price_basic
    $sql1 = "ALTER TABLE offers CHANGE COLUMN price price_basic DECIMAL(10,2) NOT NULL DEFAULT 0.00";
    $pdo->exec($sql1);
    
    // Add price_advanced
    $sql2 = "ALTER TABLE offers ADD COLUMN price_advanced DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price_basic";
    $pdo->exec($sql2);
    
    // Add price_premium
    $sql3 = "ALTER TABLE offers ADD COLUMN price_premium DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER price_advanced";
    $pdo->exec($sql3);

    echo "Migration completed successfully.\n";
} catch(PDOException $e) {
    echo "Error during migration: " . $e->getMessage() . "\n";
}
?>
