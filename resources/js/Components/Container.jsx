/**
 * Komponen Container
 * 
 * Komponen ini digunakan sebagai wadah (container) untuk membungkus konten halaman
 * dengan padding yang konsisten dan lebar maksimum yang responsif.
 * 
 * Props:
 * - children: Elemen atau komponen lain yang akan dirender di dalam container ini.
 */
export default function Container({ children }) {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
}
