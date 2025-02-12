<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>订单列表 | Shop</title>
    <link rel="stylesheet" href="styles.css">
    <script type="module" defer src="orders.js"></script>
</head>
<body>
    <h1>订单列表</h1>
    <table border="1">
        <thead>
            <tr>
                <th>订单号</th>
                <th>客户姓名</th>
                <th>客户邮箱</th>
                <th>电话</th>
                <th>地址</th>
                <th>订单时间</th>
                <th>总价</th>
                <th>商品详情</th>
            </tr>
        </thead>
        <tbody id="orders-table-body">
            <!-- 订单数据会在这里动态插入 -->
        </tbody>
    </table>
</body>
</html>
