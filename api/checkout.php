<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$customer_name = $_POST['customer_name'] ?? '';
$customer_email = $_POST['customer_email'] ?? '';
$customer_phone = $_POST['customer_phone'] ?? '';
$transaction_id = $_POST['transaction_id'] ?? '';
$items_json = $_POST['items_json'] ?? '[]';
$total_amount = $_POST['total_amount'] ?? 0;

if (empty($customer_name) || empty($customer_email) || empty($customer_phone) || empty($transaction_id) || $total_amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid fields.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (customer_name, customer_email, customer_phone, transaction_id, items_json, total_amount) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$customer_name, $customer_email, $customer_phone, $transaction_id, $items_json, $total_amount]);
    
    // Send email notification to Admin using PHPMailer
    require 'PHPMailer/Exception.php';
    require 'PHPMailer/PHPMailer.php';
    require 'PHPMailer/SMTP.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';                     // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'harshahhv9@gmail.com';                 // SMTP username
        $mail->Password   = 'YOUR_GMAIL_APP_PASSWORD';              // SMTP app password
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
        $mail->Port       = 587;                                    // TCP port to connect to

        // Recipients
        $mail->setFrom('harshahhv9@gmail.com', 'Suvarna Cinefusion'); // Sender's email
        $mail->addAddress('harshahhv9@gmail.com');                    // Add admin email

        // Decode items for readable format
        $items = json_decode($items_json, true);
        $items_list = "";
        if (is_array($items)) {
            foreach ($items as $item) {
                $items_list .= "- " . ($item['name'] ?? 'Unknown Item') . " (₹" . ($item['price'] ?? 0) . ")<br>";
            }
        } else {
            $items_list = "Could not parse items.";
        }

        $message = "<h3>A new purchase has been made.</h3>" .
                   "<strong>Customer Details:</strong><br>" .
                   "Name: $customer_name<br>" .
                   "Email: $customer_email<br>" .
                   "Phone: $customer_phone<br><br>" .
                   "<strong>Order Details:</strong><br>" .
                   "Transaction ID: $transaction_id<br>" .
                   "Total Amount: ₹$total_amount<br><br>" .
                   "<strong>Items Purchased:</strong><br>$items_list<br><br>" .
                   "Please check the admin panel for more details.";

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Purchase Received - Transaction ID: $transaction_id";
        $mail->Body    = $message;
        $mail->AltBody = strip_tags(str_replace("<br>", "\n", $message));

        $mail->send();
    } catch (Exception $e) {
        // Uncomment the line below to debug email sending errors, but usually we just want the order to complete
        // error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }
    
    echo json_encode(['success' => true, 'message' => 'Order submitted successfully.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
