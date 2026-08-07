# 15 — Hạn chế và hướng phát triển

Mọi con số trong tài liệu này lấy từ việc **quét code thật**, không phải
ước lượng. Lệnh kiểm chứng ghi kèm để bạn tự chạy lại.

---

# PHẦN 1 — HẠN CHẾ

## 1.1 Bảo mật — nghiêm trọng nhất

### A. Phân quyền admin hoàn toàn nằm ở client

Đây là hạn chế **lớn nhất** của hệ thống. Chuỗi bằng chứng:

```js
// App.jsx:65 — trạng thái admin đọc từ localStorage
const [admin, setAdmin] = useState(
  JSON.parse(localStorage.getItem("admin"))
);

// AdminProtectedRoute.jsx — cổng duy nhất
if (!admin || admin.role !== "admin") {
  return <Navigate to="/admin/login" />;
}

// adminRoutes.js — KHÔNG cấp token
return res.json({
  admin: { name: "Admin", email, role: "admin" }
});
```

Backend **không trả JWT** cho admin. Nên "đăng nhập admin" thực chất chỉ
là ghi một object vào `localStorage`.

**Hệ quả:** mở DevTools Console trên trang khách, gõ:

```js
localStorage.setItem("admin", JSON.stringify({ role: "admin" }))
```

F5 → vào thẳng `/admin/dashboard` với toàn quyền.

### B. Tài khoản admin viết cứng trong source

```js
// backend/routes/adminRoutes.js
if (email === "admin@gmail.com" && password === "123456") {
```

Mật khẩu nằm trong mã nguồn, không hash, không đổi được, không có
tài khoản admin thứ hai.

### C. 8/12 file route không có xác thực nào

```
adminRoutes.js       | 1 route | auth: 0
aiRoutes.js          | 2 route | auth: 0
historyRoutes.js     | 1 route | auth: 0
inventoryRoutes.js   | 8 route | auth: 0   ← toàn bộ kho
paymentRoutes.js     | 1 route | auth: 0
productRoutes.js     | 5 route | auth: 0   ← toàn bộ menu
promotionRoutes.js   | 1 route | auth: 0
uploadRoutes.js      | 1 route | auth: 0
─────────────────────────────────────────
authRoutes.js        | 4 route | auth: 2
orderRoutes.js       | 4 route | auth: 2
reviewRoutes.js      | 2 route | auth: 2
rewardRoutes.js      | 2 route | auth: 2
```

Kiểm lại:

```bash
cd backend; for f in routes/*.js; do echo "$(basename $f) | $(grep -cE 'router\.(get|post|put|delete)' $f) route | auth: $(grep -c authMiddleware $f)"; done
```

**Nghĩa là kể cả không cần bypass localStorage, ai biết URL cũng gọi
được API trực tiếp:**

```
DELETE http://localhost:5000/api/products/<id>     ← xoá món khỏi menu
DELETE http://localhost:5000/api/inventory/<id>    ← xoá nguyên liệu
POST   http://localhost:5000/api/products          ← thêm món giá 0₫
PUT    http://localhost:5000/api/inventory/<id>    ← sửa tồn kho
```

Không cần token, không cần đăng nhập.

### D. Rò rỉ thông tin nhỏ hơn

| Vấn đề | Ở đâu |
|---|---|
| Trả về cả `password` (hash bcrypt) trong response | `authRoutes.js` 71, 206, 298 |
| "User not found" cho biết email nào tồn tại | `authRoutes.js:173` |
| `res.status(500).json(err)` trả `{}` — client không biết lỗi gì | `inventoryRoutes.js` (7 chỗ) |
| Không kiểm `payload.email_verified` của Google | `authRoutes.js:234` |
| `mimetype` do client gửi, có thể giả | `uploadRoutes.js:45` |

### E. Thanh toán là hàm giả

```js
// backend/routes/paymentRoutes.js — TOÀN BỘ file
router.post("/momo", async (req, res) => {
  res.json({ success: true, message: "Payment Success" });
});
```

