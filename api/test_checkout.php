 Need your footage
brought to life?
<?php
require 'db.php';
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = [
    'customer_name' => 'Test User',
    'customer_email' => 'test@test.com',
    'customer_phone' => '1234567890',
    'transaction_id' => 'tx123',
    'items_json' => '[{"name":"Cinema Deck - Premium Pack","price":99,"image":""}]',
    'total_amount' => 99.00
];
require 'checkout.php';
?>
