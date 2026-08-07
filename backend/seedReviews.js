// =====================================================
// SEED REVIEWS
//
// Chạy:  cd backend && node seedReviews.js
//
// VÌ SAO CẦN FILE NÀY
//
// Review nối với sản phẩm bằng `productId`. Mỗi lần
// `seeder.js` chạy lại, nó xoá sạch collection Product
// và tạo lại → Mongo sinh `_id` MỚI cho mọi sản phẩm.
// Toàn bộ review cũ thành "mồ côi": productId trỏ vào
// id không còn tồn tại, nên trang sản phẩm hiện 0 đánh
// giá dù DB vẫn còn 124 bản ghi.
//
// Review không lưu tên sản phẩm (chỉ lưu id) nên không
// remap được. Cách chữa duy nhất là tạo lại.
//
// => CHẠY LẠI FILE NÀY MỖI LẦN CHẠY seeder.js
//
// File này cũng cập nhật `rating` và `reviewCount` trên
// Product từ review thật, nên ProductCard không còn hiện
// số bịa.
// =====================================================

require("dotenv").config();

// Cùng lý do như server.js: DNS mặc định của Windows hay
// fail khi resolve SRV record của MongoDB Atlas.
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const Product = require("./models/Product");
const Review = require("./models/Review");


// =====================================================
// NGƯỜI VIẾT
// Trộn tên Việt và tên nước ngoài, khớp với việc app có
// cả 2 ngôn ngữ.
// =====================================================
const AUTHORS = [
  "Minh Anh", "Trần Quốc Bảo", "Ngọc Hà", "Phạm Duy",
  "Thu Trang", "Lê Hoàng", "Khánh Linh", "Đặng Nhật",
  "Mỹ Duyên", "Võ Thành", "Hồng Nhung", "Bùi Tuấn",
  "Sarah K.", "James L.", "Emily R.", "Daniel P.",
  "Yuki T.", "Anna M.", "Kevin N.", "Chloe W."
];