Không tích hợp cổng thanh toán nào. Luôn trả thành công, không nhận
tiền, không kiểm tra gì. Đơn hàng được tạo mà không có giao dịch thật.

Với đồ án thì chấp nhận được — **nhưng phải nói rõ trong báo cáo**, đừng
để người đọc tưởng đã tích hợp MoMo.

---

## 1.2 Bug còn tồn tại

Đây là những lỗi tui tìm ra khi đọc code nhưng **chưa sửa** (nằm ngoài
phạm vi việc được giao).

### Nghiêm trọng — sẽ gặp khi dùng thật

**Import Excel không cập nhật trạng thái tồn kho** —
`inventoryRoutes.js:128` và `:169`

```js
// nhánh nguyên liệu đã có: thiếu deriveStatus
exist.stock += Number(row.stock);
await exist.save();                    // status giữ nguyên giá trị cũ

// nhánh nguyên liệu mới: viết cứng
status: "Available"                    // dù stock = 0
```

Nguyên liệu đang "Out of Stock", nhập 100 kg qua Excel → số lượng đúng
nhưng trạng thái **vẫn** "Out of Stock". Hoặc nhập món `stock: 0` mà
hiện "Available".

**`NaN` lọt qua kiểm tra số lượng** — `inventoryRoutes.js:370` và `:432`

```js
const stock = Number(req.body.stock);
if (stock <= 0) { ... }        // NaN <= 0 là FALSE → lọt
item.stock += stock;           // stock thành NaN, lưu vào DB
```

Nhập `"abc"` → `item.stock` thành `NaN` **vĩnh viễn**. Mọi phép tính sau
đó đều `NaN`, nguyên liệu đó hỏng không sửa được qua UI.

Sửa: `if (!Number.isFinite(stock) || stock <= 0)`.

### Trung bình

| Bug | Ở đâu | Hệ quả |
|---|---|---|
| Viết review không cập nhật `Product.rating` | `reviewRoutes.js:155` | Thẻ ở Menu vẫn số cũ tới lần chạy `seedReviews.js` |
| `PUT`/`DELETE` kho không ghi nhật ký | `inventoryRoutes.js` 252, 315 | Tồn kho đổi mà `StockHistory` không có dòng nào |
| Import Excel không có transaction | `inventoryRoutes.js:189` | Lỗi hàng 50 → 49 hàng đầu đã ghi, không rollback được |
| File Excel tạm không bị xoá | `inventoryRoutes.js:117` | Rác tích tụ trong `uploads/` |
| Multer ở inventory không giới hạn dung lượng/định dạng | `inventoryRoutes.js:10` | Ai cũng upload file 2 GB |
| `toISOString()` dùng giờ UTC | `Reports.jsx:133` | Đơn sau 17h (giờ VN) bị tính vào ngày hôm trước |
| Comment nói "REMOVE LOW SCORE" nhưng không filter | `recommendationEngine.js:287` | Món 0 điểm vẫn được gợi ý với lý do bịa |
| Search không bỏ dấu tiếng Việt | `MenuManagement.jsx:97`, `Inventory.jsx:198` | Gõ "ca phe" ra danh sách rỗng |
| `historyRoutes.js` là code chết | cả file | Trùng `/api/inventory/history/all` |
| `setProducts` truyền vào nhưng không dùng | `useProductForm.js:36` | Gây hiểu lầm khi đọc |
| Modal không đóng bằng Esc, không khoá cuộn nền | `PromotionDetailModal.jsx` | Khai `aria-modal` nhưng không đúng hành vi |

---

## 1.3 Toàn vẹn dữ liệu

### `seeder.js` phá vỡ mọi tham chiếu

Đây là hạn chế kiến trúc, không phải bug — nhưng gây hậu quả thật và
**đã xảy ra**.

`seeder.js` xoá sạch collection `Product` rồi tạo lại → MongoDB sinh
`_id` **mới** cho toàn bộ 34 món. Mọi thứ trỏ tới sản phẩm bằng id đều
đứt:

