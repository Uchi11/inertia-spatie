/**
 * Komponen DangerButton
 * 
 * Komponen ini digunakan untuk membuat tombol dengan gaya peringatan (danger),
 * biasanya digunakan untuk aksi-aksi seperti menghapus data atau tindakan kritis lainnya.
 * 
 * Props:
 * - className: (opsional) Kelas tambahan untuk kustomisasi styling.
 * - disabled: (boolean) Menonaktifkan tombol jika bernilai true.
 * - children: Konten yang akan ditampilkan di dalam tombol.
 * - ...props: Properti tambahan lainnya seperti onClick, type, dll.
 */
export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
