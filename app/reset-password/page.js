import ResetPasswordForm from '../../components/ResetPasswordForm';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === 'string' ? params.token : '';

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Choose a new password</h1>
        <p className="text-sm text-slate mb-6">Enter and confirm your new password below.</p>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-3">
            Missing reset token. Please use the link from your password reset email.
          </div>
        )}
      </div>
    </main>
  );
}
