"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tracking_id");
    if (saved) {
      setTrackingId(saved);
    }
  }, []);

  async function searchOrder() {
    if (!trackingId.trim()) {
      setError("من فضلك أدخل رقم التتبع.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_id", trackingId.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      setOrder(null);
      setError("رقم التتبع غير صحيح أو الطلب غير موجود.");
      return;
    }

    setOrder(data);
  }

  function statusInfo(status: string) {
    switch (status) {
      case "pending":
        return {
          text: "🟡 في انتظار المراجعة",
          color: "text-yellow-400",
        };

      case "reviewing":
        return {
          text: "🔵 جاري المراجعة",
          color: "text-blue-400",
        };

      case "approved":
        return {
          text: "🟢 تمت الموافقة",
          color: "text-green-400",
        };

      case "completed":
        return {
          text: "✅ تم التفعيل",
          color: "text-green-500",
        };

      case "rejected":
        return {
          text: "❌ مرفوض",
          color: "text-red-500",
        };

      default:
        return {
          text: status,
          color: "text-white",
        };
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl rounded-2xl border border-purple-700 bg-zinc-900 p-8">

        <h1 className="text-center text-3xl font-bold text-purple-400">
          متابعة الطلب
        </h1>

        <p className="mt-3 text-center text-gray-400">
          أدخل رقم التتبع الذي حصلت عليه بعد إرسال الطلب.
        </p>

        <input
          type="text"
          placeholder="HYD-XXXXXXXX"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          className="mt-8 w-full rounded-lg bg-zinc-800 p-3 outline-none border border-purple-700"
        />

        <button
          onClick={searchOrder}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-purple-600 py-3 font-bold hover:bg-purple-500"
        >
          {loading ? "⏳ جاري البحث..." : "🔍 بحث"}
        </button>

        {error && (
          <div className="mt-5 rounded-lg bg-red-600 p-3 text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-6 rounded-xl border border-purple-700 bg-zinc-800 p-5 space-y-4">

            <div>
              <p className="text-gray-400">رقم التتبع</p>
              <h2 className="text-xl font-bold text-purple-400">
                {order.tracking_id}
              </h2>
            </div>

            <div>
              <p className="text-gray-400">الباقة</p>
              <p>{order.plan} شهر</p>
            </div>

            <div>
              <p className="text-gray-400">حالة الطلب</p>
              <p className={statusInfo(order.status).color}>
                {statusInfo(order.status).text}
              </p>
            </div>

            {order.created_at && (
              <div>
                <p className="text-gray-400">تاريخ الطلب</p>
                <p>
                  {new Date(order.created_at).toLocaleString("ar-EG")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">

          <Link
            href="/"
            className="rounded-lg border border-purple-600 py-3 text-center font-bold hover:bg-purple-600"
          >
            🏠 العودة للرئيسية
          </Link>

          <a
            href="https://wa.me/201278470969"
            target="_blank"
            className="rounded-lg bg-green-600 py-3 text-center font-bold hover:bg-green-500"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <FaWhatsapp />
              واتساب الدعم
            </span>
          </a>

        </div>

      </div>

    </main>
  );
}