// =====================================================
// NỘI DUNG THEO NHÓM
//
// Mỗi nhóm sản phẩm có bộ review riêng để nội dung khớp
// với món — "đậm đà, không gắt" cho cà phê, "đá xay mịn"
// cho milkshake. Bộ chung chung sẽ lộ ra là dữ liệu bịa.
//
// Mỗi dòng: [số sao, tiêu đề, nội dung]
// =====================================================
const POOLS = {

  // --- CÀ PHÊ VIỆT ---
  vietnamese: [
    [5, "Đậm đà đúng chất", "Pha phin thật, không phải pha máy. Vị đậm mà không gắt, uống buổi sáng là tỉnh cả ngày."],
    [5, "Ngon như quán ruột", "Uống xong là hiểu vì sao đông khách. Tỉ lệ cà phê sữa cân, không ngọt lịm như mấy chỗ khác."],
    [4, "Ổn, giá hợp lý", "Vị ổn định, lần nào cũng như lần nào. Chỉ mong ly to hơn chút so với giá."],
    [4, "Chuẩn vị truyền thống", "Không bị pha loãng. Đá tan cũng chưa nhạt, đó là điểm tui thích."],
    [5, "Best coffee in the area", "Proper Vietnamese phin brew, not the watered-down tourist version. Strong and smooth."],
    [3, "Hơi ngọt với tui", "Cà phê ngon nhưng sữa nhiều quá. Lần sau tui xin ít sữa hơn."],
    [4, "Đá nhiều nhưng vẫn đậm", "Tưởng đá nhiều sẽ nhạt mà không. Pha đặc nên đá tan vẫn uống được."],
    [5, "Món tui gọi mỗi ngày", "Ghé 4-5 lần một tuần rồi. Chưa lần nào thất vọng."]
  ],

  // --- CÀ PHÊ MÁY (espresso, latte, cappuccino…) ---
  espresso: [
    [5, "Crema đẹp, vị cân", "Espresso chiết đúng, không chua cũng không khét. Barista biết việc."],
    [4, "Sữa đánh mịn", "Foam mịn, không bị bọt to. Latte art cũng đẹp, uống mà thấy được chăm."],
    [5, "Smooth and balanced", "No bitterness at all. The milk is steamed properly — silky, not foamy."],
    [4, "Ngon nhưng nóng quá", "Vị rất ổn, chỉ là nóng phải chờ 10 phút mới uống được."],
    [4, "Chuẩn quán cà phê xịn", "Không thua mấy chuỗi lớn mà giá dễ chịu hơn."],
    [3, "Hơi nhạt so với tui thích", "Với người quen uống đậm thì hơi nhẹ. Tui sẽ xin thêm 1 shot."],
    [5, "Caramel không bị ngọt gắt", "Sợ nhất là caramel ngọt lịm, ở đây cân bằng tốt."],
    [4, "Consistent every time", "Ordered this five times now, tastes the same every visit. That's harder than it sounds."]
  ],

  // --- TRÀ ---
  tea: [
    [5, "Trà thơm, không bị chát", "Ủ đúng thời gian nên thơm mà không chát. Rất dễ uống."],
    [4, "Ngọt vừa phải", "Tui xin 50% đường và vẫn đủ vị. Điểm cộng là chịu điều chỉnh."],
    [5, "Matcha thật, không phải bột pha", "Vị matcha rõ, hơi đắng nhẹ ở hậu vị — đúng matcha xịn."],
    [4, "Refreshing on a hot day", "Not too sweet, plenty of ice. Exactly what I wanted after walking around."],
    [4, "Topping tươi", "Trái cây tươi thật, không phải syrup. Thấy rõ khác biệt."],
    [3, "Đá nhiều quá", "Trà ngon nhưng đá chiếm hơn nửa ly. Lần sau xin ít đá."],
    [5, "Uống là nhớ", "Gọi lần đầu vì tò mò, giờ thành món quen."],
    [4, "Thơm mùi trà thật", "Không bị mùi hương liệu. Uống xong miệng vẫn dễ chịu."]
  ],

  // --- SINH TỐ ---
  smoothie: [
    [5, "Đặc và thơm", "Sinh tố đặc, không bị loãng nước. Trái cây tươi rõ ràng."],
    [4, "Trái cây tươi thật", "Vị tự nhiên, không ngọt kiểu syrup. Uống thấy no luôn."],
    [5, "Bơ béo mà không ngán", "Sinh tố bơ khó làm ngon mà ở đây làm được. Béo vừa, không ngán."],
    [4, "Thick and fresh", "You can taste the real fruit. Not one of those syrup-based drinks."],
    [3, "Ngọt hơi nhiều", "Ngon nhưng tui thích ít đường hơn. May là gọi được ít ngọt."],
    [4, "Xay mịn", "Không còn hạt lợn cợn. Xay kỹ."],
    [5, "Món tui gọi cho buổi chiều", "Uống thay bữa nhẹ luôn được. Đủ đặc để thấy no."]
  ],

  // --- NƯỚC ÉP ---
  juice: [
    [5, "Ép tươi tại quán", "Thấy họ ép trước mặt. Không pha thêm nước, không thêm đường."],
    [4, "Tươi và mát", "Vị chua ngọt tự nhiên. Ngày nóng uống rất được."],
    [4, "Fresh, not from concentrate", "You can tell it's actually squeezed. Big difference."],
    [4, "Không thêm đường", "Tui xin không đường và họ làm đúng. Vị nguyên bản ngon hơn."],
    [3, "Ly hơi nhỏ", "Nước ép ngon nhưng so giá thì ly nhỏ hơn kỳ vọng."],
    [5, "Ngọt tự nhiên", "Cam ngọt sẵn nên không cần thêm gì. Uống hết một hơi."]
  ],

  // --- SODA ---
  soda: [
    [5, "Ga mạnh, sảng khoái", "Ga đủ mạnh, không bị xẹp. Uống ngày nóng là đúng bài."],
    [4, "Chua ngọt cân", "Không bị ngọt gắt như soda đóng chai. Có vị trái cây thật."],
    [4, "Nice and fizzy", "Refreshing without being syrupy sweet. Good balance."],
    [4, "Nhìn đẹp, uống ngon", "Lên hình đẹp mà vị cũng ổn, không phải chỉ để chụp."],
    [3, "Hơi ngọt", "Ngon nhưng tui sẽ xin ít syrup hơn lần sau."],
    [5, "Chanh dây thật", "Có hạt chanh dây thật trong ly, không phải hương liệu."]
  ],

  // --- BÁNH NGỌT ---
  sweet: [
    [5, "Bánh mềm, không khô", "Cheesecake mịn, phần đế giòn vừa. Không bị khô như bánh để lâu."],
    [5, "Tiramisu chuẩn vị", "Có vị cà phê rõ, kem mascarpone nhẹ. Không quá ngọt."],
    [4, "Ngọt vừa phải", "Đúng độ ngọt tui thích. Ăn kèm cà phê đen là hoàn hảo."],
    [4, "Fresh, not sitting all day", "Clearly made recently. The texture gives it away."],
    [4, "Phần vừa đủ", "Không quá to nên ăn xong không bị ngán."],
    [3, "Ngon nhưng giá hơi cao", "Chất lượng ổn, chỉ là giá hơi cao so với phần."],
    [5, "Ăn kèm cà phê là đỉnh", "Gọi chung với cà phê đen, cân vị hoàn hảo."]
  ],

  // --- BÁNH MẶN ---
  bakery: [
    [5, "Giòn rụm", "Croissant nhiều lớp, giòn bên ngoài mềm bên trong. Nướng đúng."],
    [5, "Bánh mì thịt nướng ngon bất ngờ", "Thịt nướng thơm, rau tươi, bánh giòn. Không ngờ quán cà phê làm được vậy."],
    [4, "Nóng và thơm", "Được hâm nóng trước khi mang ra. Điểm cộng lớn."],
    [4, "Crispy and buttery", "Proper croissant texture — flaky, not bready."],
    [4, "Ăn sáng gọn nhẹ", "Gọi kèm cà phê là đủ bữa sáng. Giá hợp lý."],
    [3, "Hơi ít nhân", "Bánh ngon nhưng nhân hơi mỏng so với kỳ vọng."],
    [5, "Bơ thơm rõ", "Mùi bơ thật, không phải margarine. Khác biệt rõ."]
  ],

  // --- MILKSHAKE / FRAPPÉ / CHOCOLATE ---
  dessertDrink: [
    [5, "Đá xay mịn, không lợn cợn", "Xay kỹ nên mịn từ đầu tới cuối. Không bị tách nước."],
    [5, "Béo mà không ngán", "Đủ béo để thấy đúng là milkshake, nhưng uống hết ly vẫn không ngán."],
    [4, "Ngọt vừa, đá vừa", "Cân bằng tốt. Không phải ly đá xay ngọt lịm như mấy chỗ khác."],
    [4, "Thick and creamy", "Actually thick — needed the straw. Not watered down like most places."],
    [4, "Oreo giòn thật", "Có vụn Oreo giòn thật trên mặt, không phải bột."],
    [3, "Ngọt hơi nhiều với tui", "Ngon nhưng tui thích ít ngọt hơn. Nên gọi 70% đường."],
    [5, "Chocolate đậm", "Vị chocolate thật, hơi đắng nhẹ. Không phải nước đường màu nâu."],
    [4, "Con tui thích lắm", "Gọi cho con và bé uống hết. Sẽ gọi lại."]
  ]
};


