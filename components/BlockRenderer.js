import DepartureBoard from './DepartureBoard';

function parseSteps(body) {
  return (body || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('::');
      return { title: title.trim(), body: rest.join('::').trim() };
    });
}

export default function BlockRenderer({ block, countries }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="bg-navy text-white px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
              {block.title}
            </h1>
            {block.subtitle && (
              <p className="text-[#D9D9D9] max-w-[46ch] mb-7">{block.subtitle}</p>
            )}
            <div className="flex gap-3 flex-wrap">
              {block.ctaLabel && block.ctaHref && (
                <a href={block.ctaHref} className="bg-gold text-navydeep font-semibold px-6 py-3 rounded hover:bg-amber">
                  {block.ctaLabel}
                </a>
              )}
              {block.secondaryCtaLabel && block.secondaryCtaHref && (
                <a href={block.secondaryCtaHref} className="border border-white/35 px-6 py-3 rounded font-semibold hover:border-white">
                  {block.secondaryCtaLabel}
                </a>
              )}
            </div>
          </div>
          <DepartureBoard countries={countries || []} />
        </section>
      );

    case 'steps': {
      const steps = parseSteps(block.body);
      return (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-xl mb-9">
            {block.title && <h2 className="font-display text-3xl text-navy mb-2">{block.title}</h2>}
            {block.subtitle && <p className="text-slate text-sm">{block.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white border border-line rounded p-6">
                <h3 className="font-display text-lg text-navy mb-1">{s.title}</h3>
                <p className="text-sm text-slate">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'richtext':
      return (
        <section className="max-w-3xl mx-auto px-6 py-14">
          {block.title && <h2 className="font-display text-2xl text-navy mb-2">{block.title}</h2>}
          {block.subtitle && <p className="text-slate text-sm mb-4">{block.subtitle}</p>}
          {block.body && <p className="whitespace-pre-wrap text-ink leading-relaxed">{block.body}</p>}
        </section>
      );

    case 'cta':
      return (
        <section className="bg-navy text-white px-6 py-14 text-center">
          <div className="max-w-xl mx-auto">
            {block.title && <h2 className="font-display text-3xl mb-2">{block.title}</h2>}
            {block.subtitle && <p className="text-[#D9D9D9] mb-6">{block.subtitle}</p>}
            {block.ctaLabel && block.ctaHref && (
              <a href={block.ctaHref} className="inline-block bg-gold text-navydeep font-semibold px-7 py-3 rounded hover:bg-amber">
                {block.ctaLabel}
              </a>
            )}
          </div>
        </section>
      );

    case 'image_text': {
      const reverse = block.imagePosition === 'left';
      const textCol = (
        <div>
          {block.title && <h2 className="font-display text-2xl text-navy mb-2">{block.title}</h2>}
          {block.body && <p className="whitespace-pre-wrap text-slate leading-relaxed">{block.body}</p>}
        </div>
      );
      const imageCol = block.imageUrl ? (
        <img src={block.imageUrl} alt={block.title || ''} className="rounded w-full h-auto" />
      ) : (
        <div className="bg-paper border border-dashed border-line rounded h-48 flex items-center justify-center text-slate text-sm">
          No image set
        </div>
      );
      return (
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {reverse ? (
              <>
                {imageCol}
                {textCol}
              </>
            ) : (
              <>
                {textCol}
                {imageCol}
              </>
            )}
          </div>
        </section>
      );
    }

    case 'html':
      return (
        <section className="max-w-6xl mx-auto px-6 py-10" dangerouslySetInnerHTML={{ __html: block.body || '' }} />
      );

    default:
      return null;
  }
}
