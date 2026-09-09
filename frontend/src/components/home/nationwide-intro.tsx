import { MapPin, QrCode, ShoppingBag } from "lucide-react";

export function NationwideIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-3 pt-4 sm:px-6" aria-labelledby="nationwide-title">
      <div className="overflow-hidden rounded-2xl border border-electric-200 bg-gradient-to-br from-electric-50 to-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-electric-600">O‘zbekistonning raqamli bozori</p>
        <h1 id="nationwide-title" className="mt-2 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
          Butun O‘zbekiston bo‘ylab bozorlar va do‘konlar — bitta platformada
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600 sm:text-base">
          Bozorliii hududma-hudud kengayib, xaridor va sotuvchilarni yagona katalogda bog‘laydi. Mahsulotni toping, bron qiling va do‘kondan qulay olib keting.
        </p>
        <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-3 rounded-xl bg-white/90 p-3 font-semibold text-ink-800">
            <ShoppingBag className="h-5 w-5 shrink-0 text-electric-600" aria-hidden /> 1. Mahsulotni tanlang va bron qiling
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-white/90 p-3 font-semibold text-ink-800">
            <MapPin className="h-5 w-5 shrink-0 text-electric-600" aria-hidden /> 2. Do‘kon manzilini xaritada toping
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-white/90 p-3 font-semibold text-ink-800">
            <QrCode className="h-5 w-5 shrink-0 text-electric-600" aria-hidden /> 3. Do‘konda to‘lang va QR bilan oling
          </li>
        </ol>
      </div>
    </section>
  );
}