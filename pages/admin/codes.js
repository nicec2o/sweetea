/**
 * 공통코드 관리 페이지
 * 
 * @description DataGrid를 사용한 공통코드 관리 (컴포넌트화)
 */

import { useRef, useMemo } from 'react'
import Head from 'next/head'

import DataGrid from '../../components/grid/DataGrid'
import AdminHeader from '../../components/admin/AdminHeader'
import CodeFormModal from '../../components/admin/CodeFormModal'
import useCodeManagement from '../../hooks/useCodeManagement'
import { getCodeColumnDefs } from '../../utils/gridColumnDefs'

export default function AdminCommonCodes() {
  const gridRef = useRef()
  
  // 커스텀 훅으로 상태 관리 로직 분리
  const {
    codes,
    loading,
    showModal,
    editingCode,
    handleSubmit,
    handleEdit,
    handleDelete,
    openAddModal,
    closeModal
  } = useCodeManagement()

  // 컬럼 정의를 유틸 함수로 분리
  const columnDefs = useMemo(() => getCodeColumnDefs(), [])

  const onCellClicked = (event) => {
    const target = event.event.target
    
    if (target.classList.contains('edit-code-btn')) {
      const id = parseInt(target.dataset.id)
      const code = codes.find(c => c.id === id)
      handleEdit(code)
    } else if (target.classList.contains('delete-code-btn')) {
      const id = parseInt(target.dataset.id)
      handleDelete(id)
    }
  }

  return (
    <>
      <Head>
        <title>공통코드 관리 - SweeTea Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* 공통 헤더 컴포넌트 사용 */}
        <AdminHeader title="공통코드 관리" currentPage="codes" />

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">공통코드 목록</h2>
              <button
                onClick={openAddModal}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                + 코드 추가
              </button>
            </div>

            {/* DataGrid 사용 */}
            <DataGrid
              ref={gridRef}
              rowData={codes}
              columnDefs={columnDefs}
              height={600}
              pageSize={20}
              onCellClicked={onCellClicked}
            />
          </div>
        </main>

        {/* 코드 폼 모달 컴포넌트 */}
        <CodeFormModal
          isOpen={showModal}
          onClose={closeModal}
          editingCode={editingCode}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  )
}
