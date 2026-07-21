"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-purple-500 mb-8">
        لوحة إدارة Hydra Live
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-zinc-900 border border-purple-700 rounded-xl p-5 mb-5"
        >
          <p><b>الاسم:</b> {order.name}</p>
          <p><b>الواتساب:</b> {order.phone}</p>
          <p><b>اسم المستخدم:</b> {order.username}</p>
<p><b>كلمة المرور:</b> {order.password}</p>
          <p><b>الباقة:</b> {order.plan}</p>
          <p><b>طريقة الدفع:</b> {order.payment_method}</p>

          {order.payment_image && (
            <img
              src={order.payment_image}
              alt="Payment"
              className="mt-4 w-64 rounded-lg"
            />
          )}
        </div>
      ))}
    </main>
  );
}