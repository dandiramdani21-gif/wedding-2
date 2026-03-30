'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = { itemName: string; quantity: number; unitPrice: number };

export function PackageForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [items, setItems] = useState<Item[]>([{ itemName: '', quantity: 1, unitPrice: 0 }]);

  function changeItem(index: number, key: keyof Item, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [key]: key === 'itemName' ? value : Number(value) };
    setItems(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, imageUrl, items })
    });
    router.refresh();
    setName('');
    setDescription('');
    setImageUrl('');
    setItems([{ itemName: '', quantity: 1, unitPrice: 0 }]);
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama paket" className="w-full rounded-lg border p-2" required />
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL gambar" className="w-full rounded-lg border p-2" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" className="w-full rounded-lg border p-2" />
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="grid gap-2 md:grid-cols-3">
            <input value={item.itemName} onChange={(e) => changeItem(idx, 'itemName', e.target.value)} placeholder="Nama item" className="rounded-lg border p-2" required />
            <input type="number" min="1" value={item.quantity} onChange={(e) => changeItem(idx, 'quantity', e.target.value)} placeholder="Qty" className="rounded-lg border p-2" required />
            <input type="number" min="0" value={item.unitPrice} onChange={(e) => changeItem(idx, 'unitPrice', e.target.value)} placeholder="Harga satuan" className="rounded-lg border p-2" required />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setItems([...items, { itemName: '', quantity: 1, unitPrice: 0 }])} className="rounded-lg border px-3 py-2 text-sm">+ Tambah Item</button>
      <button className="block rounded-lg bg-slate-900 px-3 py-2 text-white">Simpan Paket</button>
    </form>
  );
}
