const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  generateRecommendation
} = require("../services/recommendationEngine");


const INTENTS = [

  {
    key: "strong",
    words: [
      "strong", "bold", "intense", "wake",
      "tired", "sleepy", "energy", "caffeine",
      "espresso", "đậm", "mạnh"
    ],
    reply:
      "Something with a real kick — these are our strongest pours ☕",
    match: p =>
      (p.caffeine || 0) >= 3 ||
      (p.intensity || 0) >= 3
  },

  {
    key: "sweet",
    words: [
      "sweet", "sugary", "caramel", "dessert",
      "chocolate", "ngọt"
    ],
    reply:
      "Sweet tooth noted 🍯 Try one of these:",
    match: p =>
      /sweet|caramel|chocolate|honey/i.test(
        `${p.taste} ${p.name} ${p.description}`
      ) ||
      ["Sweet", "Bakery"].includes(p.category)
  },

  {
    key: "cold",
    words: [
      "cold", "iced", "ice", "refreshing",
      "hot day", "summer", "đá", "lạnh"
    ],
    reply:
      "Ice cold and refreshing — here you go 🧊",
    match: p =>
      p.temperature === "Cold"
  },

  {
    key: "hot",
    words: [
      "hot", "warm", "cozy", "rainy", "nóng"
    ],
    reply:
      "Something warm to hold onto ☕",
    match: p =>
      ["Hot", "Warm"].includes(p.temperature)
  },

  {
    key: "light",
    words: [
      "light", "mild", "gentle", "no caffeine",
      "decaf", "relax", "calm", "nhẹ"
    ],
    reply:
      "Easy does it — these are our gentler options 🍃",
    match: p =>
      (p.caffeine || 0) <= 1
  },

  {
    key: "milk",
    words: [
      "milk", "latte", "creamy", "milky", "sữa"
    ],
    reply:
      "Smooth and milky, coming up 🥛",
    match: p =>
      p.milk === true
  },

  {
    key: "nomilk",
    words: [
      "dairy free", "no milk", "without milk",
      "lactose", "khong sua", "black"
    ],
    reply:
      "No dairy in these ones 🖤",
    match: p =>
      p.milk !== true
  },

  // the target of a negated "sweet"
  {
    key: "notsweet",
    words: [
      "not sweet", "unsweet", "no sugar",
      "sugar free", "khong ngot", "it ngot"
    ],
    reply:
      "Nothing sugary here 🍃",
    match: p =>
      !/sweet|caramel|chocolate|honey/i.test(
        `${p.taste} ${p.name}`
      )
  },

  {
    key: "tea",
    words: [
      "tea", "matcha", "trà"
    ],
    reply:
      "Our tea side of the menu 🍵",
    match: p =>
      p.category === "Tea" ||
      /tea|matcha/i.test(p.name)
  },

  {
    key: "vietnamese",
    words: [
      "vietnamese", "viet", "traditional",
      "phin", "cà phê", "ca phe", "bạc xỉu"
    ],
    reply:
      "The traditional Vietnamese corner of our menu 🇻🇳",
    match: p =>
      /cà phê|ca phe|bạc xỉu|bac xiu|vietnamese|egg coffee/i.test(
        `${p.name} ${p.description}`
      )
  },

  {
    key: "cheap",
    words: [
      "cheap", "budget", "affordable", "under",
      "rẻ"
    ],
    reply:
      "Easiest on the wallet 💸",
    match: p =>
      (p.price || 0) <= 40000
  },

  {
    key: "popular",
    words: [
      "popular", "best", "recommend", "favourite",
      "favorite", "signature", "famous", "top"
    ],
    reply:
      "Our most-loved drinks ⭐",
    match: p =>
      p.bestSeller || p.signature
  }

];


// =====================================
// FUZZY KEYWORD MATCHING
//
// A customer typing "expreso", "cafe sua da"
// (no diacritics) or "smth sweet plz" should
// still get an answer. Exact substring matching
// only worked when they typed the keyword
// perfectly.
// =====================================

// "Cà Phê Sữa Đá" -> "ca phe sua da"
function deaccent(text) {

  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

}


