import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="relative overflow-hidden rounded-2xl bg-brand-black py-20 text-brand-white sm:py-28">
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-display-lg font-bold tracking-tight sm:text-4xl">
            GAMSUNG
          </h1>
          <p className="mt-3 text-body text-white/80">
            무신사 스타일 이커머스. 스트릿부터 포멀까지.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center px-8 py-3.5 text-body font-semibold"
            >
              스타일 보기
            </Link>
            <Link
              href="/ranking"
              className="btn-outline inline-flex items-center border-white/40 bg-transparent px-8 py-3.5 text-body font-semibold text-white hover:bg-white/10 hover:border-white"
            >
              인기 랭킹
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
      </section>

      <section className="mt-16">
        <h2 className="text-display font-bold text-brand-black">
          쇼핑 카테고리
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/products"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">👕</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              전체 상품
            </span>
          </Link>
          <Link
            href="/ranking"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">🔥</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              인기 랭킹
            </span>
          </Link>
          <Link
            href="/my-page/likes"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">♥</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              좋아요
            </span>
          </Link>
          <Link
            href="/my-page"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">👤</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              마이
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
