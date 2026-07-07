import { prisma } from '../../lib/db';
import SignupForm from '../../components/SignupForm';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const countries = await prisma.country.findMany({ select: { id: true, name: true, flag: true } });
  const uniqueNames = [...new Map(countries.map((c) => [c.name, c])).values()];

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Create your account</h1>
        <p className="text-sm text-slate mb-6">Free to join. Takes less than two minutes.</p>
        <SignupForm countries={uniqueNames} />
      </div>
    </main>
  );
}
