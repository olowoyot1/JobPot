const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COUNTRIES = [
  { cat: 'bilateral', flag: '🇳🇴', name: 'Norway', vac: 960, salary: '€1,800 – €6,000/mo', industries: 'Marine,Food Processing,Agriculture' },
  { cat: 'bilateral', flag: '🇩🇰', name: 'Denmark', vac: 455, salary: '€1,900/mo', industries: 'Transport,Manufacturing,Agriculture' },
  { cat: 'bilateral', flag: '🇮🇹', name: 'Italy', vac: 200, salary: '€1,900/mo', industries: 'Hospitality,Culinary' },
  { cat: 'bilateral', flag: '🇱🇹', name: 'Lithuania', vac: 150, salary: '€1,100/mo', industries: 'Beverage Mfg,Food Processing' },
  { cat: 'bilateral', flag: '🇸🇰', name: 'Slovakia', vac: 490, salary: '€800 – €820/mo', industries: 'Manufacturing,Meat Processing' },
  { cat: 'bilateral', flag: '🇭🇷', name: 'Croatia', vac: 430, salary: '€650/mo', industries: 'Agriculture,Warehouse' },
  { cat: 'bilateral', flag: '🇷🇴', name: 'Romania', vac: 320, salary: '€540/mo', industries: 'Logistics,Food Service' },
  { cat: 'bilateral', flag: '🇷🇸', name: 'Serbia', vac: 530, salary: '€500/mo', industries: 'Manufacturing,Assembly' },
  { cat: 'bilateral', flag: '🇵🇱', name: 'Poland', vac: 200, salary: 'PLN 4,500–6,000/mo', industries: 'Meat Processing' },
  { cat: 'bilateral', flag: '🇭🇺', name: 'Hungary', vac: 30, salary: 'HUF 12,000–14,000/mo', industries: 'Warehouse,Logistics' },
  { cat: 'bilateral', flag: '🇧🇬', name: 'Bulgaria', vac: 150, salary: 'BGN 1,100/mo', industries: 'Construction' },
  { cat: 'bilateral', flag: '🇲🇰', name: 'North Macedonia', vac: 900, salary: '€350/mo', industries: 'Railway,Transport' },
  { cat: 'bilateral', flag: '🇧🇦', name: 'Bosnia & Herzegovina', vac: 800, salary: '€390/mo', industries: 'Construction' },
  { cat: 'bilateral', flag: '🇲🇪', name: 'Montenegro', vac: 690, salary: '€390 – €1,010/mo', industries: 'Construction,Heavy Equipment' },

  { cat: 'schengen', flag: '🇦🇹', name: 'Austria', vac: 240, salary: '€950 – €1,200/mo', industries: 'Construction,Hospitality' },
  { cat: 'schengen', flag: '🇧🇪', name: 'Belgium', vac: 448, salary: '€1,100 – €1,250/mo', industries: 'IT,Healthcare,Logistics' },
  { cat: 'schengen', flag: '🇨🇿', name: 'Czech Republic', vac: 448, salary: '€1,200 – €1,300/mo', industries: 'Manufacturing,Healthcare' },
  { cat: 'schengen', flag: '🇩🇰', name: 'Denmark', vac: 250000, salary: 'DKK 8,000–12,000/mo', industries: 'Engineering,Manufacturing,IT' },
  { cat: 'schengen', flag: '🇪🇪', name: 'Estonia', vac: 390, salary: '€850/mo', industries: 'IT,Hospitality' },
  { cat: 'schengen', flag: '🇫🇮', name: 'Finland', vac: 420, salary: '€1,000 – €1,100/mo', industries: 'Construction,Healthcare' },
  { cat: 'schengen', flag: '🇩🇪', name: 'Germany', vac: 1406, salary: '€950 – €1,200/mo', industries: 'Agriculture,Engineering,Pharma' },
  { cat: 'schengen', flag: '🇭🇺', name: 'Hungary', vac: 392, salary: 'HUF 12,000–14,000/mo', industries: 'Construction,Automotive' },
  { cat: 'schengen', flag: '🇬🇷', name: 'Greece', vac: 504, salary: '€1,200 – €1,300/mo', industries: 'Agriculture,Tourism' },
  { cat: 'schengen', flag: '🇮🇹', name: 'Italy', vac: 616, salary: '€1,200 – €1,300/mo', industries: 'Manufacturing,Tourism' },
  { cat: 'schengen', flag: '🇱🇻', name: 'Latvia', vac: 448, salary: '€1,200 – €1,300/mo', industries: 'Manufacturing,Forestry' },
  { cat: 'schengen', flag: '🇱🇮', name: 'Liechtenstein', vac: 448, salary: 'CHF 1,400/mo', industries: 'Construction,Healthcare' },
  { cat: 'schengen', flag: '🇱🇹', name: 'Lithuania', vac: 392, salary: '€1,200 – €1,300/mo', industries: 'IT,Hospitality' },
  { cat: 'schengen', flag: '🇱🇺', name: 'Luxembourg', vac: 168, salary: 'LUF 1,500/mo', industries: 'IT,Finance' },
  { cat: 'schengen', flag: '🇳🇱', name: 'Netherlands', vac: 392, salary: '€1,200 – €1,300/mo', industries: 'Manufacturing,IT' },
  { cat: 'schengen', flag: '🇳🇴', name: 'Norway', vac: 616, salary: '€1,200 – €1,300/mo', industries: 'Engineering,Logistics' },
  { cat: 'schengen', flag: '🇵🇱', name: 'Poland', vac: 784, salary: 'PLN 4,500–6,000/mo', industries: 'Automotive,Electronics' },
  { cat: 'schengen', flag: '🇸🇰', name: 'Slovakia', vac: 560, salary: '€1,200 – €1,300/mo', industries: 'Manufacturing,Engineering' },
  { cat: 'schengen', flag: '🇸🇮', name: 'Slovenia', vac: 560, salary: '€1,200 – €1,300/mo', industries: 'IT,Healthcare' },
  { cat: 'schengen', flag: '🇨🇭', name: 'Switzerland', vac: 504, salary: 'CHF 800/mo', industries: 'Manufacturing,Engineering' },
  { cat: 'schengen', flag: '🇭🇷', name: 'Croatia', vac: 957, salary: '€850 – €1,100/mo', industries: 'Construction,Healthcare' },
  { cat: 'schengen', flag: '🇲🇹', name: 'Malta', vac: null, salary: '€850 – €3,200/mo', industries: 'Engineering,Renewable Energy' },

  { cat: 'nonschengen', flag: '🇷🇴', name: 'Romania', vac: 536, salary: 'RON 3,000/mo', industries: 'Construction,Healthcare' },
  { cat: 'nonschengen', flag: '🇧🇬', name: 'Bulgaria', vac: 600, salary: 'BGN 1,100/mo', industries: 'IT,Construction' },
  { cat: 'nonschengen', flag: '🇲🇪', name: 'Montenegro', vac: 448, salary: '€1,200 – €1,300/mo', industries: 'Construction,Healthcare' },
  { cat: 'nonschengen', flag: '🇦🇱', name: 'Albania', vac: 7600, salary: 'USD 500 – 600/mo', industries: 'Manufacturing,IT,Logistics' },
  { cat: 'nonschengen', flag: '🇨🇾', name: 'Cyprus', vac: 390, salary: '€850/mo', industries: 'Hospitality,Tourism' },
  { cat: 'nonschengen', flag: '🇷🇸', name: 'Serbia', vac: 420, salary: '€500/mo', industries: 'Manufacturing,Healthcare' },
  { cat: 'nonschengen', flag: '🇬🇧', name: 'United Kingdom', vac: 740, salary: 'GBP 950 – 1,100/mo', industries: 'Agriculture,Engineering' },
  { cat: 'nonschengen', flag: '🇺🇦', name: 'Ukraine', vac: 392, salary: 'UAH 3,000/mo', industries: 'Construction,Automotive' },
];

