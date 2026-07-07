'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '../actions/orders';

const STATUSES = ['pending', 'processing', 'approved', 'rejected'];

export default function OrderStatusForm({ orderId, status }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value))}
      className="text-xs font-mono uppercase border border-line rounded-full px-3 py-1.5 bg-paper"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
