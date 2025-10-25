// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center py-3 mt-auto text-sm text-gray-600">
      © {new Date().getFullYear()} HIV Drug Resistance System · Malawi MOH
    </footer>
  );
}