| Bị ảnh hưởng | Hậu quả |
|---|---|
| `Review.productId` | 124 review thành mồ côi, trang sản phẩm hiện 0 đánh giá |
| `Order.items[].productId` | Đơn cũ mất liên kết sản phẩm |
| `User.favorites` | Danh sách yêu thích trỏ vào id không tồn tại |

Đã đo được lúc chẩn đoán:

```
Review trong DB:                     124
productId khác nhau:                  35
productId KHÔNG khớp sản phẩm nào:    35   ← tất cả
```

**Cách né hiện tại:** luôn chạy 2 lệnh liền nhau.

```bash
cd backend; node seeder.js; node seedReviews.js
```

**Cách sửa gốc:** cho `seeder.js` dùng `_id` cố định thay vì để Mongo tự
sinh, hoặc dùng `upsert` theo `name` thay vì `deleteMany` + `insertMany`.

### Không có ràng buộc khoá ngoại

MongoDB không có foreign key. App cũng không tự kiểm. Nên xoá sản phẩm
đang nằm trong đơn hàng là chuyện bình thường, và không có gì báo.

### Xoá vĩnh viễn, không có thùng rác

`findByIdAndDelete` ở `productRoutes.js:59` và `inventoryRoutes.js:319`.
Không có soft delete (`deletedAt`), không khôi phục được.

---

## 1.4 Không deploy được ở trạng thái hiện tại

### 33 chỗ viết cứng `localhost:5000`

```bash
cd frontend/src; grep -rn "localhost:5000" --include=*.jsx --include=*.js . | wc -l
# → 33
```

Cộng thêm 1 chỗ ở backend (`uploadRoutes.js:101`) sinh URL ảnh.

Deploy lên server thật là **toàn bộ 34 chỗ này trỏ về máy của khách**.

### Google client ID viết cứng

`main.jsx:11`. Không phải bí mật, nhưng không đổi được theo môi trường.

### Không có `.gitignore` ở thư mục gốc

```
KHONG CO .gitignore o goc
--- backend/.gitignore ---
node_modules
.env
backend/.env
```

`backend/.gitignore` có che `.env` (tốt — đã kiểm, `.env` **chưa** bị
commit). Nhưng gốc repo không có file nào, và `frontend/node_modules`
chỉ chưa bị commit nhờ may mắn.

Thiếu cả: `uploads/` — ảnh khách upload sẽ bị commit vào git.

### 89 file chưa commit

```bash
git status --porcelain | wc -l
# → 89
```

Toàn bộ công việc của phiên này đang nằm ở working directory. Máy hỏng
là mất hết.

---

## 1.5 Kiến trúc và khả năng mở rộng

### Prop drilling — không có Redux/Context

Mọi state ở `App.jsx` (526 dòng) và truyền xuống bằng prop. Thêm một
state mới phải sửa 4–5 file trung gian.

Với quy mô hiện tại thì chấp nhận được. Nhưng `Checkout.jsx` đã **1.311
dòng** — đó là dấu hiệu.

### Ba kiểu gọi API cùng tồn tại

| Kiểu | Ví dụ |
|---|---|
| `fetch` trong `useEffect` của component | `PromoBanner.jsx:49` |
| `fetch` trong custom hook | `useLiveOrders.js:51` |
| Nhận qua prop từ `App.jsx` | `Reports.jsx` |

`axios` có trong `package.json` nhưng phần lớn code dùng `fetch`. Không
có lớp API tập trung, nên logic lặp: mỗi chỗ tự đọc token, tự kiểm
`response.ok`, tự bắt lỗi.

### Không phân trang ở tầng API

`GET /api/products` và `GET /api/orders` trả **toàn bộ** collection.
34 sản phẩm thì không sao; 10.000 đơn thì response vài MB mỗi 15 giây
(nhịp polling của `useLiveOrders`).

### Polling thay vì realtime

