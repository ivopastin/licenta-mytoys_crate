interface BillingSectionProps {
  displayName: string | null;
}

export default function BillingSection({ displayName }: BillingSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-bold text-ink">Billing</h2>

      {/* Order History */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Order History</h3>
        <div className="flex flex-col items-center justify-center py-10 border border-border-soft rounded-[14px] gap-2">
          <span className="text-[15px] font-semibold text-ink">No orders yet</span>
          <span className="text-[13px] text-warm">Your purchased patterns will appear here.</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Payment Method</h3>

        {/* Credit card visual */}
        <div
          className="relative w-full max-w-[320px] h-[180px] rounded-[20px] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #417c9c 0%, #2a3f4f 50%, #8b1a33 100%)",
          }}
        >
          {/* Card shine */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
          />

          {/* Top row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
                MyToys Crate
              </span>
            </div>
            <span className="text-white font-bold text-[18px] italic tracking-widest">
              VISA
            </span>
          </div>

          {/* Card number */}
          <div className="relative z-10">
            <span className="text-white text-[18px] font-mono tracking-[0.2em]">
              •••• •••• •••• 4242
            </span>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between relative z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[9px] uppercase tracking-wider">Card Holder</span>
              <span className="text-white text-[13px] font-semibold truncate max-w-[160px]">
                {displayName?.toUpperCase() || "CARD HOLDER"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-white/50 text-[9px] uppercase tracking-wider">Expires</span>
              <span className="text-white text-[13px] font-semibold">12/27</span>
            </div>
          </div>
        </div>

        {/* Add new card */}
        <div className="flex items-center gap-2 mt-1">
          <button
            disabled
            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold border border-border-soft text-warm opacity-50 cursor-not-allowed"
          >
            + Add new card
          </button>
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
