/**
 * Komponen Checkbox
 * 
 * Komponen ini membuat input tipe checkbox dengan label yang dapat dikustomisasi.
 * Checkbox ini memiliki gaya dasar dengan border abu-abu dan perubahan warna saat dicentang.
 * 
 * Props:
 * - label: Teks yang ditampilkan di samping checkbox.
 * - ...props: Properti tambahan yang dapat digunakan untuk memodifikasi input (misalnya, `checked`, `onChange`, dll).
 */
export default function Checkbox({ label, ...props }) {
    return (
        <div>
            {/* Wrapper untuk mengatur checkbox dan label dalam satu baris */}
            <div className="flex flex-row items-center gap-2">
                {/* Input checkbox dengan gaya khusus */}
                <input
                    {...props} // Spread props untuk fleksibilitas, bisa menambahkan atribut seperti onChange, checked, dll.
                    type="checkbox"
                    className="rounded-md bg-white border-gray-200 checked:bg-teal-500"
                />
                {/* Label untuk checkbox, menampilkan teks yang dikirim melalui prop `label` */}
                <label className="text-sm text-gray-700">{label}</label>
            </div>
        </div>
    );
}
