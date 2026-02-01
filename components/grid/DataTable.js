/**
 * DataTable 컴포넌트
 * 
 * @description AG-Grid 없이 사용할 수 있는 간단한 테이블 컴포넌트
 * - 최근 주문 목록, 주문 항목 테이블 등에 사용
 * - 정렬, 페이지네이션 기능 없음 (순수 표시용)
 * 
 * @param {Object} props
 * @param {Array} props.columns - 컬럼 정의 배열 [{ key, header, render?, className? }]
 * @param {Array} props.data - 테이블 데이터 배열
 * @param {string} [props.emptyMessage='데이터가 없습니다'] - 데이터 없을 때 메시지
 * @param {Function} [props.onRowClick] - 행 클릭 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스
 */

export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = '데이터가 없습니다',
  onRowClick,
  className = ''
}) {
  /**
   * 셀 값을 렌더링
   * render 함수가 있으면 사용, 없으면 기본 값 표시
   */
  const renderCell = (column, row, rowIndex) => {
    if (column.render) {
      return column.render(row[column.key], row, rowIndex)
    }
    return row[column.key]
  }

  /**
   * 행 클릭 핸들러
   */
  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index)
    }
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-4 font-semibold text-gray-700 ${
                  column.headerClassName || ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {data.length === 0 ? (
            /* 데이터 없을 때 */
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            /* 데이터 행 */
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`border-b transition ${
                  onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
                }`}
                onClick={() => handleRowClick(row, rowIndex)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-3 px-4 ${column.className || ''}`}
                  >
                    {renderCell(column, row, rowIndex)}
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
