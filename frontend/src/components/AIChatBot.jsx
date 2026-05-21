import { useState } from "react";
import {
  MessageCircle,
  X,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AIChatbot({
  products = []
}) {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hi 👋 I'm Brew AI.\nTell me your mood or what drink you want ☕",
      products: []
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SMART AI SEARCH
  // =========================

  const smartSearch = (message) => {

    const text = message.toLowerCase();

    // mood keywords
    const moodKeywords = {
      strong: [
        "espresso",
        "americano",
        "cà phê đen đá"
      ],

      sweet: [
        "latte",
        "caramel",
        "thai milk tea",
        "matcha"
      ],

      relax: [
        "tea",
        "matcha",
        "peach",
        "lychee"
      ],

      fresh: [
        "juice",
        "soda",
        "smoothie"
      ],

      dessert: [
        "oreo",
        "cheesecake",
        "tiramisu",
        "chocolate"
      ],

      vietnamese: [
        "bạc xỉu",
        "cà phê",
        "trà đào",
        "bánh mì"
      ]
    };

    // =========================
    // DIRECT SEARCH
    // =========================

    let matched = products.filter(product => {

      const fullText = `
        ${product.name}
        ${product.description}
        ${product.category}
        ${product.subcategory}
      `.toLowerCase();

      return fullText.includes(text);

    });

    // =========================
    // MOOD SEARCH
    // =========================

    if (matched.length === 0) {

      Object.entries(moodKeywords).forEach(
        ([mood, keywords]) => {

          if (text.includes(mood)) {

            const moodMatches =
              products.filter(product => {

                const p = `
                  ${product.name}
                  ${product.description}
                  ${product.category}
                  ${product.subcategory}
                `.toLowerCase();

                return keywords.some(keyword =>
                  p.includes(keyword)
                );

              });

            matched.push(...moodMatches);

          }

        }
      );

    }

    // =========================
    // REMOVE DUPLICATES
    // =========================

    matched = matched.filter(
      (product, index, self) =>
        index ===
        self.findIndex(
          p => p._id === product._id
        )
    );

    return matched.slice(0, 4);

  };

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async (customText) => {

    const messageText =
      customText || input;

    if (!messageText.trim()) return;

    const userMsg = {
      role: "user",
      text: messageText
    };

    setMessages(prev => [
      ...prev,
      userMsg
    ]);

    setInput("");
    setLoading(true);

    setTimeout(() => {

      const results =
        smartSearch(messageText);

      let aiText =
        "I found some recommendations for you ✨";

      if (results.length === 0) {

        aiText =
          "I couldn't find an exact match 😢\nTry words like:\ncoffee, sweet, strong, tea, smoothie, dessert...";

      }

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: aiText,
          products: results
        }
      ]);

      setLoading(false);

    }, 800);

  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#6b4f4f] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50"
      >
        {open ? (
          <X size={22} />
        ) : (
          <MessageCircle size={22} />
        )}
      </button>

      {/* CHATBOX */}
      {open && (

        <div className="fixed bottom-24 right-6 w-[390px] h-[650px] bg-white rounded-[30px] shadow-2xl overflow-hidden flex flex-col border border-[#eee] z-50">

          {/* HEADER */}
          <div className="bg-[#6b4f4f] text-white p-5">

            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} />
              <h2 className="font-bold text-lg">
                Brew AI Assistant
              </h2>
            </div>

            <p className="text-sm text-gray-200">
              Smart drink recommendations
            </p>

          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="p-3 border-b flex flex-wrap gap-2 bg-[#faf7f3]">

            {[
              "sweet coffee",
              "strong drink",
              "matcha",
              "dessert",
              "vietnamese coffee",
              "refreshing"
            ].map(item => (

              <button
                key={item}
                onClick={() =>
                  sendMessage(item)
                }
                className="bg-white border px-3 py-1 rounded-full text-sm hover:bg-[#6b4f4f] hover:text-white transition"
              >
                {item}
              </button>

            ))}

          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcfaf8]">

            {messages.map((msg, index) => (

              <div key={index}>

                {/* TEXT */}
                <div
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-line text-sm ${
                      msg.role === "user"
                        ? "bg-[#6b4f4f] text-white"
                        : "bg-white shadow text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>

                </div>

                {/* PRODUCTS */}
                {msg.products?.length > 0 && (

                  <div className="mt-3 grid gap-3">

                    {msg.products.map(product => (

                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="bg-white rounded-2xl p-3 flex gap-3 shadow hover:shadow-lg transition"
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />

                        <div className="flex-1">

                          <h3 className="font-semibold text-[#2d1e1e]">
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {product.description}
                          </p>

                          <div className="flex justify-between items-center">

                            <span className="font-bold text-[#6b4f4f]">
                              ${product.price}
                            </span>

                            <span className="text-xs bg-[#f3ece5] px-2 py-1 rounded-full">
                              {product.category}
                            </span>

                          </div>

                        </div>

                      </Link>

                    ))}

                  </div>

                )}

              </div>

            ))}

            {loading && (

              <div className="text-sm text-gray-400">
                Brew AI is thinking...
              </div>

            )}

          </div>

          {/* INPUT */}
          <div className="p-4 border-t bg-white flex gap-2">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask for drinks..."
              className="flex-1 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#6b4f4f]"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <button
              onClick={() =>
                sendMessage()
              }
              className="bg-[#6b4f4f] text-white px-5 rounded-2xl hover:bg-[#5a3f3f] transition"
            >
              Send
            </button>

          </div>

        </div>

      )}
    </>
  );
}