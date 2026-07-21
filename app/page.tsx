import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <header className="flex items-center justify-between px-8 py-6 border-b border-purple-900">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpeg"
            alt="Hydra Live"
            width={70}
            height={70}
          />

          <div>
            <h1 className="text-2xl font-bold text-purple-400">
              Hydra Live
            </h1>

            <p className="text-gray-400 text-sm">
              Premium IPTV
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/201278470969"
          target="_blank"
          className="rounded-lg bg-purple-600 px-5 py-2 hover:bg-purple-500"
        >
          واتساب
        </a>
      </header>

      <section className="flex flex-col items-center justify-center py-24 px-6 text-center">

        <Image
          src="/images/logo.jpeg"
          alt="Hydra Live"
          width={220}
          height={220}
        />

        <h2 className="mt-8 text-5xl font-bold">
          أفضل اشتراك IPTV
        </h2>

        <p className="mt-6 max-w-2xl text-gray-300 text-lg">
          أكثر من 11800 قناة
          <br />
          أكثر من 29000 فيلم
          <br />
          أكثر من 14000 مسلسل
          <br />
          جودة حتى 4K
        </p>

        <a
          href="/order"
          className="mt-10 rounded-xl bg-purple-600 px-8 py-4 text-lg hover:bg-purple-500"
        >
          اشترك الآن
        </a>

        <div
          id="plans"
          className="mt-20 grid w-full max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-2xl border border-purple-700 bg-zinc-900 p-6">
            <h3 className="text-xl font-bold text-purple-400">🥇 24 شهر</h3>
            <p className="mt-2 text-gray-300">+ 6 شهور هدية</p>
            <p className="mt-4 text-3xl font-bold">1000 جنيه</p>

            <a
              href="/order?plan=24"
              className="mt-6 block w-full rounded-lg bg-purple-600 py-3 text-center hover:bg-purple-500"
            >
              اشترك الآن
            </a>
          </div>

          <div className="rounded-2xl border border-purple-700 bg-zinc-900 p-6">
            <h3 className="text-xl font-bold text-purple-400">🥈 12 شهر</h3>
            <p className="mt-2 text-gray-300">+ 3 شهور هدية</p>
            <p className="mt-4 text-3xl font-bold">600 جنيه</p>

            <a
  href="/order?plan=12"
  className="mt-6 block w-full rounded-lg bg-purple-600 py-3 text-center hover:bg-purple-500"
>
  اشترك الآن
</a>
          </div>

          <div className="rounded-2xl border border-purple-700 bg-zinc-900 p-6">
            <h3 className="text-xl font-bold text-purple-400">🥉 6 شهور</h3>
            <p className="mt-2 text-gray-300">+ شهر هدية</p>
            <p className="mt-4 text-3xl font-bold">400 جنيه</p>

            <a
              href="/order?plan=6"
              className="mt-6 block w-full rounded-lg bg-purple-600 py-3 text-center hover:bg-purple-500"
            >
              اشترك الآن
            </a>
          </div>

          <div className="rounded-2xl border border-purple-700 bg-zinc-900 p-6">
            <h3 className="text-xl font-bold text-purple-400">⭐ 3 شهور</h3>
            <p className="mt-2 text-gray-300">اشتراك أساسي</p>
            <p className="mt-4 text-3xl font-bold">250 جنيه</p>

            <a
              href="/order?plan=3"
              className="mt-6 block w-full rounded-lg bg-purple-600 py-3 text-center hover:bg-purple-500"
            >
              اشترك الآن
            </a>
          </div>
        </div>

      </section>

    </main>
  );
}