function normalize(text) {

  return deaccent(String(text || "").toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


// Damerau-Levenshtein: counts a swapped pair as ONE
// edit, so "matcah" is 1 away from "matcha". Plain
// Levenshtein scored that as 2 and missed it.
function editDistance(a, b) {

  if (a === b) return 0;

  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }

  const rows = [];

  for (let i = 0; i <= a.length; i++) {
    rows[i] = [i];
  }

  for (let j = 0; j <= b.length; j++) {
    rows[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {

    for (let j = 1; j <= b.length; j++) {

      const cost =
        a[i - 1] === b[j - 1] ? 0 : 1;

      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost
      );

      // transposition
      if (
        i > 1 && j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {

        rows[i][j] = Math.min(
          rows[i][j],
          rows[i - 2][j - 2] + 1
        );

      }

    }

  }

  return rows[a.length][b.length];

}


// How much typo we forgive, by word length.
// Short words get ZERO tolerance: at 4 letters a
// single substitution turns "lạnh" (cold) into
// "bánh" (bread), which matched the wrong product.
function tolerance(word) {

  if (word.length <= 4) return 0;

  if (word.length <= 6) return 1;

  return 2;

}


// Filler words carry no intent. Without this,
// "tôi muốn uống gì đó lạnh" matched "Bánh Mì Thịt
// Nướng", because "uong" sits inside "nuong".
const STOPWORDS = new Set([
  // Vietnamese
  "toi", "minh", "muon", "uong", "an", "gi", "do",
  "cho", "co", "la", "va", "cai", "mot", "nao",
  "nay", "the", "duoc", "hay", "voi", "thi", "a",
  "nhe", "ah", "vay", "bao", "nhieu",

  // English
  "i", "me", "my", "an", "want", "like",
  "some", "something", "smth", "please", "plz",
  "give", "for", "with", "and", "or", "to", "of",
  "you", "have", "any", "can", "get", "would",
  "what", "whats", "which", "there", "is", "are",
  "am", "do", "does", "did", "how", "much", "many",
  "anything", "one", "your", "yours", "it", "that",
  "this", "now", "today", "please", "just", "really"
]);

// NOTE: "khong" is deliberately NOT a stopword — it
// is a negation and is handled by NEGATIONS below.


// token must line up with a whole word, not sit
// inside a longer one
function hasWord(haystack, token) {

  return haystack
    .split(" ")
    .some(word => word === token);

}


function matchesKeyword(tokens, normalizedText, keyword) {

  const key = normalize(keyword);

  if (!key) return false;

  // multi-word keyword: check the whole phrase
  if (key.includes(" ")) {
    return normalizedText.includes(key);
  }

  // whole-word or prefix match.
  //
  // The key itself must be >= 4 chars for the prefix
  // rule. With a 2-letter key it fired far too
  // easily: "recommend" starts with "re" (Vietnamese
  // for cheap), so "what do you recommend" was
  // answered with the budget list.
  if (
    hasWord(normalizedText, key) ||
    (
      key.length >= 4 &&
      tokens.some(t =>
        t.length > key.length && t.startsWith(key)
      )
    ) ||
    (key.length >= 4 && normalizedText.includes(key))
  ) {
    return true;
  }

  // fuzzy against each word the customer typed
  const allow = tolerance(key);

  if (allow === 0) return false;

  return tokens.some(token => {

    if (STOPWORDS.has(token)) return false;

    if (Math.abs(token.length - key.length) > allow) {
      return false;
    }

    return editDistance(token, key) <= allow;

  });

}


// "không caffeine" / "no sugar" / "ít ngọt" mean the
// OPPOSITE of the keyword they contain. Without this,
// "không caffeine" matched the "strong" intent.
const NEGATIONS = new Set([
  "khong", "ko", "k", "chua", "it", "no", "not",
  "without", "less", "avoid", "hate", "dislike"
]);

// Only "positive" intents appear as keys. The negative
// forms (nomilk, notsweet, light) must NOT be flippable
// — their own keywords already contain the negation, so
// flipping them back produced both milk AND nomilk and
// the results cancelled out.
const OPPOSITE = {
  strong: "light",
  sweet: "notsweet",
  hot: "cold",
  cold: "hot",
  milk: "nomilk"
};


function detectIntents(text) {

  const normalized = normalize(text);

  const tokens = normalized.split(" ").filter(Boolean);

  const negated = tokens.some(t => NEGATIONS.has(t));

  // score each intent by how many of its keywords hit
  const matched = INTENTS
    .map(intent => {

      const hits = intent.words.filter(word =>
        matchesKeyword(tokens, normalized, word)
      ).length;

      return { intent, hits };

    })
    .filter(row => row.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map(row => row.intent);

  if (!negated) return matched;

  // swap negated intents for their opposite, deduped
  const seen = new Set();

  const flipped = [];

  const add = (intent) => {

    if (!intent || seen.has(intent.key)) return;

    seen.add(intent.key);

    flipped.push(intent);

  };

  matched.forEach(intent => {

    const oppositeKey = OPPOSITE[intent.key];

    if (!oppositeKey) {

      // already a negative form, or nothing to flip
      add(intent);

      return;

    }

    add(
      INTENTS.find(i => i.key === oppositeKey)
    );

  });

  return flipped.length ? flipped : matched;

}


// =====================================
// SMALL TALK + SHOP FACTS
//
// A drink recommender that can't answer "what
// time do you open" feels broken. These are
// checked before the product search.
// =====================================

const SHOP_FACTS = [

  // exact: true — these words are short and collide
  // under fuzzy matching. "thanh toan" (payment) was
  // being answered as "thanks" because "thanh" is one
  // letter from "thank".
  {
    key: "greeting",
    exact: true,
    words: [
      "hi", "hello", "hey", "xin chao", "chao",
      "alo", "yo"
    ],
    reply:
      "Hi! 👋 I'm Brew AI. Tell me a mood (strong, sweet, iced, light), a budget (\"under 40k\"), or a drink name and I'll find it."
  },

  {
    key: "thanks",
    exact: true,
    words: [
      "thanks", "thank you", "cam on", "tks", "thx"
    ],
    reply:
      "Any time ☕ Anything else you'd like me to find?"
  },

  {
    key: "hours",
    words: [
      "open", "opening", "close", "closing",
      "hours", "gio mo", "mo cua", "dong cua",
      "may gio"
    ],
    reply:
      "We're open every day, 7:00 – 22:00. Last orders 15 minutes before close ☕"
  },

  // Order tracking is checked BEFORE location, because
  // "where is my order" contains "where" and was being
  // answered with the shop address.
  {
    key: "track",
    words: [
      "my order", "track", "tracking",
      "order status", "where is my",
      "cancel my order", "cancel order",
      "don hang", "kiem tra don", "theo doi",
      "don cua toi", "huy don"
    ],
    reply:
      "Open Orders from the navbar — every order shows a live status bar from Pending to Completed. You can cancel while it's still Pending 📦"
  },

  {
    key: "location",
    words: [
      "where are you", "where is the shop",
      "address", "located", "location",
      "dia chi", "o dau", "cho nao",
      "parking", "do xe"
    ],
    reply:
      "We're in Ho Chi Minh City. Full address and phone are in the footer of any page 📍"
  },

  {
    key: "amenities",
    words: [
      "wifi", "wi fi", "seat", "seating",
      "sit in", "dine in", "takeaway",
      "take away", "cho ngoi", "mang ve"
    ],
    reply:
      "Free wifi, seating inside, and takeaway all day. Ask a barista for the wifi password ☕"
  },

  {
    key: "delivery",
    words: [
      "delivery", "deliver", "ship", "shipping",
      "giao hang", "phi ship", "freeship"
    ],
    reply:
      "Delivery is 15.000₫ flat. The Free Shipping voucher on the Promotions page waives it entirely 🚚"
  },

  {
    key: "payment",
    words: [
      "pay", "payment", "momo", "zalopay",
      "thanh toan", "tra tien", "card"
    ],
    reply:
      "You can pay by MoMo or ZaloPay — scan the QR at checkout 💳"
  },

  {
    key: "voucher",
    words: [
      "voucher", "promo", "promotion", "discount",
      "coupon", "code", "khuyen mai", "giam gia",
      "ma giam"
    ],
    reply:
      "Head to the Promotions page — it lists every active offer, and checkout automatically suggests whichever one saves you the most 🎁"
  },

  {
    key: "rewards",
    words: [
      "reward", "rewards", "points", "member",
      "membership", "tier", "diem", "thanh vien",
      "tich diem"
    ],
    reply:
      "You earn 1 point per 1.000₫ spent. Points move you Bronze → Silver → Gold → Platinum, and each tier hands you a discount voucher 👑"
  },

  {
    key: "order_help",
    words: [
      "how to order", "how do i order",
      "how can i order", "place an order",
      "checkout", "cart", "buy",
      "cach dat", "dat hang", "gio hang",
      "mua hang"
    ],
    reply:
      "Add drinks to your cart, open Cart, then Checkout. You'll pick a voucher and a payment method there 🛒"
  }

];


// price queries: "under 40k", "duoi 50000", "cheap under 30"
function parseBudget(normalized) {

  // "40k" / "40 k" / "40000"
  const match = normalized.match(
    /(?:under|below|less than|max|duoi|khoang|tam|<)\s*(\d+)\s*(k|nghin|ngan)?/
  );

  if (!match) return null;

  let amount = Number(match[1]);

  if (!Number.isFinite(amount)) return null;

  // "40k" and bare "40" both mean 40.000₫
  if (match[2] || amount < 1000) {
    amount *= 1000;
  }

  return amount;

}


exports.chatAI = async (req, res) => {

  try {

    const message = String(
      req.body?.message || ""
    ).toLowerCase().trim();

    if (!message) {

      return res.json({
        reply:
          "Tell me what you're in the mood for — strong, sweet, iced, something light?",
        products: []
      });

    }

    const products = await Product.find({
      available: true
    });

    const normalizedMsg = normalize(message);

    const tokens =
      normalizedMsg.split(" ").filter(Boolean);

    // ===== SHOP FACTS / SMALL TALK =====
    // Only when the message is short — "hi" is a
    // greeting, "hibiscus tea" is not.
    const fact = SHOP_FACTS.find(f =>
      f.words.some(word => {

        const key = normalize(word);

        // exact facts never fuzzy-match
        if (f.exact) {

          return key.includes(" ")
            ? normalizedMsg.includes(key)
            : hasWord(normalizedMsg, key);

        }

        return matchesKeyword(
          tokens,
          normalizedMsg,
          word
        );

      })
    );

    if (fact && tokens.length <= 6) {

      return res.json({
        reply: fact.reply,
        intents: [fact.key],
        products: []
      });

    }

    // ===== BUDGET =====
    const budget = parseBudget(normalizedMsg);

    if (budget) {

      const affordable = products
        .filter(p => Number(p.price) <= budget)
        .sort(
          (a, b) =>
            (Number(b.rating) || 0) -
            (Number(a.rating) || 0)
        );

      if (!affordable.length) {

        const cheapest = [...products]
          .sort((a, b) => a.price - b.price)[0];

        return res.json({
          reply:
            `Nothing under ${budget.toLocaleString("vi-VN")}₫ I'm afraid. Our cheapest is ${cheapest?.name} at ${Number(cheapest?.price).toLocaleString("vi-VN")}₫.`,
          intents: ["budget"],
          products: cheapest ? [cheapest] : []
        });

      }

      return res.json({
        reply:
          `${affordable.length} drink${affordable.length === 1 ? "" : "s"} under ${budget.toLocaleString("vi-VN")}₫ — best rated first 💸`,
        intents: ["budget"],
        products: affordable.slice(0, 4)
      });

    }

    // ===== CHEAPEST / MOST EXPENSIVE =====
    if (
      matchesKeyword(tokens, normalizedMsg, "cheapest") ||
      matchesKeyword(tokens, normalizedMsg, "re nhat")
    ) {

      const sorted = [...products]
        .sort((a, b) => a.price - b.price);

      return res.json({
        reply: "Our most affordable drinks 💸",
        intents: ["cheapest"],
        products: sorted.slice(0, 4)
      });

    }

    // A negated message is never a product-name
    // search. "anything without milk" used to match
    // Thai Milk Tea by name — the exact opposite of
    // what was asked. Negations go straight to intent
    // detection, which flips milk -> nomilk.
    const isNegated = tokens.some(
      t => NEGATIONS.has(t)
    );

    // Product-name search, diacritic-insensitive
    // and typo-tolerant: "ca phe sua da" and
    // "capuccino" both land.
    const direct = isNegated ? [] : products
      .map(p => {

        const haystack = normalize(
          `${p.name} ${p.description} ${p.category} ${p.subcategory}`
        );

        const nameNorm = normalize(p.name);

        let score = 0;

        // whole phrase appears
        if (
          normalizedMsg.length >= 4 &&
          haystack.includes(normalizedMsg)
        ) {
          score += 10;
        }

        tokens.forEach(token => {

          if (
            token.length < 3 ||
            STOPWORDS.has(token)
          ) {
            return;
          }

          // whole-word hit on the product name
          if (hasWord(nameNorm, token)) {
            score += 5;
            return;
          }

          // prefix of a name word ("cappu" -> Cappuccino)
          const prefixHit = nameNorm
            .split(" ")
            .some(word =>
              token.length >= 4 &&
              word.startsWith(token)
            );

          if (prefixHit) {
            score += 4;
            return;
          }

          // fuzzy against the product's own words
          const fuzzyHit = nameNorm
            .split(" ")
            .some(word =>
              word.length > 3 &&
              editDistance(word, token) <=
                tolerance(token)
            );

          if (fuzzyHit) {
            score += 5;
            return;
          }

          // last resort: whole word somewhere in the
          // description / category
          if (hasWord(haystack, token)) {
            score += 2;
          }

        });

        return { product: p, score };

      })
      .filter(row => row.score >= 4)
      .sort((a, b) => b.score - a.score);

    if (direct.length) {

      return res.json({
        reply: `Here's what I found for "${message}" ☕`,
        intents: ["search"],
        products: direct
          .slice(0, 4)
          .map(r => r.product)
      });

    }

    const intents = detectIntents(message);

    if (!intents.length) {

      // no idea what they asked — fall back to
      // house favourites rather than nothing
      const popular = products
        .filter(p => p.bestSeller || p.signature)
        .slice(0, 4);

      return res.json({
        reply:
          "I'm not sure what you're after 🤔 Try words like strong, sweet, iced, light, tea or Vietnamese. Meanwhile, these are our favourites:",
        intents: [],
        products: popular
      });

    }

    // score by how many intents each drink satisfies
    const scored = products
      .map(product => ({
        product,
        score: intents.reduce(
          (n, intent) =>
            n + (intent.match(product) ? 1 : 0),
          0
        )
      }))
      .filter(row => row.score > 0);

    scored.sort((a, b) => {

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // tie-break on shop priority
      const rank = p =>
        (p.signature ? 2 : 0) +
        (p.bestSeller ? 1 : 0);

      return (
        rank(b.product) - rank(a.product)
      );

    });

    const matched =
      scored.slice(0, 4).map(r => r.product);

    if (!matched.length) {

      return res.json({
        reply:
          "I understood what you're after but nothing on the menu fits right now 😢 Try a broader word like coffee, tea, sweet or iced.",
        intents: intents.map(i => i.key),
        products: []
      });

    }

    // Lead with the strongest intent's line, then say
    // what else was taken into account — so the reply
    // explains itself instead of being one canned
    // sentence.
    let reply = intents[0].reply;

    if (intents.length > 1) {

      const extra = intents
        .slice(1, 3)
        .map(i => i.key)
        .join(" + ");

      reply += `\n(also matching: ${extra})`;

    }

    const best = scored[0];

    if (best && best.score === intents.length && intents.length > 1) {

      reply += `\n${best.product.name} ticks every box.`;

    }

    res.json({

      reply,

      intents: intents.map(i => i.key),

      products: matched

    });

  } catch (err) {

    console.log("chatAI error:", err);

    res.status(500).json({
      message: err.message
    });

  }

};


// =======================
// AI RECOMMENDATION
//
// Now runs the real recommendationEngine, which
// profiles taste / temperature / milk / caffeine
// / intensity across past orders. The old version
// just returned the most-ordered item, and even
// that was broken: it counted item.qty while
// orders actually store item.quantity, so every
// line counted as 1.
// =======================
exports.recommendAI = async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {

      return res.status(400).json({
        message: "Missing userId"
      });

    }

    const orders = await Order.find({
      userId: String(userId)
    });

    if (!orders.length) {

      // brand new customer — no history to learn
      // from, so lead with house favourites
      const starters = await Product.find({
        available: true,
        $or: [
          { signature: true },
          { bestSeller: true }
        ]
      }).sort({ rating: -1 }).limit(7);

      return res.json({
        product: starters[0] || null,
        related: starters.slice(1, 7),
        reason:
          starters.length
            ? "A house signature to start with — order a few times and I'll learn your taste."
            : null,
        basedOn: "signature"
      });

    }

    const result =
      await generateRecommendation(orders);

    if (!result?.product) {

      return res.json({
        product: null
      });

    }

    res.json({

      product: result.product,

      // the engine's reason is a multi-line
      // template — flatten it for the UI
      reason: String(result.reason || "")
        .replace(/\s+/g, " ")
        .trim(),

      score: result.score,

      // next-best matches from the same profile —
      // no second analysis needed
      related: (result.related || [])
        .map(r => r.product),

      profile: result.profile,

      basedOn: "history",

      ordersAnalyzed: orders.length

    });

  } catch (err) {

    console.log("recommendAI error:", err);

    res.status(500).json({
      message: err.message
    });

  }

};
