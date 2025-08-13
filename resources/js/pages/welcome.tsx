import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Manajemen Stok Barang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 dark:text-white">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                📊 Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                >
                                    🚀 Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    📝 Daftar
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full max-w-6xl items-center justify-center">
                    <main className="w-full">
                        {/* Hero Section */}
                        <div className="mb-16 text-center">
                            <div className="mb-6 inline-block rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                                <div className="text-4xl">📦</div>
                            </div>
                            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
                                Sistem Manajemen 
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Stok Barang
                                </span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                                Kelola inventori dengan mudah! Sistem manajemen stok yang powerful dengan kontrol akses multi-user untuk Admin dan Staff.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-blue-700"
                                    >
                                        🚀 Masuk ke Sistem
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                                    >
                                        📝 Daftar Akun Baru
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="mb-16 grid gap-8 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                    <div className="text-2xl">📋</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Manajemen Barang</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    CRUD lengkap untuk data barang. Admin dapat mengelola semua data, Staff dapat melihat dan mencatat transaksi stok.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                    <div className="text-2xl">📊</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Tracking Stok Real-time</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Catat stok masuk dan keluar dengan detail lengkap. Sistem otomatis update quantity dan menyimpan history transaksi.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                    <div className="text-2xl">🔐</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Role-based Access</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Keamanan berlapis dengan kontrol akses berdasarkan role. Admin full control, Staff terbatas pada operasional.
                                </p>
                            </div>
                        </div>

                        {/* Additional Features */}
                        <div className="mb-16 grid gap-8 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                    <div className="text-2xl">🔍</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Pencarian & Filter</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Cari barang berdasarkan nama atau kode. Filter berdasarkan kategori, stok rendah, atau status barang.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-red-100 p-3 dark:bg-red-900">
                                    <div className="text-2xl">📈</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Laporan Lengkap</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Generate laporan stok dan transaksi. Filter berdasarkan periode, jenis transaksi, atau barang tertentu.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-block rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900">
                                    <div className="text-2xl">👥</div>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">User Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Admin dapat mengelola akun staff, mengatur role, dan memantau aktivitas user di sistem.
                                </p>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="mb-16 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:from-blue-950 dark:to-purple-950">
                            <h3 className="mb-8 text-center text-2xl font-bold">🎯 Keunggulan Sistem</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="flex gap-3">
                                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                                    <div>
                                        <strong className="text-green-700 dark:text-green-400">Dashboard Intuitif:</strong>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            Ringkasan stok, transaksi hari ini, dan alert stok rendah dalam satu tampilan.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                    <div>
                                        <strong className="text-blue-700 dark:text-blue-400">Multi-user Support:</strong>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            Role Admin dan Staff dengan hak akses yang berbeda sesuai kebutuhan.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"></div>
                                    <div>
                                        <strong className="text-purple-700 dark:text-purple-400">Responsive Design:</strong>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            Akses dari desktop, tablet, atau smartphone dengan tampilan yang optimal.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></div>
                                    <div>
                                        <strong className="text-orange-700 dark:text-orange-400">Real-time Updates:</strong>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            Stok terupdate otomatis setiap transaksi masuk atau keluar.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <div className="flex flex-col items-center gap-4 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:justify-center">
                                <span className="flex items-center gap-1">
                                    ⚡ Built with Laravel + React
                                </span>
                                <span className="hidden sm:block">•</span>
                                <span className="flex items-center gap-1">
                                    🔒 Secure & Scalable
                                </span>
                                <span className="hidden sm:block">•</span>
                                <span className="flex items-center gap-1">
                                    📱 Mobile Ready
                                </span>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                                Built with ❤️ by{" "}
                                <a 
                                    href="https://app.build" 
                                    target="_blank" 
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    app.build
                                </a>
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}