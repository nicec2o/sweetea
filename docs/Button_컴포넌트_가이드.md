# Button 컴포넌트 사용 가이드

## 📦 컴포넌트 목록

1. **Button** - 기본 버튼 컴포넌트
2. **IconButton** - 아이콘 전용 버튼
3. **ButtonGroup** - 버튼 그룹화 컴포넌트

---

## 🎯 Button 컴포넌트

### 기본 사용법

```javascript
import { Button } from '../../components/common'

<Button onClick={() => console.log('클릭!')}>
  클릭하세요
</Button>
```

### Variants (스타일)

```javascript
// Primary (기본)
<Button variant="primary">저장</Button>

// Secondary
<Button variant="secondary">취소</Button>

// Danger
<Button variant="danger">삭제</Button>

// Success
<Button variant="success">완료</Button>

// Ghost (배경 없음)
<Button variant="ghost">더보기</Button>

// Outline (테두리만)
<Button variant="outline">편집</Button>
```

### Sizes (크기)

```javascript
<Button size="sm">작은 버튼</Button>
<Button size="md">중간 버튼</Button>  {/* 기본값 */}
<Button size="lg">큰 버튼</Button>
```

### 아이콘과 함께 사용

```javascript
// 왼쪽 아이콘
<Button icon={<span>➕</span>}>
  상품 추가
</Button>

// 오른쪽 아이콘
<Button iconRight={<span>→</span>}>
  다음
</Button>

// 양쪽 아이콘
<Button 
  icon={<span>📁</span>}
  iconRight={<span>↓</span>}
>
  파일 다운로드
</Button>
```

### 로딩 상태

```javascript
const [loading, setLoading] = useState(false)

<Button 
  loading={loading}
  onClick={async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }}
>
  저장
</Button>
```

### 비활성화 상태

```javascript
<Button disabled>
  비활성 버튼
</Button>
```

### 전체 너비

```javascript
<Button fullWidth>
  전체 너비 버튼
</Button>
```

### 폼 제출 버튼

```javascript
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary">
    제출
  </Button>
</form>
```

---

## 🎨 IconButton 컴포넌트

### 기본 사용법

```javascript
import { IconButton } from '../../components/common'

<IconButton 
  icon={<span>✏️</span>}
  onClick={() => handleEdit()}
  title="수정"
/>
```

### Variants

```javascript
<IconButton icon={<span>✏️</span>} variant="primary" />
<IconButton icon={<span>🗑️</span>} variant="danger" />
<IconButton icon={<span>✓</span>} variant="success" />
<IconButton icon={<span>⋮</span>} variant="ghost" />
```

### Sizes

```javascript
<IconButton icon={<span>+</span>} size="sm" />
<IconButton icon={<span>+</span>} size="md" />
<IconButton icon={<span>+</span>} size="lg" />
```

### 툴팁과 함께

```javascript
<IconButton 
  icon={<span>❌</span>}
  title="닫기"
  onClick={handleClose}
/>
```

---

## 📦 ButtonGroup 컴포넌트

### 기본 사용법

```javascript
import { Button, ButtonGroup } from '../../components/common'

<ButtonGroup>
  <Button variant="outline">취소</Button>
  <Button variant="primary">저장</Button>
</ButtonGroup>
```

### 정렬 옵션

```javascript
// 왼쪽 정렬 (기본)
<ButtonGroup align="left">
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>

// 가운데 정렬
<ButtonGroup align="center">
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>

// 오른쪽 정렬
<ButtonGroup align="right">
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>

// 양쪽 정렬
<ButtonGroup align="between">
  <Button>왼쪽</Button>
  <Button>오른쪽</Button>
</ButtonGroup>
```

### 간격 조정

```javascript
<ButtonGroup spacing="sm">  {/* 작은 간격 */}
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>

<ButtonGroup spacing="md">  {/* 중간 간격 (기본) */}
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>

<ButtonGroup spacing="lg">  {/* 큰 간격 */}
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</ButtonGroup>
```