function defaultPackages() {
  return [
    { tier: 'standard', name: 'Standard', price: 220, features: 'Document review & job matching\nApplication submission\nEmail support' },
    { tier: 'express', name: 'Express', price: 420, features: 'Everything in Standard\nPriority processing\nVisa appointment booking\nWhatsApp support' },
    { tier: 'premium', name: 'Premium Concierge', price: 690, features: 'Everything in Express\nFull visa & travel coordination\nPre-departure orientation\nPost-arrival support (30 days)' },
  ];
}

async function main() {
  const existing = await prisma.country.count();
  if (existing === 0) {
    for (const c of COUNTRIES) {
      await prisma.country.create({
        data: {
          name: c.name,
          flag: c.flag,
          category: c.cat,
          vacancies: c.vac,
          salary: c.salary,
          industries: c.industries,
          packages: { create: defaultPackages() },
        },
      });
    }
    console.log(`Seeded ${COUNTRIES.length} countries with default packages.`);
  } else {
    console.log('Countries already seeded, skipping.');
  }

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  console.log('Ensured site settings row exists.');

  const blockCount = await prisma.pageBlock.count();
  if (blockCount === 0) {
    await prisma.pageBlock.create({
      data: {
        type: 'hero',
        order: 0,
        title: 'Your next job is a departure away.',
        subtitle: 'Compare verified vacancies across dozens of destination countries, choose the placement package that fits your budget, and let our team handle the paperwork from application to arrival.',
        ctaLabel: 'Browse destinations',
        ctaHref: '#marketplace',
        secondaryCtaLabel: 'Create free account',
        secondaryCtaHref: '/signup',
      },
    });
    await prisma.pageBlock.create({
      data: {
        type: 'steps',
        order: 1,
        title: 'Three steps from application to arrival',
        subtitle: 'OAATZ COSULT LTD manages the process end to end so you can focus on preparing for the move.',
        body:
          'Create your account :: Tell us who you are and what kind of work you\'re looking for. It takes under two minutes.\n' +
          'Pick a destination & package :: Browse live vacancies by country, compare salaries and industries, then select a placement package.\n' +
          'We handle the rest :: Our team coordinates your documentation, visa appointment, and pre-departure orientation.',
      },
    });
    console.log('Seeded default homepage content blocks (hero + steps).');
  } else {
    console.log('Page blocks already exist, skipping.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
