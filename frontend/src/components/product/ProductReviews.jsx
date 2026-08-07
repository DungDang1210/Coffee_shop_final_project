import { useEffect, useState } from "react";

import {
  Star,
  BadgeCheck,
  LoaderCircle,
  CircleAlert
} from "lucide-react";


function Stars({ value, size = 16 }) {

  return (

    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >

      {[1, 2, 3, 4, 5].map(i => (

        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />

      ))}

    </span>

  );

}


export default function ProductReviews({
  productId,
  user
}) {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // write-a-review form
  const [open, setOpen] = useState(false);

  const [rating, setRating] = useState(5);

  const [title, setTitle] = useState("");

  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const load = () => {

    setLoading(true);

    fetch(
      `http://localhost:5000/api/reviews/${productId}`
    )

      .then(async res => {

        const body = await res.json();

        if (!res.ok) {
          throw new Error(
            body.message || "Could not load reviews"
          );
        }

        return body;

      })

      .then(setData)

      .catch(err => setError(err.message))

      .finally(() => setLoading(false));

  };

  useEffect(() => {

    if (!productId) return;

    load();

  }, [productId]);


  const submit = async () => {

    if (!comment.trim()) {

      setFormError("Please write a few words.");

      return;

    }

    setFormError("");

    setSubmitting(true);

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            productId,
            rating,
            title,
            comment
          })
        }
      );

      const body =
        await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          body.message || "Could not post your review"
        );
      }

      setOpen(false);

      setTitle("");

      setComment("");

      setRating(5);

      load();

    } catch (err) {

      setFormError(err.message);

    } finally {

      setSubmitting(false);

    }

  };


  if (loading) {

    return (

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-10 flex items-center gap-3 text-gray-500">

        <LoaderCircle
          size={18}
          className="animate-spin"
        />

        Loading reviews...

      </div>

    );

  }

  if (error) {

    return (

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-10 text-gray-500">
        {error}
      </div>

    );

  }

  const {
    reviews = [],
    count = 0,
    average = 0,
    distribution = {}
  } = data || {};

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm mt-10">

      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">

        <div>

          <h2 className="text-2xl font-bold text-[#2d1e1e] mb-1">
            Customer Reviews
          </h2>

          <p className="text-gray-500 text-sm">
            {
              count
                ? `${count} review${count === 1 ? "" : "s"} from real orders`
                : "No reviews yet — be the first"
            }
          </p>

        </div>

        {user && (

          <button
            onClick={() => setOpen(!open)}
            className="border border-[#6b4f4f] text-[#6b4f4f] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#6b4f4f] hover:text-white transition"
          >
            {open ? "Cancel" : "Write a review"}
          </button>

        )}

      </div>

      {/* SUMMARY */}
      {count > 0 && (

        <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-center mb-8 pb-8 border-b">

          <div className="text-center">

            <p className="text-5xl font-black text-[#2d1e1e]">
              {average}
            </p>

            <Stars value={average} size={18} />

            <p className="text-sm text-gray-500 mt-1">
              out of 5
            </p>

          </div>

          {/* DISTRIBUTION */}
          <div className="space-y-1.5">

            {[5, 4, 3, 2, 1].map(star => {

              const n = distribution[star] || 0;

              const pct =
                count ? (n / count) * 100 : 0;

              return (

                <div
                  key={star}
                  className="flex items-center gap-3 text-sm"
                >

                  <span className="w-10 text-gray-500 tabular-nums">
                    {star} ★
                  </span>

                  <div className="flex-1 h-2.5 rounded-full bg-[#f3ece5] overflow-hidden">

                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />

                  </div>

                  <span className="w-8 text-right text-gray-500 tabular-nums">
                    {n}
                  </span>

                </div>

              );

            })}

          </div>

        </div>

      )}

      {/* WRITE FORM */}
      {open && user && (

        <div className="bg-[#faf7f4] rounded-2xl p-6 mb-8">

          {formError && (

            <div
              role="alert"
              className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            >

              <CircleAlert
                size={16}
                className="shrink-0 mt-0.5"
              />

              {formError}

            </div>

          )}

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Your rating
          </label>

          <div className="flex gap-1 mb-5">

            {[1, 2, 3, 4, 5].map(i => (

              <button
                key={i}
                onClick={() => setRating(i)}
                aria-label={`${i} star${i === 1 ? "" : "s"}`}
                className="p-1 hover:scale-110 transition"
              >

                <Star
                  size={26}
                  className={
                    i <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />

              </button>

            ))}

          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Sum it up in a few words (optional)"
            className="w-full border rounded-xl p-3 mb-3 outline-none focus:ring-2 focus:ring-[#6b4f4f]"
          />

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows="4"
            placeholder="How was it? Taste, sweetness, temperature..."
            className="w-full border rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-[#6b4f4f]"
          />

          <button
            onClick={submit}
            disabled={submitting}
            className="bg-[#6b4f4f] hover:bg-[#5a3f3f] disabled:bg-[#a3908c] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {submitting ? "Posting..." : "Post review"}
          </button>

        </div>

      )}

      {/* LIST */}
      <div className="space-y-6">

        {reviews.map(review => (

          <div
            key={review._id}
            className="border-b border-[#f2f2f2] pb-6 last:border-0 last:pb-0"
          >

            <div className="flex items-start justify-between gap-4 mb-2">

              <div>

                <div className="flex items-center gap-2 flex-wrap">

                  <span className="font-semibold text-[#2d1e1e]">
                    {review.authorName}
                  </span>

                  {review.verifiedPurchase && (

                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">

                      <BadgeCheck size={12} />

                      Verified purchase

                    </span>

                  )}

                </div>

                <div className="flex items-center gap-2 mt-1">

                  <Stars value={review.rating} size={14} />

                  <span className="text-xs text-gray-400">
                    {
                      new Date(review.createdAt)
                        .toLocaleDateString("vi-VN")
                    }
                  </span>

                </div>

              </div>

            </div>

            {review.title && (

              <p className="font-semibold text-[#2d1e1e] mt-2">
                {review.title}
              </p>

            )}

            <p className="text-gray-600 leading-relaxed mt-1">
              {review.comment}
            </p>

          </div>

        ))}

        {!reviews.length && (

          <p className="text-gray-500 text-center py-8">
            {
              user
                ? "No reviews yet — share your thoughts above."
                : "No reviews yet. Log in to write the first one."
            }
          </p>

        )}

      </div>

    </div>

  );

}
