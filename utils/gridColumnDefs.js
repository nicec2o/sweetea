/**
 * 공통코드 그리드 컬럼 정의
 */

export function getCodeColumnDefs() {
  return [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80 
    },
    { 
      field: 'code_group', 
      headerName: '코드그룹', 
      width: 150 
    },
    { 
      field: 'code', 
      headerName: '코드', 
      width: 150 
    },
    { 
      field: 'code_name', 
      headerName: '코드명(KO)', 
      width: 150 
    },
    { 
      field: 'code_name_en', 
      headerName: '코드명(EN)', 
      width: 150 
    },
    { 
      field: 'code_name_ja', 
      headerName: '코드명(JA)', 
      width: 150 
    },
    { 
      field: 'sort_order', 
      headerName: '정렬순서', 
      width: 100 
    },
    { 
      field: 'use_yn', 
      headerName: '사용여부', 
      width: 100,
      cellRenderer: (params) => {
        const isUsed = params.value === 'Y'
        return `<span class="font-semibold ${isUsed ? 'text-green-600' : 'text-red-600'}">
          ${isUsed ? '사용' : '미사용'}
        </span>`
      }
    },
    {
      field: 'actions',
      headerName: '관리',
      width: 200,
      cellRenderer: (params) => {
        return `
          <div class="flex gap-2 items-center h-full">
            <button
              class="edit-code-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              data-id="${params.data.id}"
            >
              수정
            </button>
            <button
              class="delete-code-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              data-id="${params.data.id}"
            >
              삭제
            </button>
          </div>
        `
      }
    }
  ]
}
