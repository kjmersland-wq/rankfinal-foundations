const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;

  return (
    <div className="w-full border-b border-accent-amber/30 bg-accent-amber/15 px-4 py-2 text-center text-sm font-semibold text-accent-amber">
      Payments in the preview are in test mode.
    </div>
  );
}
