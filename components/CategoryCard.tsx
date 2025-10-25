import Link from "next/link";

type CategoryCardProps = {
  id: string;
  name: string;
  icon: string;
  productCount: number;
};

export default function CategoryCard({
  id,
  name,
  icon,
  productCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${id}`}
      className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-cyan-500 hover:shadow-lg transition-all"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        </div>
      </div>
    </Link>
  );
}

