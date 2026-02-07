import Link from "next/link";

const FOOTER_LINKS = {
  서비스: [
    { label: "상품", href: "/products" },
    { label: "랭킹", href: "/ranking" },
    { label: "브랜드", href: "/products" },
  ],
  고객지원: [
    { label: "마이페이지", href: "/my-page" },
    { label: "주문내역", href: "/my-page/orders" },
    { label: "좋아요", href: "/my-page/likes" },
  ],
  정책: [
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-display font-bold tracking-tight text-brand-black">
              GAMSUNG
            </p>
            <p className="mt-2 text-caption text-brand-gray">
              무신사 스타일 이커머스
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-body font-semibold text-brand-black">
                {title}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-caption text-brand-gray transition-colors hover:text-brand-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-brand-border pt-8">
          <p className="text-caption text-brand-gray">
            © Gamsung. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
