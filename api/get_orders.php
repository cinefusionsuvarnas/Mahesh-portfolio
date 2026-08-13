<?php
require 'db.php';
header('Content-Type: application/json');

try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $limit = 6;
    $offset = ($page - 1) * $limit;

    $whereClause = "";
    $params = [];
    
    if ($search !== '') {
        $whereClause = "WHERE customer_name LIKE ? OR customer_email LIKE ? OR transaction_id LIKE ?";
        $searchParam = "%$search%";
        $params = [$searchParam, $searchParam, $searchParam];
    }

    // Get total count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM orders $whereClause");
    $countStmt->execute($params);
    $totalOrders = $countStmt->fetchColumn();
    $totalPages = ceil($totalOrders / $limit);

    // Get paginated orders
    $stmt = $pdo->prepare("SELECT * FROM orders $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
    // Bind parameters for the where clause
    $paramIndex = 1;
    if ($search !== '') {
        $stmt->bindValue($paramIndex++, $searchParam, PDO::PARAM_STR);
        $stmt->bindValue($paramIndex++, $searchParam, PDO::PARAM_STR);
        $stmt->bindValue($paramIndex++, $searchParam, PDO::PARAM_STR);
    }
    
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode items_json for each order to make it easier to consume on the frontend
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items_json'], true);
        unset($order['items_json']);
    }

    echo json_encode([
        'success' => true, 
        'orders' => $orders,
        'currentPage' => $page,
        'totalPages' => $totalPages,
        'totalOrders' => $totalOrders
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
