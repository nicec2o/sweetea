/**
 * DataGrid 컴포넌트
 * 
 * @description AG-Grid 공통 설정이 적용된 재사용 가능한 그리드 컴포넌트
 * - 기본 스타일 (ag-theme-alpine)
 * - 페이지네이션, 정렬, 필터 기본 활성화
 * - 한국어 로케일 지원
 * 
 * @param {Object} props
 * @param {Array} props.rowData - 그리드에 표시할 데이터 배열
 * @param {Array} props.columnDefs - 컬럼 정의 배열
 * @param {number} [props.height=600] - 그리드 높이 (픽셀)
 * @param {number} [props.pageSize=20] - 페이지당 행 수
 * @param {string|boolean} [props.rowSelection] - 행 선택 모드 ('single', 'multiple', false)
 * @param {Function} [props.onCellClicked] - 셀 클릭 이벤트 핸들러
 * @param {Function} [props.onSelectionChanged] - 선택 변경 이벤트 핸들러
 * @param {Object} [props.defaultColDef] - 기본 컬럼 정의 (오버라이드 가능)
 * @param {boolean} [props.animateRows=true] - 행 애니메이션 활성화
 * @param {Object} [props.gridRef] - 그리드 ref 객체
 */

import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const DataGrid = forwardRef(({
  rowData = [],
  columnDefs = [],
  height = 600,
  pageSize = 20,
  rowSelection = false,
  onCellClicked,
  onSelectionChanged,
  defaultColDef: customDefaultColDef,
  animateRows = true,
  suppressRowClickSelection = false,
  ...restProps
}, ref) => {
  const gridRef = useRef()

  // 외부에서 gridRef에 접근할 수 있도록 설정
  useImperativeHandle(ref, () => gridRef.current)

  /**
   * 기본 컬럼 정의
   * 커스텀 설정이 있으면 병합
   */
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    ...customDefaultColDef
  }), [customDefaultColDef])

  /**
   * 한국어 로케일 설정
   */
  const localeText = useMemo(() => ({
    // 페이지네이션
    page: '페이지',
    to: '~',
    of: '/',
    next: '다음',
    last: '마지막',
    first: '처음',
    previous: '이전',
    
    // 필터
    filterOoo: '필터...',
    applyFilter: '적용',
    resetFilter: '초기화',
    clearFilter: '지우기',
    equals: '같음',
    notEqual: '같지 않음',
    lessThan: '미만',
    greaterThan: '초과',
    lessThanOrEqual: '이하',
    greaterThanOrEqual: '이상',
    contains: '포함',
    notContains: '포함하지 않음',
    startsWith: '시작',
    endsWith: '끝',
    
    // 기타
    noRowsToShow: '표시할 데이터가 없습니다',
    loadingOoo: '로딩 중...',
    searchOoo: '검색...',
    selectAll: '전체 선택',
    
    // 컬럼 헤더
    pinColumn: '컬럼 고정',
    autosizeThiscolumn: '이 컬럼 자동 크기',
    autosizeAllColumns: '모든 컬럼 자동 크기',
    resetColumns: '컬럼 초기화',
  }), [])

  return (
    <div 
      className="ag-theme-alpine" 
      style={{ height: `${height}px`, width: '100%' }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={pageSize}
        rowSelection={rowSelection}
        suppressRowClickSelection={suppressRowClickSelection}
        animateRows={animateRows}
        onCellClicked={onCellClicked}
        onSelectionChanged={onSelectionChanged}
        localeText={localeText}
        {...restProps}
      />
    </div>
  )
})

DataGrid.displayName = 'DataGrid'

export default DataGrid