---

## 💡 실제 사용 예제

### 1. 모달 푸터 버튼

```javascript
<ButtonGroup align="right">
  <Button variant="outline" onClick={handleCancel}>
    취소
  </Button>
  <Button variant="primary" onClick={handleSubmit} loading={submitting}>
    {editMode ? '수정' : '등록'}
  </Button>
</ButtonGroup>
```

### 2. 페이지 헤더 액션 버튼

```javascript
<div className="flex justify-between items-center">
  <h1>상품 관리</h1>
  <ButtonGroup>
    <Button variant="outline" icon={<span>📥</span>}>
      가져오기
    </Button>
    <Button variant="primary" icon={<span>➕</span>}>
      상품 추가
    </Button>
  </ButtonGroup>
</div>
```

### 3. 테이블 액션 버튼

```javascript
<ButtonGroup spacing="sm">
  <IconButton 
    icon={<span>✏️</span>}
    variant="ghost"
    title="수정"
    onClick={() => handleEdit(row)}
  />
  <IconButton 
    icon={<span>🗑️</span>}
    variant="ghost"
    title="삭제"
    onClick={() => handleDelete(row.id)}
  />
</ButtonGroup>
```

### 4. 폼 제출 버튼 (로딩 상태)

```javascript
const [saving, setSaving] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)
  try {
    await saveProduct(formData)
    alert('저장되었습니다')
  } catch (error) {
    alert('오류가 발생했습니다')
  } finally {
    setSaving(false)
  }
}

<form onSubmit={handleSubmit}>
  {/* 폼 필드들... */}
  
  <ButtonGroup align="right">
    <Button type="button" variant="outline">
      취소
    </Button>
    <Button type="submit" variant="primary" loading={saving}>
      저장
    </Button>
  </ButtonGroup>
</form>
```

### 5. 상태별 버튼

```javascript
const getStatusButton = (status) => {
  const configs = {
    PENDING: { variant: 'outline', text: '대기중' },
    PROCESSING: { variant: 'primary', text: '처리중', loading: true },
    COMPLETED: { variant: 'success', text: '완료' },
    FAILED: { variant: 'danger', text: '실패' }
  }
  
  const config = configs[status]
  
  return (
    <Button 
      variant={config.variant}
      loading={config.loading}
      size="sm"
    >
      {config.text}
    </Button>
  )
}
```

---

## 🎨 커스터마이징

### 추가 클래스 적용

```javascript
<Button className="shadow-lg">
  그림자 효과
</Button>

<IconButton 
  icon={<span>×</span>}
  className="absolute top-2 right-2"
/>
```

### 커스텀 스타일

```javascript
<Button
  style={{ 
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    border: 'none'
  }}
>
  그라데이션 버튼
</Button>
```

---

## ⚠️ 주의사항

1. **variant와 className 충돌**
   - `className`으로 배경색을 지정하면 variant 색상이 덮어씌워질 수 있습니다
   - 커스텀 색상이 필요하면 새로운 variant를 추가하는 것을 권장합니다

2. **아이콘 크기**
   - 아이콘 크기는 버튼 size에 자동으로 맞춰지지 않습니다
   - 필요시 아이콘 컴포넌트에 직접 크기를 지정하세요

3. **로딩 상태**
   - loading 상태일 때 버튼은 자동으로 disabled 됩니다
   - 로딩 중에도 onClick 핸들러는 실행되지 않습니다

4. **ButtonGroup 내부**
   - ButtonGroup은 flex 레이아웃을 사용하므로 반응형 디자인 고려 필요
   - 많은 버튼이 있으면 자동으로 줄바꿈됩니다

---

## 🔧 TypeScript 타입 정의 (참고용)

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

interface IconButtonProps {
  icon: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  title?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

interface ButtonGroupProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right' | 'between'
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}
```

---

**작성일**: 2026-02-01  
**버전**: 1.0.0
