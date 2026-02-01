/**
 * Button 컴포넌트 적용 예제
 * 
 * products.js 페이지에서 Button 컴포넌트 사용 예시
 */

// Before (기존 HTML 버튼)
<button
  onClick={() => {
    setEditingProduct(null)
    setFormData({...})
    setShowModal(true)
  }}
  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
>
  + 상품 추가
</button>

// After (Button 컴포넌트)
import { Button } from '../../components/common'

<Button
  variant="primary"
  icon={<span>➕</span>}
  onClick={() => {
    setEditingProduct(null)
    setFormData({...})
    setShowModal(true)
  }}
>
  상품 추가
</Button>

// ---

// Before (모달 취소/저장 버튼)
<div className="flex justify-end gap-3 mt-6">
  <button
    type="button"
    onClick={() => setShowModal(false)}
    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
  >
    취소
  </button>
  <button
    type="submit"
    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
  >
    {editingProduct ? '수정' : '등록'}
  </button>
</div>

// After (ButtonGroup + Button)
import { Button, ButtonGroup } from '../../components/common'

<ButtonGroup align="right" className="mt-6">
  <Button variant="outline" onClick={() => setShowModal(false)}>
    취소
  </Button>
  <Button type="submit" variant="primary">
    {editingProduct ? '수정' : '등록'}
  </Button>
</ButtonGroup>

// ---

// Before (그리드 액션 버튼 - GridActionButtons.js)
<button 
  onClick={() => onEdit(data)}
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  수정
</button>
<button 
  onClick={() => onDelete(data.id)}
  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
>
  삭제
</button>

// After (IconButton 또는 Button)
import { IconButton, ButtonGroup } from '../../components/common'

<ButtonGroup spacing="sm">
  <IconButton 
    icon={<span>✏️</span>}
    variant="ghost"
    title="수정"
    onClick={() => onEdit(data)}
  />
  <IconButton 
    icon={<span>🗑️</span>}
    variant="ghost"
    title="삭제"
    onClick={() => onDelete(data.id)}
  />
</ButtonGroup>

// 또는 텍스트 버튼
<ButtonGroup spacing="sm">
  <Button size="sm" variant="primary" onClick={() => onEdit(data)}>
    수정
  </Button>
  <Button size="sm" variant="danger" onClick={() => onDelete(data.id)}>
    삭제
  </Button>
</ButtonGroup>
