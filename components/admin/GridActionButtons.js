import { useState } from 'react';

export function ActionButtons({ data, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(data.id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-center h-full">
      <button
        onClick={() => onEdit(data)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition disabled:opacity-50"
        disabled={isDeleting}
      >
        수정
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition disabled:opacity-50"
      >
        {isDeleting ? '...' : '삭제'}
      </button>
    </div>
  );
}

export function StatusSelect({ data, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'PENDING', label: '대기중' },
    { value: 'CONFIRMED', label: '확인됨' },
    { value: 'PREPARING', label: '준비중' },
    { value: 'SHIPPING', label: '배송중' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'CANCELLED', label: '취소됨' }
  ];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === data.status || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusChange(data.id, newStatus);
    } catch (error) {
      console.error('Status change error:', error);
      e.target.value = data.status;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select 
      value={data.status}
      onChange={handleChange}
      disabled={isUpdating}
      className="px-2 py-1 border rounded disabled:opacity-50"
    >
      {statusOptions.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default ActionButtons;
