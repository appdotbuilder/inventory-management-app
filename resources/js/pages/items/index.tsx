import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Barang',
        href: '/items',
    },
];

interface Item {
    id: number;
    code: string;
    name: string;
    description: string | null;
    category: string | null;
    unit: string;
    stock_quantity: number;
    price: number | null;
    created_at: string;
}

interface Props {
    items: {
        data: Item[];
        links: Array<{ label: string; url: string | null; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
    };
    [key: string]: unknown;
}

export default function ItemsIndex({ items, categories, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = () => {
        router.get('/items', {
            search: searchTerm,
            category: selectedCategory,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (item: Item) => {
        if (confirm(`Apakah Anda yakin ingin menghapus barang "${item.name}"?`)) {
            router.delete(`/items/${item.id}`, {
                onSuccess: () => {
                    // Success handled by flash message
                }
            });
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Barang" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📦 Daftar Barang
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Kelola data barang inventori
                        </p>
                    </div>
                    {isAdmin && (
                        <Button asChild>
                            <Link href="/items/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Barang
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                🔍 Cari Barang
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan nama atau kode barang..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                🏷️ Kategori
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Cari
                        </Button>
                    </div>
                </div>

                {/* Items List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Menampilkan {items.from || 0} - {items.to || 0} dari {items.total} barang
                        </p>
                    </div>

                    {items.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Kode
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Nama Barang
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Kategori
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Stok
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Harga
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                {item.category || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.stock_quantity === 0
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                        : item.stock_quantity <= 10
                                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                }`}>
                                                    {item.stock_quantity} {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/items/${item.id}`}>
                                                            <Package className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button asChild size="sm" variant="outline">
                                                                <Link href={`/items/${item.id}/edit`}>
                                                                    <Edit className="h-3 w-3" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDelete(item)}
                                                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium mb-2">Belum Ada Barang</h3>
                            <p className="mb-4">Mulai dengan menambahkan barang pertama Anda.</p>
                            {isAdmin && (
                                <Button asChild>
                                    <Link href="/items/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Barang
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {items.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}