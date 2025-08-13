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
        title: 'Barang',
        href: '/items',
    },
    {
        title: 'Tambah Barang',
        href: '/items/create',
    },
];

interface ItemFormData {
    code: string;
    name: string;
    description: string;
    category: string;
    unit: string;
    price: string;
    [key: string]: string;
}

export default function ItemsCreate() {
    const { data, setData, post, processing, errors } = useForm<ItemFormData>({
        code: '',
        name: '',
        description: '',
        category: '',
        unit: 'pcs',
        price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Barang" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ➕ Tambah Barang Baru
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Masukkan informasi barang yang ingin ditambahkan
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kode Barang *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: BRG001"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    required
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nama Barang *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Masukkan nama barang"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Deskripsi detail barang (opsional)"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kategori
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: Elektronik"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                />
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Satuan *
                                </label>
                                <select
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                >
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="liter">Liter</option>
                                    <option value="meter">Meter</option>
                                    <option value="box">Box</option>
                                    <option value="set">Set</option>
                                    <option value="pack">Pack</option>
                                </select>
                                {errors.unit && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unit}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Harga (IDR)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    min="0"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : '💾 Simpan Barang'}
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
                                Tips Menambahkan Barang
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Gunakan kode barang yang unik dan mudah diingat</li>
                                    <li>Nama barang sebaiknya jelas dan deskriptif</li>
                                    <li>Kategori membantu dalam pencarian dan organisasi</li>
                                    <li>Satuan yang tepat penting untuk perhitungan stok</li>
                                    <li>Harga dapat dikosongi jika belum ditentukan</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}