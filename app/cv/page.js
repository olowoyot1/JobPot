import CvForm from '../../components/CvForm';

export const metadata = {
  title: 'Submit your CV',
};

export default function CvPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-navy mb-2">Submit your CV</h1>
      <p className="text-slate text-sm mb-8">Fill in your details below, pick a format, and submit — our team will follow up.</p>
      <CvForm />
    </main>
  );
}
