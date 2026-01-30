# SweeTea - 프리미엄 밀크티 쇼핑몰

Next.js로 구축된 풀스택 밀크티 판매 쇼핑몰입니다.

## 🚀 기술 스택

- **Next.js 14.0.4** - React 프레임워크 (SSR, 라우팅, API Routes)
- **React 18.2.0** - UI 라이브러리
- **Tailwind CSS 3.4.0** - 유틸리티 우선 CSS 프레임워크
- **AG-Grid 30.2.1** - 고성능 데이터 그리드 (관리자 페이지)
- **React-Calendar 4.6.1** - 날짜 선택 캘린더 컴포넌트
- **파일 기반 저장소** - JSON 파일로 데이터 관리

## ✨ 주요 기능

### 🛍️ 사용자 쇼핑몰
- 🌍 **다국어 지원**: 한국어, 영어, 일본어, 베트남어 실시간 전환
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🔍 **상품 필터링**: 카테고리별 상품 조회
- 🛒 **장바구니 기능**: 상품 추가/삭제 관리
- 💳 **주문 시스템**: 주문 생성 및 관리

### 👨‍💼 관리자 페이지
- 📊 **대시보드**: 실시간 통계 (매출, 주문, 회원)
- 📦 **상품 관리**: CRUD 작업 (AG-Grid 사용)
- 📋 **주문 관리**: 상태 변경, 날짜별 조회
- 👥 **회원 관리**: 사용자 정보 및 권한 관리
- 🔧 **공통코드 관리**: 시스템 코드 관리 (다국어)

## 🛠️ 설치 방법

### 1️⃣ 사전 요구사항
- Node.js 16.x 이상
- npm 또는 yarn

### 2️⃣ 프로젝트 클론 및 패키지 설치
```bash
cd sweetea
npm install
```

### 3️⃣ 개발 서버 실행
```bash
npm run dev
```

서버가 실행되면 http://localhost:3000 으로 접속하세요.

## 🌐 접속 정보

- **쇼핑몰**: http://localhost:3000
- **관리자 페이지**: http://localhost:3000/admin
- **디버그 페이지**: http://localhost:3000/debug

## 🔐 기본 계정

- **관리자**: admin@sweetea.com / admin123
- **일반 사용자**: user@test.com / user123

## 📡 API 구조

Next.js API Routes를 사용하여 API와 프론트엔드가 하나의 프로젝트에 통합되어 있습니다.

### API 엔드포인트

#### 상품 API
- `GET /api/products` - 상품 목록 조회
- `GET /api/products?category=MILK_TEA` - 카테고리별 조회
- `GET /api/products/[id]` - 상품 상세 조회
- `POST /api/products` - 상품 생성
- `PUT /api/products/[id]` - 상품 수정
- `DELETE /api/products/[id]` - 상품 삭제

#### 기타 API (추가 예정)
- `/api/orders` - 주문 관리
- `/api/users` - 사용자 관리
- `/api/common-codes` - 공통코드 관리
- `/api/admin` - 관리자 통계

## 📁 프로젝트 구조

```
sweetea/
├── components/              # React 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   ├── shop/               # 쇼핑몰 컴포넌트
│   └── admin/              # 관리자 컴포넌트
│
├── pages/                  # Next.js 페이지 및 API
│   ├── api/               # Next.js API Routes ⭐
│   │   └── products/      # 상품 API
│   ├── admin/             # 관리자 페이지
│   ├── index.js           # 메인 쇼핑몰
│   ├── debug.js           # 디버그 페이지
│   └── _app.js            # App 래퍼
│
├── lib/                    # 유틸리티 라이브러리
│   └── fileStore.js       # 파일 저장소 유틸리티
│
├── data/                   # JSON 데이터 파일 ⭐
│   ├── products.json      # 상품 데이터
│   ├── orders.json        # 주문 데이터
│   ├── users.json         # 사용자 데이터
│   └── commonCodes.json   # 공통코드 데이터
│
└── styles/                # 스타일
    └── globals.css        # 글로벌 CSS
```

## 💾 데이터 저장 구조

모든 데이터는 `data/` 디렉토리의 JSON 파일에 저장됩니다.

### products.json (상품)
```json
{
  "id": 1,
  "name": "클래식 밀크티",
  "name_en": "Classic Milk Tea",
  "name_ja": "クラシックミルクティー",
  "name_vi": "Trà Sữa Cổ Điển",
  "price": 4500,
  "category": "MILK_TEA",
  "stock": 100
}
```

## 🌍 다국어 지원

현재 지원하는 언어:
- 🇰🇷 한국어 (ko) - 기본 언어
- 🇺🇸 영어 (en)
- 🇯🇵 일본어 (ja)
- 🇻🇳 베트남어 (vi)

## 🎨 주요 특징

### ⚡ 간편한 설치
- 데이터베이스 설정 불필요
- 별도의 백엔드 서버 불필요
- `npm run dev` 하나로 전체 실행

### 💾 파일 기반 저장
- JSON 파일로 데이터 관리
- 백업은 `data/` 폴더 복사로 완료
- 별도의 데이터베이스 서버 불필요

### 🔧 쉬운 개발
- Next.js API Routes 사용
- 프론트엔드와 백엔드가 하나의 프로젝트
- Hot Reload 지원

## 🚀 배포 방법

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 기타 플랫폼
Next.js를 지원하는 모든 플랫폼에 배포 가능합니다.

## 📝 라이센스

MIT License

## 👥 기여

기여는 언제나 환영합니다!

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
