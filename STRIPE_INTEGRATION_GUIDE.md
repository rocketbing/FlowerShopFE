# Stripe 支付集成指南

## 回答你的问题

**Stripe 不会直接"返回"一个支付界面**，但有两种方式：

### 方式一：Stripe Checkout（推荐，最简单）✅
- **后端**：创建 Checkout Session，返回一个 URL
- **前端**：跳转到这个 URL，**Stripe 会显示一个完整的支付页面**
- **优点**：简单、安全、无需处理支付表单
- **流程**：
  1. 用户点击"支付"按钮
  2. 前端调用后端 API：`POST /api/payments/create-checkout-session`
  3. 后端返回：`{ url: "https://checkout.stripe.com/..." }`
  4. 前端跳转：`window.location.href = url`
  5. **用户看到 Stripe 的支付页面**（这是 Stripe 托管的）
  6. 支付完成后，Stripe 自动跳回你的网站

### 方式二：Stripe Elements（嵌入式）
- **后端**：创建 Payment Intent，返回 `clientSecret`
- **前端**：使用 Stripe Elements 组件**自己渲染支付表单**
- **优点**：完全自定义 UI
- **缺点**：需要自己处理表单、验证等

---

## 后端实现（Node.js/Express 示例）

### 1. 安装 Stripe
```bash
npm install stripe
```

### 2. 创建 Checkout Session API

```javascript
// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 创建 Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, userId, orderId } = req.body;
    
    // 将购物车商品转换为 Stripe 格式
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name || item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.discountedPrice || item.regularPrice) * 100), // 转换为分
      },
      quantity: item.cartQuantity,
    }));

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user?.email, // 如果有用户信息
      metadata: {
        userId: userId,
        orderId: orderId,
      },
    });

    // 返回 URL，前端会跳转到这里
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook 处理支付成功事件
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理支付成功
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // 更新订单状态
    // await updateOrderStatus(session.metadata.orderId, 'paid');
  }

  res.json({ received: true });
});

module.exports = router;
```

---

## 前端实现（React 示例）

### 1. 在 Cart.jsx 中添加支付按钮

```jsx
// src/views/Cart.jsx
import { useState } from 'react';
import { Button, message } from 'antd';
import { req } from '../utils/request';
import { clearCart } from '../store/cart';

export default function Cart() {
    const dispatch = useAppDispatch();
    const { items, total } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);

    const subtotal = parseFloat(total || 0);
    const tax = subtotal * 0.13;
    const totalWithTax = subtotal + tax;

    // 处理支付
    const handleCheckout = async () => {
        if (items.length === 0) {
            message.warning('Your cart is empty');
            return;
        }

        setLoading(true);
        try {
            // 调用后端 API 创建 Checkout Session
            const response = await req('/api/payments/create-checkout-session', 'POST', {
                items: items,
                userId: user?.id,
                orderId: `order_${Date.now()}`,
            });

            // 跳转到 Stripe 支付页面
            window.location.href = response.url;
        } catch (error) {
            message.error('Failed to create checkout session');
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ... 购物车表格 ... */}
            
            <div style={{ marginTop: "40px", padding: "20px" }}>
                <Row justify="end">
                    <Col span={8}>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            {/* ... 价格显示 ... */}
                            
                            {/* 支付按钮 */}
                            <Button 
                                type="primary" 
                                size="large"
                                onClick={handleCheckout}
                                loading={loading}
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                Proceed to Checkout
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
```

### 2. 创建支付成功页面

```jsx
// src/views/PaymentSuccess.jsx
import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/cart';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // 清空购物车
        dispatch(clearCart());
        
        // 可以在这里验证支付状态
        if (sessionId) {
            // 可选：调用后端 API 验证 session_id
            // await verifyPayment(sessionId);
        }
    }, [sessionId, dispatch]);

    return (
        <Result
            status="success"
            title="Payment Successful!"
            subTitle={`Your order has been placed successfully.${sessionId ? ` Order ID: ${sessionId}` : ''}`}
            extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                    Return to Home
                </Button>,
                <Button key="orders" onClick={() => navigate('/account')}>
                    View Orders
                </Button>,
            ]}
        />
    );
}
```

### 3. 添加路由

```jsx
// src/router/index.jsx
import PaymentSuccess from '../views/PaymentSuccess';

// 在 Routes 中添加
<Route path="/payment-success" element={<PaymentSuccess />} />
```

