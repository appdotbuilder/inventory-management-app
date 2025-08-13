import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats: {
        total_items: number;
        low_stock_items: number;
        today_transactions: number;
        total_stock_value: number;
    };
    recent_transactions: Array<{
        id: number;
        type: string;
        quantity: number;
        transaction_date: string;
        item: {
            name: string;
            code: string;
        };
        user: {
            name: string;
        };
    }>;
    low_stock_items: Array<{
        id: number;
        name: string;
        code: string;
        stock_quantity: number;
    }>;
    [key: string]: unknown;
}

export default function Dashboard({ stats, recent_transactions, low_stock_items }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📊 Dashboard Stok Barang
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selamat datang, {auth.user?.name}! ({auth.user?.role === 'admin' ? '👑 Admin' : '👤 Staff'})
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Barang</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_items}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stok Rendah</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.low_stock_items}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaksi Hari Ini</p>
                                <p className="text-2xl font-bold text-green-600">{stats.today_transactions}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Nilai Stok</p>
                                <p className="text-lg font-bold text-purple-600">
                                    {formatCurrency(stats.total_stock_value)}
                                </p>
                            </div>
                            <TrendingDown className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">🚀 Aksi Cepat</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button asChild>
                            <Link href="/items">📋 Lihat Barang</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/stock-transactions/create">📦 Catat Transaksi</Link>
                        </Button>
                        {isAdmin && (
                            <>
                                <Button asChild variant="outline">
                                    <Link href="/items/create">➕ Tambah Barang</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/users">👥 Kelola User</Link>
                                </Button>
                            </>
                        )}
                        <Button asChild variant="outline">
                            <Link href="/reports/stock">📈 Laporan Stok</Link>
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📝 Transaksi Terkini</h3>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/stock-transactions">Lihat Semua</Link>
                            </Button>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {recent_transactions.length > 0 ? (
                                recent_transactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block w-2 h-2 rounded-full ${
                                                    transaction.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                                <span className="font-medium text-gray-900 dark:text-white">{transaction.item.name}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    ({transaction.item.code})
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                oleh {transaction.user.name} • {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-medium ${
                                                transaction.type === 'in' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada transaksi</p>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚠️ Stok Rendah</h3>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/items">Lihat Semua</Link>
                            </Button>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {low_stock_items.length > 0 ? (
                                low_stock_items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Kode: {item.code}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-medium px-2 py-1 rounded text-xs ${
                                                item.stock_quantity === 0 
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                            }`}>
                                                {item.stock_quantity} tersisa
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400">✅ Semua stok aman</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}