<?php
header('Content-Type: application/json');

$response = [
    'success' => false,
    'errors'  => []
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['errors'][] = "Неверный метод запроса.";
    echo json_encode($response);
    exit;
}

$name            = trim($_POST['name'] ?? '');
$email           = trim($_POST['email'] ?? '');
$password        = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$country         = trim($_POST['country'] ?? '');
$terms           = $_POST['terms'] ?? '';

if (empty($name) || empty($email) || empty($password) || empty($confirmPassword) || empty($country) || empty($terms)) {
    $response['errors'][] = "Пожалуйста, заполните все обязательные поля.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['errors'][] = "Некорректный формат email.";
}

if ($password !== $confirmPassword) {
    $response['errors'][] = "Пароли не совпадают.";
}

if (count($response['errors']) > 0) {
    echo json_encode($response);
    exit;
}

$newUser = [
    'name'          => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email'         => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
    'password'      => password_hash($password, PASSWORD_DEFAULT),
    'country'       => htmlspecialchars($country, ENT_QUOTES, 'UTF-8'),
    'registered_at' => date('Y-m-d H:i:s')
];

$file = 'users.json';

if (file_exists($file)) {
    $jsonData = file_get_contents($file);
    $users = json_decode($jsonData, true);
    if (!is_array($users)) {
        $users = [];
    }
} else {
    $users = [];
}

$users[] = $newUser;

if (file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT))) {
    $response['success'] = true;
    $response['message'] = "Регистрация прошла успешно!";
} else {
    $response['errors'][] = "Ошибка при сохранении данных. Попробуйте позже.";
}

echo json_encode($response);
?>
