import { Rise, Split } from "./motion";

/** Opening block for inner pages: giant split title, an italic second line and an intro. */
export function PageIntro({ kicker, lines, intro, aside }: { kicker?: string; lines: string[]; intro?: string; aside?: React.ReactNode }) {
  return (
    <section className="pt-[calc(var(--header)+clamp(3rem,8vw,7rem))] pb-[clamp(3rem,6vw,5rem)]">
      <div className="wrap grid grid-cols-12 items-end gap-x-6 gap-y-10">
        <div className="col-span-12">
          {kicker && <p className="kicker mb-6">{kicker}</p>}
          <h1 className="display text-[clamp(3.2rem,10vw,11rem)]">
            {lines.map((l, i) => (
              <Split key={i} as="span" by="chars" onLoad stagger={0.03} delay={i * 0.15} className={`block ${i % 2 ? "italic-accent pl-[8vw] normal-case" : ""}`}>
                {l}
              </Split>
            ))}
          </h1>
        </div>
        <Rise onLoad className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          {intro && <p className="lede">{intro}</p>}
          {aside}
        </Rise>
      </div>
    </section>
  );
}
