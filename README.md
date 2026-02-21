# Gamsung Web

이커머스 프론트엔드. **gamsung-commerce** 백엔드 API와 연동하는 Next.js 웹 앱입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **React 18**, **TypeScript**
- **Tailwind CSS**
- **TanStack Query** (서버 상태)
- **Zustand** (클라이언트 상태·인증)

## 프로젝트 구조

```
src/
├── app/                      # 라우트·레이아웃·페이지
│   ├── (auth)/               # 로그인·회원가입 (레이아웃: 중앙 카드)
│   │   ├── login/
│   │   ├── join/
│   │   └── layout.tsx
│   ├── (main)/               # 메인·상품·마이 (레이아웃: Header + Footer)
│   │   ├── page.tsx          # 홈
│   │   ├── products/         # 상품 목록·상세
│   │   ├── brands/[id]/      # 브랜드 페이지
│   │   ├── ranking/          # 인기 랭킹
│   │   ├── my-page/          # 마이·주문·좋아요·포인트
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                   # Button, Input, Spinner, Modal
│   ├── domain/               # ProductCard, BrandCard, PaymentModal, PaymentMethodSelector
│   └── layout/               # Header, Footer, GlobalMenuModal
├── features/                 # 도메인별 API·훅·타입·상수
│   ├── auth/                 # 회원가입·로그인·useAuthStore
│   ├── product/
│   ├── brand/
│   ├── cart/
│   ├── likes/
│   ├── order/                # 주문 (useOrderCheckout 등)
│   ├── payment/              # 결제 (constants.ts: 결제 수단 상수·resolvePayment)
│   ├── point/
│   └── ranking/
├── lib/
│   └── api/                  # client, headers (X-USER-ID)
└── types/
    └── api.ts                # ApiResponse 등 공통 타입
```

- **app**: 페이지·레이아웃만. 비즈니스 로직·상태는 `features`의 커스텀 훅으로 위임.
- **components**: props 기반 presentational. API·전역 상태 직접 사용 지양.
- **features**: `api.ts`, `hooks.ts`, `types.ts`, `constants.ts`(필요 시) 단위. 페이지/컴포넌트는 여기만 참조.
- **lib**: fetch 래퍼·인증 헤더 등 도메인 무관 코드.

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경 변수 (선택)
cp .env.example .env.local
# NEXT_PUBLIC_API_BASE_URL 에 commerce-api 주소 설정 (예: http://localhost:8080)

# 개발 서버
npm run dev

# 빌드
npm run build
npm start
```

## 환경 변수

| 변수                       | 설명                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | gamsung-commerce API 서버 base URL (예: `http://localhost:8080`) |

## 주요 화면

| 경로              | 설명                                 |
| ----------------- | ------------------------------------ |
| `/`               | 홈 (신상품·인기상품)                 |
| `/products`       | 상품 목록 (정렬·페이지네이션·좋아요) |
| `/products/[id]`  | 상품 상세                            |
| `/brands/[id]`    | 브랜드 소개·상품 목록                |
| `/ranking`        | 인기 랭킹                            |
| `/orders/cart`    | 장바구니 (선택 주문)                 |
| `/order/order-form` | 주문서 (배송지·결제 수단 선택·결제) |
| `/login`, `/join` | 로그인(데모: X-USER-ID), 회원가입    |
| `/my-page`        | 마이 (주문·좋아요·포인트)            |

## 규칙·컨벤션

- 아키텍처·네이밍: `.cursor/rules/architecture.mdc`
- TypeScript·React·API·커밋: `.cursor/rules/` 내 해당 mdc 참고.