`useLiveOrders` gọi lại mỗi 15 giây. Đơn giản và chạy được, nhưng:
- Trễ tối đa 15 giây
- Gọi API cả khi không có gì thay đổi
- Nhiều admin mở cùng lúc thì nhân số request lên

WebSocket (`socket.io`) là giải pháp đúng cho bài toán này.

### Kho không nối với menu

`models/Recipe.js` tồn tại nhưng **không route nào dùng**. Nghĩa là bán
một ly cà phê **không trừ** nguyên liệu trong kho. Hai module chạy song
song, không biết nhau.

---

## 1.6 Không có kiểm thử

```
frontend scripts: { "dev", "build", "preview" }
backend  scripts: { "test": "echo \"Error: no test specified\" && exit 1", ... }
```

Không unit test, không integration test, không E2E. Mọi lần sửa đều phải
thử tay.

Điều này giải thích vì sao nhiều bug trong project thuộc loại **im
lặng**: `qty` vs `quantity`, Mongoose bỏ field không khai báo, `fetch`
không ném lỗi khi 4xx. Một bộ test tối thiểu sẽ bắt được hết.

---

## 1.7 Tiếp cận và trải nghiệm

| Thiếu | Ảnh hưởng |
|---|---|
| Modal không đóng bằng Esc | Người dùng bàn phím bị kẹt |
| Không khoá cuộn trang nền khi modal mở | Trên điện thoại vuốt bị lẫn |
| Không có focus trap trong modal | Tab đi ra ngoài modal |
| Nhiều `console.log` còn sót | Console bẩn, che log lỗi thật |
| Thông báo lỗi lẫn Anh–Việt | Không nhất quán |
| Không có trạng thái loading ở vài chỗ | Bấm rồi không biết có chạy không |

---

# PHẦN 2 — HƯỚNG PHÁT TRIỂN

Sắp theo **thứ tự nên làm**, không phải theo độ hay ho.

## 2.1 Trước khi demo (1–2 giờ)

### Commit code

```bash
git add -A
git commit -m "Hoàn thiện tính năng: rewards, reviews, reports, AI"
```

89 file đang chưa lưu. Đây là việc quan trọng nhất trong danh sách.

### Tạo `.gitignore` ở gốc

```
node_modules/
.env
.env.*
uploads/
dist/
.vite/
```

### Sửa 2 bug import Excel

`inventoryRoutes.js:128` thêm `exist.status = deriveStatus(exist);`
`inventoryRoutes.js:169` đổi `status: "Available"` thành
`status: deriveStatus({ stock: Number(row.stock), minStock: Number(row.minStock) })`

Đây là 2 dòng, và là bug **dễ bị bắt gặp nhất khi demo** phần kho.

### Chặn `NaN`

`inventoryRoutes.js:370` và `:432`:

```js
if (!Number.isFinite(stock) || stock <= 0) {
```

### Bỏ dấu tiếng Việt cho ô search

Tạo `frontend/src/utils/search.js` với hàm `deaccent` (copy từ
`aiController.js:190`) rồi dùng ở `MenuManagement.jsx:97`,
`Inventory.jsx:198`, `Checkout.jsx:1036`.

Khoảng 15 phút, và tránh được cảnh gõ "ca phe" ra màn hình trống trước
mặt thầy.

---

## 2.2 Ưu tiên cao — bảo mật (1–2 ngày)

Đây là phần đáng viết nhất trong "hướng phát triển" của báo cáo, vì nó
là hạn chế lớn nhất và có giải pháp rõ ràng.

### Bước 1 — Admin dùng JWT thật

Bỏ `adminRoutes.js` viết cứng. Tạo user có `role: "admin"` trong DB
(mật khẩu hash bcrypt), rồi dùng chính `POST /api/auth/login`.

### Bước 2 — Middleware `adminOnly`

```js
// backend/middleware/adminOnly.js
module.exports = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
```

### Bước 3 — Gắn vào các route ghi dữ liệu

