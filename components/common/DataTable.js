/**
 * DataTable 컴포넌트
 * 
 * @description 간단한 데이터 테이블 컴포넌트
 * - AG-Grid까지 필요 없는 경우 사용
 * - 기본 HTML 테이블 기반
 * 
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 [{key, label, render}]
 * @param {Array} props.data - 행 데이터
 * @param {Function} props.onRowClick - 행 클릭 핸들러
 * @param {string} props.emptyMessage - 데이터 없을 때 메시지
 */

export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  className = ''
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {/* 헤더 */}
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={`
                  py-3 px-4 font-semibold text-gray-700
                  ${column.align === 'right' ? 'text-right' : ''}
                  ${column.align === 'center' ? 'text-center' : 'text-left'}
                `}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* 본문 */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  border-b transition
                  ${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className={`
                      py-3 px-4
                      ${column.align === 'right' ? 'text-right' : ''}
                      ${column.align === 'center' ? 'text-center' : 'text-left'}
                    `}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
