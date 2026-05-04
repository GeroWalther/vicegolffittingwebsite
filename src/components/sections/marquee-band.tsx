const ITEMS = [
  "Vice Pro",
  "Drivers",
  "Irons",
  "Wedges",
  "Putters",
  "Pro Plus",
  "Tour",
  "Drive",
  "Apparel",
];

export function MarqueeBand() {
  return (
    <section className="relative border-y border-border bg-volt overflow-hidden">
      <div className="flex animate-[marquee_28s_linear_infinite] py-4 whitespace-nowrap">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="mx-8 font-bold uppercase tracking-tight text-2xl sm:text-3xl text-volt-foreground inline-flex items-center gap-8"
          >
            {item}
            <span aria-hidden className="text-volt-foreground/40">/</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
    </section>
  );
}
