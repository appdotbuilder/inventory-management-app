import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transaksi Stok',
        href: '/stock-transactions',
    },
    {
        title: 'Catat Transaksi',
        href: '/stock-transactions/create',
    },
];

interface Item {
    id: number;
    name: string;
    code: string;
    stock_quantity: number;
}

interface StockTransactionFormData {
    item_id: string;
    type: 'in' | 'out';
    quantity: string;
    notes: string;
    supplier: string;
    destination: string;
    transaction_date: string;
    [key: string]: string;
}

interface Props {
    items: Item[];
    [key: string]: unknown;
}

export default function StockTransactionsCreate({ items }: Props) {
    const { data, setData, post, processing, errors } = useForm<StockTransactionFormData>({
        item_id: '',
        type: 'in',
        quantity: '',
        notes: '',
        supplier: '',
        destination: '',
        transaction_date: new Date().toISOString().split('T')[0],
    });

    const selectedItem = items.find(item => item.id.toString() === data.item_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-transactions');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catat Transaksi Stok" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📦 Catat Transaksi Stok
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Catat stok masuk atau keluar barang
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pilih Barang *
                                </label>
                                <select
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                >
                                    <option value="">Pilih Barang...</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.code} - {item.name} (Stok: {item.stock_quantity})
                                        </option>
                                    ))}
                                </select>
                                {errors.item_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.item_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Jenis Transaksi *
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as 'in' | 'out')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                >
                                    <option value="in">📈 Stok Masuk</option>
                                    <option value="out">📉 Stok Keluar</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
                                )}
                            </div>
                        </div>

                        {selectedItem && data.type === 'out' && (
                            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    ⚠️ Stok tersedia: <strong>{selectedItem.stock_quantity}</strong> unit
                                </p>
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Jumlah *
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Masukkan jumlah"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    min="1"
                                    max={data.type === 'out' ? selectedItem?.stock_quantity : undefined}
                                    required
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tanggal Transaksi *
                                </label>
                                <Input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    required
                                />
                                {errors.transaction_date && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transaction_date}</p>
                                )}
                            </div>
                        </div>

                        {data.type === 'in' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Supplier
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Nama supplier (opsional)"
                                    value={data.supplier}
                                    onChange={(e) => setData('supplier', e.target.value)}
                                />
                                {errors.supplier && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.supplier}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tujuan
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Tujuan barang keluar (opsional)"
                                    value={data.destination}
                                    onChange={(e) => setData('destination', e.target.value)}
                                />
                                {errors.destination && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.destination}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Catatan
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Catatan tambahan (opsional)"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : '💾 Simpan Transaksi'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                🔙 Batal
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="text-blue-400">ℹ️</div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Tips Transaksi Stok
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Stok Masuk:</strong> Untuk barang yang diterima dari supplier atau produksi</li>
                                    <li><strong>Stok Keluar:</strong> Untuk barang yang dijual, dipindah, atau digunakan</li>
                                    <li>Pastikan jumlah yang dimasukkan sesuai dengan kondisi fisik</li>
                                    <li>Tanggal transaksi sebaiknya sesuai dengan waktu aktual</li>
                                    <li>Catatan akan membantu tracking dan audit di kemudian hari</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}