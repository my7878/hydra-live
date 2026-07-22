"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: number;
  tracking_id: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  plan: string;
  payment_method: string;
  payment_image: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("admin_logged_in");

    if (!logged) {
      router.replace("/admin/login");
      return;
    }

    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    loadOrders();
  }

  function logout() {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_email");

    router.push("/admin/login");
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        order.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        order.phone
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        order.username
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        order.tracking_id
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [orders, search]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (x) => x.status === "pending"
  ).length;

  const approvedOrders = orders.filter(
    (x) => x.status === "approved"
  ).length;

  const rejectedOrders = orders.filter(
    (x) => x.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto p-8">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-purple-500">
              Hydra Live Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              إدارة الطلبات
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={loadOrders}
              className="bg-purple-700 hover:bg-purple-800 px-5 py-3 rounded-lg"
            >
              تحديث
            </button>

            <button
              onClick={logout}
              className="bg-red-700 hover:bg-red-800 px-5 py-3 rounded-lg"
            >
              تسجيل خروج
            </button>

          </div>

        </div>
                <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-zinc-900 border border-purple-700 rounded-xl p-5">
            <p className="text-gray-400">إجمالي الطلبات</p>
            <h2 className="text-4xl font-bold mt-2 text-purple-400">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-yellow-700 rounded-xl p-5">
            <p className="text-gray-400">طلبات معلقة</p>
            <h2 className="text-4xl font-bold mt-2 text-yellow-400">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-green-700 rounded-xl p-5">
            <p className="text-gray-400">طلبات مقبولة</p>
            <h2 className="text-4xl font-bold mt-2 text-green-400">
              {approvedOrders}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-red-700 rounded-xl p-5">
            <p className="text-gray-400">طلبات مرفوضة</p>
            <h2 className="text-4xl font-bold mt-2 text-red-400">
              {rejectedOrders}
            </h2>
          </div>

        </div>

        <div className="mb-8">

          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الهاتف أو اسم المستخدم أو رقم التتبع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-purple-700 rounded-xl p-4 outline-none focus:border-purple-500"
          />

        </div>

        {loading ? (

          <div className="text-center text-xl py-20">
            جاري تحميل الطلبات...
          </div>

        ) : (

          <div className="overflow-x-auto rounded-xl border border-purple-700">

            <table className="w-full">

              <thead className="bg-purple-800">

                <tr className="text-left">

                  <th className="p-4">الاسم</th>

                  <th className="p-4">الهاتف</th>

                  <th className="p-4">اسم المستخدم</th>

                  <th className="p-4">الباقة</th>

                  <th className="p-4">الحالة</th>

                  <th className="p-4">رقم التتبع</th>

                  <th className="p-4">الصورة</th>

                  <th className="p-4">تغيير الحالة</th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.map((order) => (
                  <tr
  key={order.id}
  className="border-t border-zinc-800 hover:bg-zinc-900"
>

  <td className="p-4">{order.name}</td>

  <td className="p-4">{order.phone}</td>

  <td className="p-4">{order.username}</td>

  <td className="p-4">{order.plan}</td>

  <td className="p-4">
    <span
      className={`px-3 py-1 rounded-full text-sm font-bold
      ${
        order.status === "approved"
          ? "bg-green-700"
          : order.status === "pending"
          ? "bg-yellow-600"
          : order.status === "rejected"
          ? "bg-red-700"
          : "bg-blue-700"
      }`}
    >
      {order.status}
    </span>
  </td>

  <td className="p-4 font-mono">
    {order.tracking_id}
  </td>

  <td className="p-4">

    {order.payment_image ? (

      <button
        onClick={() => setPreviewImage(order.payment_image)}
        className="bg-purple-700 hover:bg-purple-800 px-3 py-2 rounded-lg"
      >
        عرض
      </button>

    ) : (

      <span className="text-gray-500">
        لا يوجد
      </span>

    )}

  </td>

  <td className="p-4">

    <select
      value={order.status}
      onChange={(e) =>
        updateStatus(order.id, e.target.value)
      }
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-2"
    >

      <option value="pending">
        Pending
      </option>

      <option value="approved">
        Approved
      </option>

      <option value="rejected">
        Rejected
      </option>

    </select>

  </td>

</tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {previewImage && (

        <div
          onClick={() => setPreviewImage("")}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
        >

          <div
            className="bg-zinc-900 border border-purple-700 rounded-xl p-4 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold">
                صورة التحويل
              </h2>

              <button
                onClick={() => setPreviewImage("")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                إغلاق
              </button>

            </div>

            <img
              src={previewImage}
              alt="Payment"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

          </div>

        </div>

      )}

    </main>

  );
}