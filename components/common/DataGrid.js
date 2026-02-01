/**
 * DataGrid 컴포넌트
 * 
 * @description AG-Grid 공통 설정이 적용된 래퍼
 * - 기본 스타일 (ag-theme-alpine)
 * - 페이지네이션, 정렬, 필터 기본 활성화
 * 
 * @param {Object} props
 * @param {Array} props.data - 행 데이터
 * @param {Array} props.columns - 컬럼 정의
 * @param {number} props.height - 그리드 높이
 * @param {number} props.pageSize - 페이지당 행 수
 * @param {Function} props.onCellClicked - 셀 클릭 핸들러
 * @param {string} props.rowSelection - 행 선택 모드 (single, multiple)
 */

import { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default function DataGrid({
  data = [],
  columns = [],
  height = 600,
  pageSize = 20,
  onCellClicked,
  rowSelection,
  className = '',
  ...rest
}) {
  const gridRef = useRef()

  // 기본 컬럼 설정
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  return (
    <div 
      className={`ag-theme-alpine ${className}`}
      style={{ height, width: '100%' }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={pageSize}
        animateRows={true}
        onCellClicked={onCellClicked}
        rowSelection={rowSelection}
        {...rest}
      />
    </div>
  )
}
