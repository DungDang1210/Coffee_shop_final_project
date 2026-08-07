import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import {
  User,
  Mail,
  ShieldCheck,
  Camera,
  Phone,
  CircleAlert,
  CircleCheck,
  LoaderCircle
} from "lucide-react";

const DEFAULT_AVATAR =
  "/images/default-avatar.svg";

export default function Profile({
  user,
  setUser,
  cart
}) {

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const [name, setName] = useState(
    user?.name || ""
  );

  const [phone, setPhone] = useState(
    user?.phone || ""
  );

  // what the user sees
  const [preview, setPreview] = useState(
    user?.avatar || DEFAULT_AVATAR
  );

  // what actually gets saved — a URL, never
  // a base64 blob (that used to blow past the
  // 100kb express.json limit and 413)
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar || ""
  );

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // remember object URLs so they can be freed
  const objectUrlRef = useRef(null);

  useEffect(() => {

    if (!user) return;

    setName(user.name || "");

    setPhone(user.phone || "");

    setAvatarUrl(user.avatar || "");

    // don't clobber a freshly picked image
    if (!objectUrlRef.current) {

      setPreview(
        user.avatar || DEFAULT_AVATAR
      );

    }

  }, [user]);

  useEffect(() => {

    return () => {

      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }

    };

  }, []);

  // =========================
  // PICK + UPLOAD AVATAR
  // =========================
  const handleImage = async (e) => {

    const file = e.target.files?.[0];

    // let the same file be picked again
    e.target.value = "";

    if (!file) return;

    setError("");

    setSuccess("");

    if (!file.type.startsWith("image/")) {

      setError(
        "Please choose an image file."
      );

      return;

    }

    if (file.size > 5 * 1024 * 1024) {

      setError(
        "Image must be smaller than 5MB."
      );

      return;

    }

    // instant local preview
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const localUrl =
      URL.createObjectURL(file);

    objectUrlRef.current = localUrl;

    setPreview(localUrl);

    // upload as multipart, not JSON
    setUploading(true);

    try {

      const form = new FormData();

      form.append("image", file);

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          headers: authHeaders(),
          body: form
        }
      );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok || !data.imageUrl) {

        throw new Error(
          data.message ||
          "Could not upload the image."
        );

      }

      setAvatarUrl(data.imageUrl);

      setPreview(data.imageUrl);

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setSuccess(
        "Photo uploaded — press Save Changes to keep it."
      );

    } catch (err) {

      setError(err.message);

      // roll the preview back
      setPreview(
        user?.avatar || DEFAULT_AVATAR
      );

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

    } finally {

      setUploading(false);

    }

  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {

    if (uploading || saving) return;

    if (!name.trim()) {

      setError("Please enter your name.");

      return;

    }

    // the phone travels with every order, so make
    // sure it is at least plausible
    const cleanedPhone = phone.trim();

    if (
      cleanedPhone &&
      !/^[0-9+\s()-]{8,15}$/.test(cleanedPhone)
    ) {

      setError(
        "Enter a valid phone number (8–15 digits)."
      );

      return;

    }

    setError("");

    setSuccess("");

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: cleanedPhone,
            avatar: avatarUrl
          })
        }
      );

      // the 413 error page is HTML, not JSON
      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to update profile"
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      setSuccess("Profile updated.");

    } catch (err) {

      setError(err.message);

    } finally {

      setSaving(false);

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
                alt="Avatar"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
                className={`w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition ${
                  uploading ? "opacity-50" : ""
                }`}
              />

              {uploading && (

                <div className="absolute inset-0 flex items-center justify-center">

                  <LoaderCircle
                    size={28}
                    className="animate-spin text-[#6b4f4f]"
                  />

                </div>

              )}

              <label
                title="Change photo"
                className={`absolute bottom-1 right-1 bg-[#6b4f4f] text-white p-2 rounded-full transition ${
                  uploading
                    ? "opacity-60 cursor-wait"
                    : "cursor-pointer hover:scale-105"
                }`}
              >
                <Camera size={16} />

                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={uploading}
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* FEEDBACK */}
            {error && (

              <div
                role="alert"
                className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"
              >

                <CircleAlert
                  size={18}
                  className="shrink-0 mt-0.5"
                />

                <span>{error}</span>

              </div>

            )}

            {success && !error && (

              <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">

                <CircleCheck
                  size={18}
                  className="shrink-0 mt-0.5"
                />

                <span>{success}</span>

              </div>

            )}

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
                  Phone Number
                </label>

                <div className="flex items-center gap-3 border rounded-2xl px-4 py-3 mt-2">
                  <Phone size={18} />

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="e.g. 0912 345 678"
                    className="flex-1 outline-none"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1.5">
                  Used for delivery — this is what
                  checkout will show.
                </p>
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
                disabled={uploading || saving}
                className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] disabled:bg-[#a3908c] disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3"
              >

                {
                  saving
                    ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    )
                    : uploading
                      ? "Uploading photo..."
                      : "Save Changes"
                }

              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
