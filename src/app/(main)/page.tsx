import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Gamsung</h1>
        <p className="mt-2 text-gray-600">무신사 스타일 이커머스</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            상품 보기
          </Link>
          <Link
            href="/ranking"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            인기 랭킹
          </Link>
        </div>
      </section>
    </div>
  );
}