```js
// productRoutes.js
router.get("/", ...);                                    // công khai
router.post("/",   auth, adminOnly, ...);                // ← thêm
router.put("/:id", auth, adminOnly, ...);                // ← thêm
router.delete("/:id", auth, adminOnly, ...);             // ← thêm

// inventoryRoutes.js — cả 8 route
```

### Bước 4 — Ẩn `password` khỏi response

```js
res.json({ user: { ...user.toObject(), password: undefined } });
```

Sau 4 bước này, `AdminProtectedRoute` ở frontend trở thành **tiện ích
UX** (chuyển hướng cho gọn) thay vì **cổng bảo mật** — đúng vai trò của
nó. Bảo mật thật nằm ở server.

---

## 2.3 Ưu tiên trung bình

### Nối kho với menu qua `Recipe`

Đây là tính năng **có giá trị nhất chưa làm**, và mô hình đã có sẵn.

```js
// khi tạo đơn, trong orderRoutes
for (const item of order.items) {
  const recipe = await Recipe.findOne({ productName: item.name });
  if (!recipe) continue;

  for (const ing of recipe.ingredients) {
    await Inventory.findOneAndUpdate(
      { name: ing.ingredientName },
      { $inc: { stock: -ing.quantity * item.quantity } }
    );
  }
}
```

Cần giải quyết thêm: quy đổi đơn vị (công thức tính bằng g, kho lưu kg),
và xử lý khi thiếu nguyên liệu (chặn đơn hay cho đặt rồi báo?).

Khi có cái này, `Inventory` mới thật sự là hệ thống kho thay vì bảng ghi
tay.

### Biến `localhost:5000` thành biến môi trường

```js
// frontend/.env
VITE_API_URL=http://localhost:5000

// frontend/src/utils/api.js
export const API = import.meta.env.VITE_API_URL;
```

Rồi thay 33 chỗ. Đây là điều kiện **bắt buộc** để deploy.

### Lớp API tập trung

```js
// frontend/src/utils/api.js
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

  return data;
}
```

Giải quyết một lượt: quên `response.ok`, quên header token, quên
`Content-Type`, và gom `localhost` về một chỗ. Ba trong số này đã từng
gây bug thật.

### Đồng bộ `Product.rating` khi có review mới

