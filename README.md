# SweeTea - 프리미엄 밀크티 쇼핑몰

React + Next.js + Node.js + MySQL로 구축된 풀스택 밀크티 판매 쇼핑몰입니다.

## 📋 목차
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [설치 방법](#설치-방법)
- [API 문서](#api-문서)
- [컴포넌트 구조](#컴포넌트-구조)
- [데이터베이스 스키마](#데이터베이스-스키마)

## 🚀 기술 스택

### 프론트엔드
- **Next.js 14.0.4** - React 프레임워크 (SSR, 라우팅)
- **React 18.2.0** - UI 라이브러리
- **Tailwind CSS 3.4.0** - 유틸리티 우선 CSS 프레임워크
- **AG-Grid 30.2.1** - 고성능 데이터 그리드 (관리자 페이지)
- **React-Calendar 4.6.1** - 날짜 선택 캘린더 컴포넌트
- **next-intl 3.3.0** - 다국어 지원 (한국어, 영어, 일본어)

### 백엔드
- **Node.js + Express 4.18.2** - REST API 서버
- **MySQL 2** - 관계형 데이터베이스
- **mysql2 3.6.5** - MySQL 드라이버 (Promise 지원)
- **bcryptjs** - 비밀번호 암호화
- **jsonwebtoken** - JWT 기반 인증
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - 환경변수 관리

## ✨ 주요 기능

### 🛍️ 사용자 쇼핑몰
- 🌍 **다국어 지원**: 한국어, 영어, 일본어 실시간 전환
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🔍 **상품 필터링**: 카테고리별 상품 조회
- 🛒 **장바구니 기능**: 상품 추가/삭제 관리
- 💳 **주문 시스템**: 주문 생성 및 관리

### 👨‍💼 관리자 페이지
- 📊 **대시보드**: 실시간 통계 (매출, 주문, 회원)
- 📦 **상품 관리**: CRUD 작업 (AG-Grid 사용)
- 📋 **주문 관리**: 상태 변경, 날짜별 조회 (Calendar 통합)
- 👥 **회원 관리**: 사용자 정보 및 권한 관리
- 🔧 **공통코드 관리**: 시스템 코드 관리 (다국어)

## 📁 프로젝트 구조

```
sweetea/
├── components/              # React 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   │   ├── Header.js       # 쇼핑몰 헤더
│   │   ├── AdminHeader.js  # 관리자 헤더
│   │   ├── Footer.js       # 푸터
│   │   └── LoadingSpinner.js # 로딩 스피너
│   ├── shop/               # 쇼핑몰 컴포넌트
│   │   ├── HeroSection.js  # 히어로 섹션
│   │   ├── CategoryFilter.js # 카테고리 필터
│   │   ├── ProductCard.js  # 상품 카드
│   │   └── ProductGrid.js  # 상품 그리드
│   └── admin/              # 관리자 컴포넌트
│       ├── StatCard.js     # 통계 카드
│       ├── OrderStatusBadge.js # 주문 상태 배지
│       └── ProductModal.js # 상품 추가/수정 모달
│
├── pages/                  # Next.js 페이지
│   ├── index.js           # 메인 쇼핑몰 페이지
│   ├── admin/             # 관리자 페이지
│   │   ├── index.js       # 대시보드
│   │   ├── products.js    # 상품관리
│   │   ├── orders.js      # 주문관리
│   │   └── codes.js       # 공통코드관리
│   ├── _app.js            # App 래퍼
│   └── _document.js       # Document 설정
│
├── server/                 # Express 백엔드
│   ├── index.js           # 서버 엔트리포인트
│   ├── database.sql       # DB 스키마 및 샘플 데이터
│   ├── routes/            # API 라우트
│   │   ├── products.js    # 상품 API
│   │   ├── orders.js      # 주문 API
│   │   ├── users.js       # 사용자 API
│   │   ├── commonCodes.js # 공통코드 API
│   │   └── admin.js       # 관리자 통계 API
│   └── queries/           # SQL 쿼리 모음
│       ├── productQueries.js    # 상품 쿼리
│       ├── orderQueries.js      # 주문 쿼리
│       ├── userQueries.js       # 사용자 쿼리
│       ├── commonCodeQueries.js # 공통코드 쿼리
│       └── adminQueries.js      # 관리자 통계 쿼리
│
├── styles/                # 스타일
│   └── globals.css        # 글로벌 CSS
│
├── package.json           # 의존성 관리
├── next.config.js         # Next.js 설정
├── tailwind.config.js     # Tailwind 설정
├── postcss.config.js      # PostCSS 설정
├── .env.local             # 환경변수
├── .gitignore             # Git 제외 파일
└── README.md              # 프로젝트 문서
```

## 🛠️ 설치 방법

### 1️⃣ 사전 요구사항
- Node.js 16.x 이상
- MySQL 5.7 이상
- npm 또는 yarn

### 2️⃣ 프로젝트 클론 및 패키지 설치
```bash
cd sweetea
npm install
```

### 3️⃣ 데이터베이스 설정
MySQL에 접속하여 데이터베이스를 생성하고 스키마를 import합니다:

```bash
# MySQL 접속
mysql -u root -p

# 스키마 실행
source server/database.sql

# 또는
mysql -u root -p < server/database.sql
```

### 4️⃣ 환경변수 설정
`.env.local` 파일을 수정하여 데이터베이스 정보를 입력합니다:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=sweetea

# 서버 포트
PORT=3001

# JWT 시크릿 키 (실제 운영환경에서는 복잡한 키로 변경)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 5️⃣ 서버 실행

#### 개발 모드 (프론트엔드 + 백엔드 동시 실행) - 권장
```bash
npm run dev:all
```

#### 개별 실행
```bash
# 프론트엔드만 실행
npm run dev

# 백엔드만 실행 (다른 터미널)
npm run server
```

#### 프로덕션 빌드
```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🌐 접속 정보

- **쇼핑몰**: http://localhost:3000
- **관리자 페이지**: http://localhost:3000/admin
- **API 서버**: http://localhost:3001
- **API 헬스체크**: http://localhost:3001/api/health

## 🔐 기본 관리자 계정

데이터베이스 초기화 시 자동으로 생성됩니다:

- **이메일**: admin@sweetea.com
- **비밀번호**: admin123

## 📡 API 문서

### 상품 API (Products)
| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|---------|
| GET | `/api/products` | 상품 목록 조회 | `?category=`, `?search=` |
| GET | `/api/products/:id` | 상품 상세 조회 | `id` (path) |
| POST | `/api/products` | 상품 등록 | Body (JSON) |
| PUT | `/api/products/:id` | 상품 수정 | `id` + Body |
| DELETE | `/api/products/:id` | 상품 삭제 | `id` (path) |

### 주문 API (Orders)
| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|---------|
| GET | `/api/orders` | 주문 목록 조회 | `?user_id=` |
| GET | `/api/orders/:id` | 주문 상세 조회 | `id` (path) |
| POST | `/api/orders` | 주문 생성 | Body (JSON) |
| PUT | `/api/orders/:id/status` | 주문 상태 변경 | `id` + Body |

### 사용자 API (Users)
| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|---------|
| POST | `/api/users/register` | 회원가입 | Body (JSON) |
| POST | `/api/users/login` | 로그인 | Body (JSON) |
| GET | `/api/users/:id` | 사용자 정보 조회 | `id` (path) |

### 공통코드 API (Common Codes)
| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|---------|
| GET | `/api/common-codes` | 전체 코드 조회 | - |
| GET | `/api/common-codes/groups` | 코드 그룹 목록 | - |
| GET | `/api/common-codes/group/:groupCode` | 그룹별 코드 조회 | `groupCode` |
| POST | `/api/common-codes` | 코드 등록 | Body (JSON) |
| PUT | `/api/common-codes/:id` | 코드 수정 | `id` + Body |
| DELETE | `/api/common-codes/:id` | 코드 삭제 | `id` (path) |

### 관리자 통계 API (Admin)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/dashboard` | 대시보드 통계 |
| GET | `/api/admin/sales-stats` | 월별 매출 통계 |
| GET | `/api/admin/popular-products` | 인기 상품 TOP 10 |
| GET | `/api/admin/users` | 사용자 목록 |
| PUT | `/api/admin/users/:id/role` | 사용자 역할 변경 |

## 🧩 컴포넌트 구조

### 공통 컴포넌트 (`components/common/`)
- **Header**: 쇼핑몰 헤더 (로고, 언어 선택, 관리자 링크)
- **AdminHeader**: 관리자 헤더 (네비게이션 메뉴)
- **Footer**: 푸터 (회사 정보, 연락처)
- **LoadingSpinner**: 로딩 상태 표시

### 쇼핑몰 컴포넌트 (`components/shop/`)
- **HeroSection**: 메인 배너 섹션
- **CategoryFilter**: 카테고리 필터 버튼 그룹
- **ProductCard**: 개별 상품 카드
- **ProductGrid**: 상품 목록 그리드

### 관리자 컴포넌트 (`components/admin/`)
- **StatCard**: 통계 카드 (대시보드용)
- **OrderStatusBadge**: 주문 상태 배지
- **ProductModal**: 상품 추가/수정 모달

## 🗄️ 데이터베이스 스키마

### users (사용자)
- `id`: 사용자 ID (PK, AUTO_INCREMENT)
- `email`: 이메일 (UNIQUE)
- `password`: 암호화된 비밀번호
- `name`: 이름
- `phone`: 전화번호
- `role`: 역할 (user, admin)
- `created_at`, `updated_at`: 타임스탬프

### products (상품)
- `id`: 상품 ID (PK)
- `name`, `name_en`, `name_ja`: 다국어 상품명
- `description`, `description_en`, `description_ja`: 다국어 설명
- `price`: 가격
- `category`: 카테고리
- `image_url`: 이미지 URL
- `stock`: 재고
- `created_at`, `updated_at`: 타임스탬프

### orders (주문)
- `id`: 주문 ID (PK)
- `user_id`: 사용자 ID (FK)
- `total_amount`: 총 금액
- `status`: 주문 상태
- `shipping_address`: 배송 주소
- `phone`: 연락처
- `created_at`, `updated_at`: 타임스탬프

### order_items (주문 상세)
- `id`: 주문 상세 ID (PK)
- `order_id`: 주문 ID (FK)
- `product_id`: 상품 ID (FK)
- `quantity`: 수량
- `price`: 단가
- `created_at`: 생성일시

### common_codes (공통코드)
- `id`: 코드 ID (PK)
- `code_group`: 코드 그룹
- `code`: 코드
- `code_name`, `code_name_en`, `code_name_ja`: 다국어 코드명
- `sort_order`: 정렬 순서
- `use_yn`: 사용 여부
- `created_at`, `updated_at`: 타임스탬프

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary (주황)**: 브랜드 메인 컬러
- **Secondary (녹색)**: 보조 컬러
- **Gray**: 텍스트 및 배경
- **Status Colors**: 주문 상태별 색상

### 반응형 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 개발 가이드

### 컴포넌트 작성 규칙
1. 모든 컴포넌트는 JSDoc 주석으로 문서화
2. Props 타입은 주석으로 명시
3. 재사용 가능한 컴포넌트는 `components/` 디렉토리에 분리
4. 페이지별 컴포넌트는 `pages/` 디렉토리에 작성

### SQL 쿼리 관리
1. 모든 쿼리는 `server/queries/` 디렉토리에 카테고리별로 분리
2. 쿼리는 함수나 상수로 export
3. 복잡한 쿼리는 주석으로 설명 추가

### 코딩 스타일
- ES6+ 문법 사용
- async/await 선호 (Promise.then 지양)
- 명확한 변수명 사용
- 주석은 한글로 작성

## 📝 라이센스

MIT License

## 👥 기여

기여는 언제나 환영합니다! 이슈나 PR을 자유롭게 등록해주세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
