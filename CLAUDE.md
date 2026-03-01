# CLAUDE.md - gamsung-web (Frontend)

## 프로젝트 개요
무신사 스타일 이커머스 프론트엔드. Next.js App Router 기반.

## 기술 스택
- Next.js (App Router), TypeScript, React
- Tailwind CSS, TanStack React Query
- Zustand (상태 관리)

## 프로젝트 구조
```
src/
├── app/(main)/       # 페이지 라우트 (App Router)
├── components/
│   ├── domain/       # 도메인 컴포넌트 (ProductCard, BrandCard 등)
│   ├── layout/       # 레이아웃 컴포넌트 (Header 등)
│   └── ui/           # 공통 UI 컴포넌트 (Button, Spinner 등)
├── features/         # 도메인별 기능 모듈
│   └── {domain}/
│       ├── api.ts    # API 호출 함수
│       ├── hooks.ts  # React Query 훅
│       ├── types.ts  # 타입 정의
│       └── store.ts  # Zustand 스토어 (필요 시)
├── lib/api/          # API 클라이언트 설정
└── types/            # 공통 타입
```

## 아키텍처 패턴
- **Feature 기반 구조**: `features/{domain}/` 하위에 api, hooks, types 모듈화
- **API 클라이언트**: `lib/api/client.ts` - 백엔드 ApiResponse 래퍼에서 data 자동 추출
- **React Query**: `features/{domain}/hooks.ts`에서 `useQuery`/`useMutation` 훅 정의
- **컴포넌트 분류**: domain(도메인 특화) / ui(범용) / layout(레이아웃)
- **"use client"**: 클라이언트 컴포넌트에 반드시 명시

## 백엔드 API
- Base URL: `NEXT_PUBLIC_API_BASE_URL` 환경변수
- API prefix: `/api/v1`
- 응답 구조: `{ meta: { result, errorCode, message }, data: T }`

## 연관 프로젝트
- 백엔드 API: `/Users/cony/Desktop/workspace/gamsung-commerce` (Spring Boot)

## 개발 워크플로우 (필수)

### 브랜치 전략
- **main 직접 push 금지** — 모든 변경은 PR을 통해서만 merge
- 브랜치 네이밍: `{type}/GS-{issue번호}-{간단설명}`
  - 예: `feature/GS-12-product-list`, `fix/GS-23-cart-quantity`, `refactor/GS-30-api-client`
- PR merge 방식: **Squash Merge** (히스토리 깔끔하게 유지)

### Issue 기반 개발
- 모든 작업은 **GitHub Issue 등록**으로 시작한다
- Issue 템플릿: feature(기능), bug(버그), task(리팩토링/인프라)
- PR 생성 시 본문에 `Closes #이슈번호`로 자동 연결

### 작업 흐름
```
1. Issue 등록 (요구사항 + 인수 조건)
2. feature 브랜치 생성
3. 컴포넌트/화면 설계 (해당 시)
4. 구현 + 동작 확인
5. PR 생성 → 리뷰
6. Squash Merge → main
```

## Git 커밋 메시지 규칙

### 형식
`<type>(<scope>): <subject>`

### 언어
- **subject와 본문은 반드시 한글**로 작성. type과 scope만 영문 소문자.
- subject: 한 줄, 50자 내외, 명령형, 마침표 없음

### Type
feat(기능), fix(버그수정), docs(문서), style(포맷), refactor(리팩터링), test(테스트), chore(빌드/설정)

### Scope
변경된 모듈/도메인: brand, product, order, cart, auth, likes 등

### 예시
```
feat(product): 상품 목록 좋아요 정렬 추가
fix(cart): 비로그인 장바구니 수량 업데이트 오류 수정
refactor(brand): 브랜드 목록 API 연동으로 변경
```

한 커밋에 여러 도메인이 있으면 가장 비중 큰 변경 기준으로 scope 하나만 사용.

## README.md 자동 동기화 규칙 (필수)

아키텍처에 영향을 주는 변경을 수행한 뒤에는 **반드시 `README.md`를 함께 갱신**한다.

### 트리거 조건 (하나라도 해당되면 갱신)
- 파일/폴더 **생성·삭제·이동** → 프로젝트 구조 트리 갱신
- 새 feature 모듈 추가 또는 기존 모듈 삭제 → features 목록 갱신
- 새 domain/ui/layout 컴포넌트 추가 또는 삭제 → components 목록 갱신
- 새 페이지 라우트 추가 또는 삭제 → 주요 화면 테이블 갱신
- 아키텍처 패턴 변경 (새 훅 패턴, 상태 관리 방식 등) → 해당 섹션 갱신
- 기술 스택 추가·제거 → 기술 스택 갱신

### 갱신 대상 섹션
| 변경 유형 | README 섹션 |
|-----------|------------|
| 폴더/파일 구조 | `프로젝트 구조` 트리 |
| 컴포넌트·모듈 | `프로젝트 구조` 트리 + 하단 설명 |
| 페이지 라우트 | `주요 화면` 테이블 |
| 기술 스택 | `기술 스택` |
| 환경 변수 | `환경 변수` 테이블 |

### 주의
- 커밋 전에 README.md 변경 여부를 자체 점검할 것
- 내용은 사실(코드)에 기반하여 작성하고, 추측이나 미래 계획은 적지 않을 것
- README.md에 불필요한 상세 구현은 넣지 않고, 구조와 사용법 수준만 유지할 것

## 디버깅 원칙 (필수)

에러(특히 런타임 실패, 렌더링 오류) 진단 시 **추측부터 하지 말고 사실부터 확인**한다.

### 순서
1. **실제 에러 메시지 확인** — 브라우저 콘솔, 터미널 로그, Next.js 에러 오버레이에서 원문을 먼저 읽는다
2. **네트워크/API 응답 확인** — DevTools Network 탭에서 요청 URL, 상태 코드, 응답 body를 확인한다
3. **컴포넌트 상태/props 확인** — React DevTools 또는 console.log로 실제 데이터 흐름을 추적한다
4. **코드 레벨 원인 분석** — 위 단계에서 원인이 안 나올 때만 로직 오류를 의심한다

### 하지 말 것
- 에러 메시지를 읽기 전에 "아마 이 코드가 문제일 것" 식으로 추정하지 않는다
- 한 가지 가설에 고착하지 않는다 — 첫 시도가 실패하면 다른 레이어(API, 상태, 렌더링)를 점검한다

## LLM 행동 가이드라인

- **한국어 응답**: 코드와 기술 용어를 제외한 모든 응답은 한국어로 작성
- **환각 금지**: 존재하지 않는 API, 패키지, 파일 경로를 지어내지 마라. 확실하지 않으면 먼저 확인
- **점진적 실행**: 여러 파일을 동시에 변경하지 말고, 한 단위씩 변경 후 중간 검증
- **피드백 기록**: 사용자가 실수를 지적하면 MEMORY.md에 교훈 기록
