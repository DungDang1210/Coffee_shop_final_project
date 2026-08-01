import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import {
  User,
  Mail,
  ShieldCheck,
  Camera
} from "lucide-react";

export default function Profile({
  user,
  setUser,
  cart
}) {
  useEffect(() => {

      if (!user) return;

      setName(user.name || "");

      setPreview(
          user.avatar ||
          "https://i.pravatar.cc/150?img=12"
      );

  }, [user]);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const [name, setName] = useState(
    user?.name || ""
  );

  const [preview, setPreview] = useState(
    user?.avatar ||
    "https://i.pravatar.cc/150?img=12"
  );

  const handleSave = async () => {

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({ name, avatar: preview })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      alert("Profile updated!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleImage = (e) => {

    const file = e.target.files[0];


    if(file){

      const reader = new FileReader();


      reader.onloadend = () => {

        setPreview(reader.result);

      };


      reader.readAsDataURL(file);

    }

  };

  return (
    <>
      <Navbar
        cartCount={cart.length}
        user={user}
        setUser={setUser}
      />

      <div className="min-h-screen bg-[#fcfaf8] py-14 px-6">

        <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-[#eee] overflow-hidden">

          {/* TOP COVER */}
          <div className="h-40 bg-gradient-to-r from-[#6b4f4f] to-[#c08b5c]" />

          {/* PROFILE */}
          <div className="px-10 pb-10 relative">

            {/* AVATAR */}
            <div className="relative w-fit -mt-16 mb-6">

              <img
                src={preview}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />

              <label className="absolute bottom-1 right-1 bg-[#6b4f4f] text-white p-2 rounded-full cursor-pointer hover:scale-105 transition">
                <Camera size={16} />

                <input
                  type="file"
                  hidden
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* INFO */}
            <div className="space-y-6">

              <div>
                <label className="text-sm text-gray-500">
                  Full Name
                </label>

                <div className="flex items-center gap-3 border rounded-2xl px-4 py-3 mt-2">
                  <User size={18} />
                  
                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="flex-1 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Email
                </label>

                <div className="flex items-center gap-3 border rounded-2xl px-4 py-3 mt-2 bg-gray-50">
                  <Mail size={18} />

                  <p>{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Account Role
                </label>

                <div className="flex items-center gap-3 border rounded-2xl px-4 py-3 mt-2 bg-gray-50">
                  <ShieldCheck size={18} />

                  <p className="capitalize">
                    {user?.role || "customer"}
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleSave}
                className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-2xl font-semibold transition hover:scale-[1.01]"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