Thêm vào cuối `reviewRoutes.js` POST — xem [doc 14](14-BAY-CHU-DE-HAY-BI-HOI.md#6--review-và-rating-từ-đâu-ra).

### Ghi nhật ký khi sửa kho bằng tay

`inventoryRoutes.js` route `PUT /:id`: nếu `stock` thay đổi thì tạo một
dòng `InventoryHistory` với `note: "Điều chỉnh thủ công"`.

---

## 2.4 Dài hạn

### Realtime bằng WebSocket

Thay polling 15 giây bằng `socket.io`. Đơn mới hiện ngay ở màn hình bếp.

### Phân trang ở tầng API

```js
router.get("/", async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;

  const [items, total] = await Promise.all([
    Product.find().skip((page - 1) * limit).limit(limit),
    Product.countDocuments()
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});
```

### Thanh toán thật

Tích hợp MoMo hoặc VNPay: tạo request thanh toán, nhận callback, đối
soát chữ ký, cập nhật trạng thái đơn. Đây là công việc lớn nhất trong
danh sách.

### Bộ test tối thiểu

Không cần phủ 100%. Chỉ cần 3 nhóm, và chúng sẽ bắt được đúng những
loại bug đã gặp:

```js
// 1. voucherValue.js — phép tính tiền
test("BUY5GET1 chỉ áp khi đủ 6 ly", () => { ... });
test("FLASHSALE không cộng thêm giảm giá ngoài discount", () => { ... });

// 2. rewardsEngine.js — bậc thành viên
test("900.000₫ chi tiêu lên bậc Gold", () => { ... });

// 3. Schema — chống bug Mongoose bỏ field
test("Product lưu và trả về rating + reviewCount", () => { ... });
```

Nhóm 3 đặc biệt đáng giá: nó bắt được đúng loại bug đã xảy ra **5 lần**
trong project.

### Thêm tầng LLM cho chatbot

Giữ nguyên phần truy xuất theo luật, chỉ dùng LLM để diễn đạt câu trả
lời — chi tiết ở [doc 14](14-BAY-CHU-DE-HAY-BI-HOI.md). Rủi ro thấp vì
món gợi ý vẫn do thuật toán chọn, LLM không bịa ra được món không có
trong menu.

---

# PHẦN 3 — TÓM TẮT CHO BÁO CÁO

Nếu cần viết ngắn gọn vào slide hoặc báo cáo:

## Hạn chế

1. **Phân quyền admin chỉ ở phía client** — `AdminProtectedRoute` kiểm
   một giá trị trong `localStorage`, backend không cấp token cho admin,
   và 8/12 nhóm route API không có xác thực. Ai gọi API trực tiếp đều
   thao tác được dữ liệu.
2. **Chưa tích hợp thanh toán thật** — `paymentRoutes.js` luôn trả về
   thành công mà không xử lý giao dịch.
3. **Kho chưa nối với menu** — model `Recipe` đã thiết kế nhưng chưa
   dùng, nên bán hàng không tự trừ nguyên liệu.
4. **Chưa có kiểm thử tự động** — mọi thay đổi phải kiểm tra thủ công.
5. **Chưa sẵn sàng triển khai** — 34 vị trí viết cứng địa chỉ
   `localhost:5000`.
6. **Đồng bộ dữ liệu theo cơ chế hỏi vòng (polling) 15 giây** thay vì
   thời gian thực.
7. **Tìm kiếm chưa hỗ trợ tiếng Việt không dấu.**

## Hướng phát triển

1. Chuyển xác thực admin sang JWT phía server, bổ sung middleware phân
   quyền cho toàn bộ route ghi dữ liệu.
2. Tích hợp cổng thanh toán MoMo/VNPay có đối soát chữ ký.
3. Hoàn thiện liên kết công thức — kho: tự động trừ nguyên liệu theo
   đơn hàng, cảnh báo khi không đủ.
4. Thay polling bằng WebSocket để cập nhật đơn hàng thời gian thực.
5. Đưa cấu hình ra biến môi trường và triển khai lên môi trường thật.
6. Bổ sung kiểm thử tự động cho ba phần lõi: tính tiền khuyến mãi, điểm
   thưởng, và ràng buộc schema.
7. Bổ sung phân trang phía máy chủ khi dữ liệu tăng.

---

## Điểm mạnh nên nêu kèm

Báo cáo chỉ liệt kê hạn chế sẽ mất cân đối. Những thứ này **đã làm
đúng**, và đáng nói:

- **Thuật toán gợi ý có thể giải thích được** — thang điểm 8 luật, mỗi
  luật có lý do, không phải hộp đen.
- **Xử lý ngôn ngữ tiếng Việt trong chatbot** — bỏ dấu, so mờ Damerau,
  ngưỡng tha lỗi theo độ dài từ, xử lý phủ định. 8 lỗi nhận diện đã được
  sửa có kiểm chứng.
- **Xác thực Google đúng chuẩn** — có kiểm `audience`, đây là bước hay
  bị bỏ sót và là lỗ hổng nghiêm trọng nếu thiếu.
- **Tách bạch lỗi chính và lỗi phụ khi đặt đơn** — cộng điểm thất bại
  không làm đơn hàng trông như thất bại.
- **Trạng thái tồn kho là giá trị dẫn xuất**, tính lại ở mọi lần ghi
  nên không thể lệch với số lượng thật.
- **Biểu đồ tự vẽ bằng SVG** — không thêm thư viện cho 3 biểu đồ, hiểu
  và sửa được từng dòng.
- **Đánh giá sản phẩm có xác minh đã mua** — đối chiếu với lịch sử đơn
  hàng thật.
