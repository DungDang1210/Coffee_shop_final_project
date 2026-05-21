const promotions = [
  {
    id: 1,
    title: "New User Discount",
    code: "WELCOME20",
    description: "20% OFF for your first order",
    discount: 20,
    type: "percentage",
    forNewUser: true,
    background:
      "from-orange-500 to-red-500"
  },

  {
    id: 2,
    title: "Coffee Lover",
    code: "COFFEE10",
    description: "10% OFF all coffee drinks",
    discount: 10,
    type: "percentage",
    background:
      "from-[#6b4f4f] to-[#c08b5c]"
  },

  {
    id: 3,
    title: "Sweet Combo",
    code: "SWEET15",
    description:
      "15% OFF desserts and bakery",
    discount: 15,
    type: "percentage",
    background:
      "from-pink-500 to-rose-500"
  }
];

export default promotions;