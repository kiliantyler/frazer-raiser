import { ChromeCard } from '@/components/shared/chrome-card'
import { SectionFadeIn } from '@/components/shared/section-fade-in'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        aria-label="About the Frazer restoration project"
        className="mx-auto max-w-5xl px-6 py-10 sm:py-14 lg:py-16">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            About the project
          </p>
          <h1 className="mt-3 font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A 1948 Frazer, back from the quiet
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            Frazer Raiser is a long-form build journal for a 1948 Frazer that sat still for far too long. It is part
            documentation, part history lesson, and part motivation to keep turning wrenches.
          </p>
        </div>

        <SectionFadeIn>
          <ChromeCard>
            <div className="space-y-10 p-6 sm:p-8 lg:p-10">
              <div className="prose prose-invert max-w-2xl text-sm leading-relaxed sm:text-base prose-headings:mt-5 prose-headings:mb-2 lg:max-w-3xl">
                <AboutIntroSection />
                <KaiserFrazerSection />
                <FrazerDesignSection />
                <FrazerMechanicalSection />
                <MyFrazerSection />
              </div>

              <FrazerSpecsSection />
            </div>
          </ChromeCard>
        </SectionFadeIn>
      </section>
    </main>
  )
}

function AboutIntroSection() {
  return (
    <section className="space-y-3">
      <p>
        The car at the center of this project is a 1948 Frazer, an orphaned post-war sedan that lives somewhere between
        Detroit mainstream and forgotten experiment. This page is a quick tour of what it is, why it matters, and how
        this particular example ended up in my garage.
      </p>
    </section>
  )
}

function KaiserFrazerSection() {
  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-base font-semibold font-frazer tracking-widest text-primary">Kaiser-Frazer in brief</h2>
      <p>
        Kaiser-Frazer was one of the few serious post-war challengers to the Big Three. Industrialist Henry J. Kaiser
        teamed up with auto executive Joseph W. Frazer in 1945 to form the Kaiser-Frazer Corporation, building cars in a
        converted WWII bomber factory at Willow Run, Michigan.
      </p>
      <ul>
        <li>Founded in 1945 by Henry J. Kaiser and Joseph W. Frazer</li>
        <li>Cars built at the former Willow Run bomber plant in Michigan</li>
        <li>
          Frazer positioned as the upmarket companion to the more affordable Kaiser, sharing the same body shell but
          with a more refined feel
        </li>
      </ul>
    </section>
  )
}

function FrazerDesignSection() {
  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-base font-semibold font-frazer tracking-widest text-primary">What made the Frazer special</h2>
      <p>
        The 1948 Frazer was a full-size sedan riding on a wheelbase of around 115 inches and weighing just over 3,300
        pounds. Designed by Howard &quot;Dutch&quot; Darrin, it was recognized for its clean, modern lines and even
        picked up a New York design award.
      </p>
      <p>
        Inside, the car offered a roomy six-passenger interior and a large trunk, prioritizing comfort and practicality
        for families and travelers. A small but memorable luxury touch was the use of push-button door openers on all
        four doors, something that was rare in the late 1940s and still feels like a delightfully odd detail today.
      </p>
    </section>
  )
}

function FrazerMechanicalSection() {
  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-base font-semibold text-primary font-frazer tracking-widest">Under the skin</h2>
      <p>
        Mechanically, the Frazer was straightforward and durable, which is part of what makes it restorable today. In
        broad strokes:
      </p>
      <ul>
        <li>Continental-built 226.2 cubic inch L-head inline-six producing roughly 100 horsepower in early form</li>
        <li>Borg-Warner 3-speed manual transmission with overdrive for more relaxed highway cruising</li>
        <li>
          Independent coil springs up front, leaf springs at the rear, and hydraulic drum brakes on all four wheels
        </li>
        <li>
          Tuned for comfort and predictability rather than outright speed, making it an easygoing long distance car
        </li>
      </ul>
    </section>
  )
}

function MyFrazerSection() {
  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-base font-semibold text-primary font-frazer tracking-widest">This particular car</h2>
      <p>
        My Frazer spent roughly twenty years tucked away in a barn, originally a project car belonging to a
        friend&apos;s father who never got the chance to dig into it. When it was gifted to me, it came with an implied
        promise: restore it to its former glory and get it moving under its own power again.
      </p>
      <p>
        This project is my way of honoring that promise and preserving a small but meaningful piece of automotive
        history. Here I&apos;m documenting what&apos;s been rebuilt, what&apos;s been fabricated, what&apos;s been
        discovered about the car along the way, and what&apos;s still stubbornly stuck. If you&apos;re into old metal,
        incremental progress, and bringing overlooked machines back into use, you&apos;re in the right place.
      </p>
    </section>
  )
}

function FrazerSpecsSection() {
  return (
    <section className="mt-2 space-y-4 rounded-2xl border border-border/60 bg-background/70 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">1948 Frazer</p>
          <p className="mt-2 text-sm font-medium text-foreground">Key specifications</p>
        </div>
        <p className="text-xs text-muted-foreground sm:text-[0.7rem]">
          Approximate factory-era figures. This car is being kept close to stock in character.
        </p>
      </div>
      <dl className="grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3 sm:text-sm">
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Engine</dt>
          <dd className="mt-1 text-foreground">Continental 226.2 cu in L-head inline-six</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Power</dt>
          <dd className="mt-1 text-foreground">Around 100 hp (slightly higher in later years)</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Transmission</dt>
          <dd className="mt-1 text-foreground">Borg-Warner 3-speed manual with overdrive</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Suspension</dt>
          <dd className="mt-1 text-foreground">Independent coils front, leaf springs rear</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Brakes</dt>
          <dd className="mt-1 text-foreground">Hydraulic drum brakes on all four wheels</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Dimensions &amp; weight
          </dt>
          <dd className="mt-1 text-foreground">
            ~115&quot; wheelbase, ~193&quot; overall length, approx. 3,386 lb curb weight
          </dd>
        </div>
      </dl>
    </section>
  )
}
