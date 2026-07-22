import { Suspense } from "react";
import OrderForm from "./OrderForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <OrderForm defaultPlan={params.plan} />
    </Suspense>
  );
}