// =====================================================
// CHỌN BỘ REVIEW THEO SẢN PHẨM
//
// Ưu tiên `subcategory` (chi tiết hơn), rồi tới
// `category`. Không khớp gì thì dùng bộ espresso làm
// mặc định — nội dung chung nhất.
// =====================================================
function poolFor(product) {

  const sub = product.subcategory || "";
  const cat = product.category || "";

  if (sub === "Vietnamese Coffee")  return POOLS.vietnamese;
  if (cat === "Coffee")             return POOLS.espresso;
  if (cat === "Tea")                return POOLS.tea;
  if (cat === "Smoothie")           return POOLS.smoothie;
  if (cat === "Juice")              return POOLS.juice;
  if (cat === "Soda")               return POOLS.soda;
  if (cat === "Sweet")              return POOLS.sweet;
  if (cat === "Bakery")             return POOLS.bakery;
  if (cat === "Dessert Drink")      return POOLS.dessertDrink;

  return POOLS.espresso;
}


// =====================================================
// RANDOM CÓ HẠT GIỐNG (deterministic)
//
// Dùng chuỗi id sản phẩm làm hạt giống, nên chạy file
// này 2 lần trên cùng dữ liệu sẽ ra CÙNG kết quả. Điều
// đó giúp demo ổn định: số sao trên ProductCard không
// nhảy mỗi lần seed lại.
//
// Math.random() sẽ làm mỗi lần chạy ra số khác.
// =====================================================
function makeRandom(seedText) {

  // hash chuỗi thành số 32-bit (thuật toán cyrb53 gọn)
  let h = 1779033703;

  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  // mulberry32: từ 1 số hạt giống sinh dãy số 0..1
  return function next() {
    h |= 0;
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


// =====================================================
// NGÀY VIẾT REVIEW
//
// Rải trong 120 ngày gần đây, thay vì tất cả cùng một
// thời điểm. Nếu tất cả cùng `createdAt` thì phần "sắp
// theo mới nhất" của reviewRoutes trông vô nghĩa.
// =====================================================
function dateWithinDays(rand, maxDaysAgo) {

  const daysAgo = Math.floor(rand() * maxDaysAgo);

  const hour = 8 + Math.floor(rand() * 13);   // 8h–20h

  const d = new Date();

  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(rand() * 60), 0, 0);

  return d;
}


async function run() {

  await mongoose.connect(process.env.MONGO_URI);

  console.log("Đã kết nối MongoDB\n");

  const products = await Product.find();

  if (!products.length) {
    console.log("Không có sản phẩm nào. Chạy seeder.js trước.");
    await mongoose.disconnect();
    return;
  }

  // -------------------------------------------------
  // BƯỚC 1 — dọn review mồ côi
  //
  // Chỉ xoá review trỏ vào sản phẩm KHÔNG còn tồn tại.
  // Review thật của khách (có userId) trên sản phẩm còn
  // tồn tại thì GIỮ LẠI.
  // -------------------------------------------------
  const liveIds = new Set(products.map(p => String(p._id)));

  const allReviews = await Review.find().select("productId userId");

  const orphanIds = allReviews
    .filter(r => !liveIds.has(String(r.productId)))
    .map(r => r._id);

  if (orphanIds.length) {

    await Review.deleteMany({ _id: { $in: orphanIds } });

    console.log(
      `Đã xoá ${orphanIds.length} review mồ côi ` +
      `(productId không khớp sản phẩm nào)`
    );

  }

  const realCount = await Review.countDocuments({
    userId: { $ne: null }
  });

  if (realCount) {
    console.log(`Giữ lại ${realCount} review thật của khách\n`);
  } else {
    console.log("");
  }

  // -------------------------------------------------
  // BƯỚC 2 — tạo review seed cho từng sản phẩm
  // -------------------------------------------------
  let created = 0;

  for (const product of products) {

    const rand = makeRandom(String(product._id));

    const pool = poolFor(product);

    // Bỏ qua nếu sản phẩm đã có review seed — chạy lại
    // file này không nhân đôi dữ liệu.
    const existingSeed = await Review.countDocuments({
      productId: String(product._id),
      userId: null
    });

    if (existingSeed > 0) {
      continue;
    }

    // 3–6 review mỗi món
    const howMany = 3 + Math.floor(rand() * 4);

    // Trộn pool rồi lấy `howMany` cái đầu, để không
    // lặp cùng một nội dung trên một sản phẩm.
    const shuffled = [...pool].sort(() => rand() - 0.5);

    const picked = shuffled.slice(
      0,
      Math.min(howMany, pool.length)
    );

    // Tên người viết cũng trộn, và không lặp trong cùng
    // một sản phẩm.
    const names = [...AUTHORS].sort(() => rand() - 0.5);

    const docs = picked.map(([rating, title, comment], i) => ({
      productId: String(product._id),
      userId: null,                  // review seed, không thuộc user nào
      authorName: names[i % names.length],
      rating,
      title,
      comment,

      // Phần lớn là đã mua, một số ít thì không —
      // giống dữ liệu thật hơn là 100% verified.
      verifiedPurchase: rand() > 0.25,

      createdAt: dateWithinDays(rand, 120)
    }));

    await Review.insertMany(docs);

    created += docs.length;
  }

  console.log(`Đã tạo ${created} review mới\n`);

  // -------------------------------------------------
  // BƯỚC 3 — cập nhật rating + reviewCount trên Product
  //
  // Đây là bước làm ProductCard hiện số THẬT. Trước đây
  // 6 sản phẩm có rating viết cứng trong products.json
  // (4.8 / 120 reviews) và 28 sản phẩm không có gì.
  //
  // Tính bằng aggregate để MongoDB làm phép trung bình,
  // thay vì tải hết review về Node.
  // -------------------------------------------------
  const stats = await Review.aggregate([
    {
      $group: {
        _id: "$productId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  const byId = new Map(
    stats.map(s => [String(s._id), s])
  );

  let synced = 0;

  for (const product of products) {

    const s = byId.get(String(product._id));

    await Product.findByIdAndUpdate(product._id, {
      // 1 chữ số thập phân, giống cách reviewRoutes
      // tính `average` để hai chỗ không lệch nhau
      rating: s ? Number(s.avg.toFixed(1)) : 0,
      reviewCount: s ? s.count : 0
    });

    if (s) synced++;
  }

  console.log(
    `Đã cập nhật rating + reviewCount cho ${synced}/${products.length} sản phẩm\n`
  );

  // -------------------------------------------------
  // BÁO CÁO
  // -------------------------------------------------
  const final = await Product.find()
    .select("name rating reviewCount")
    .sort({ rating: -1 })
    .lean();

  console.log("Kết quả:");
  console.log("".padEnd(52, "-"));

  final.forEach(p => {
    console.log(
      "  " +
      p.name.padEnd(30) +
      String(p.rating).padStart(4) + " ★" +
      String(p.reviewCount).padStart(5) + " review"
    );
  });

  console.log("".padEnd(52, "-"));
  console.log(`  Tổng: ${await Review.countDocuments()} review\n`);

  await mongoose.disconnect();

  console.log("Xong.");
}

run().catch(err => {
  console.log("Lỗi:", err.message);
  process.exit(1);
});