---

## 环境变量配置

### 后端 (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

### 前端 (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 完整流程

1. ✅ 用户点击 "Proceed to Checkout"
2. ✅ 前端调用后端：`POST /api/payments/create-checkout-session`
3. ✅ 后端创建 Stripe Checkout Session，返回 URL
4. ✅ 前端跳转：`window.location.href = url`
5. ✅ **用户看到 Stripe 的支付页面**（Stripe 托管）
6. ✅ 用户输入卡号等信息并支付
7. ✅ Stripe 处理支付
8. ✅ 支付成功后，Stripe 跳转到：`/payment-success?session_id=...`
9. ✅ 后端通过 Webhook 收到支付成功通知
10. ✅ 后端更新订单状态

---

## Stripe 账号注册和设置

### 1. 注册 Stripe 账号

**是的，你需要先注册 Stripe 账号！**

访问：https://stripe.com/ 点击 "Start now" 或 "Sign up"

### 2. 注册步骤

1. **填写基本信息**
   - 邮箱地址
   - 密码
   - 国家/地区（选择 Canada，因为你的税是 13%）

2. **激活账号**
   - 检查邮箱，点击验证链接

3. **完成账户设置**
   - 填写业务信息（可以先用测试数据）
   - 选择业务类型
   - 填写地址等信息

### 3. 获取 API Keys

注册完成后，进入 Dashboard：

1. **进入 Dashboard**
   - 登录后访问：https://dashboard.stripe.com/

2. **切换到测试模式（Test Mode）**
   - 右上角有 "Test mode" 开关，确保开启（用于开发测试）

3. **获取 API Keys**
   - 点击左侧菜单 "Developers" → "API keys"
   - 你会看到：
     - **Publishable key** (pk_test_...) - 前端使用
     - **Secret key** (sk_test_...) - 后端使用（点击 "Reveal test key" 显示）

4. **获取 Webhook Secret**（稍后设置）
   - 点击 "Developers" → "Webhooks"
   - 添加 webhook endpoint
   - 复制 "Signing secret" (whsec_...)

### 4. 测试卡号

在测试模式下，可以使用以下测试卡号：

| 卡号 | 用途 |
|------|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0025 0000 3155` | 需要 3D Secure 验证 |
| `4000 0000 0000 0002` | 支付失败 |
| `4000 0000 0000 9995` | 余额不足 |

- **过期日期**：任意未来日期（如 12/25）
- **CVC**：任意 3 位数字（如 123）
- **ZIP**：任意 5 位数字（如 12345）

### 5. 环境变量设置

#### 后端 (.env)
```env
# Stripe API Keys（测试环境）
STRIPE_SECRET_KEY=sk_test_51...（从 Dashboard 复制）
STRIPE_WEBHOOK_SECRET=whsec_...（设置 webhook 后获取）
FRONTEND_URL=http://localhost:3000
```

#### 前端 (.env)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51...（从 Dashboard 复制）
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 6. 切换到生产环境

**开发完成后**，需要：

1. **完成账户验证**
   - 在 Dashboard 中完成身份验证
   - 添加银行账户信息
   - 完成税务信息

2. **切换到 Live Mode**
   - 右上角切换 "Test mode" → "Live mode"
   - 获取生产环境的 API keys（pk_live_... 和 sk_live_...）

3. **更新环境变量**
   - 将测试 keys 替换为生产 keys

### 7. 重要注意事项

⚠️ **安全提示**：
- ❌ **永远不要**将 Secret key 暴露在前端代码中
- ✅ Secret key 只放在后端
- ✅ 使用环境变量存储 keys
- ✅ 不要将 keys 提交到 Git（添加到 .gitignore）

⚠️ **测试 vs 生产**：
- 测试模式：使用 `pk_test_` 和 `sk_test_`，不会产生真实交易
- 生产模式：使用 `pk_live_` 和 `sk_live_`，会产生真实交易和费用

---

## 总结

**回答你的问题**：
- ✅ **是的，需要提前注册 Stripe 账号**
- ✅ 注册后获取 API keys
- ✅ 开发时使用测试模式（Test mode）
- ✅ 上线前切换到生产模式（Live mode）

**推荐使用 Stripe Checkout**，因为：
- 最简单
- 最安全（PCI 合规由 Stripe 处理）
- 无需处理支付表单
- 支持多种支付方式

