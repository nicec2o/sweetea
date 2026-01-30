/**
 * 디버그 페이지 - API 연결 테스트
 */

import { useState } from 'react'
import Head from 'next/head'

export default function Debug() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint) => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log(`Testing: ${endpoint}`)
      const response = await fetch(endpoint)
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      setResult({
        success: true,
        status: response.status,
        data: data
      })
    } catch (error) {
      console.error('Test error:', error)
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>API Debug - SweeTea</title>
      </Head>

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">API 연결 테스트</h1>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => testAPI('/api/products')}
              className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              disabled={loading}
            >
              상품 목록 조회
            </button>
            
            <button
              onClick={() => testAPI('/api/products?category=MILK_TEA')}
              className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              밀크티 카테고리 조회
            </button>
          </div>

          {loading && (
            <div className="text-center p-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4">테스트 중...</p>
            </div>
          )}

          {result && (
            <div className={`p-6 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <h2 className="text-xl font-bold mb-4">
                {result.success ? '✅ 성공' : '❌ 실패'}
              </h2>
              
              {result.status && (
                <p className="mb-2">
                  <strong>상태 코드:</strong> {result.status}
                </p>
              )}
              
              {result.data && (
                <div className="mb-2">
                  <strong>응답 데이터:</strong>
                  <pre className="mt-2 p-4 bg-white rounded overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <p className="text-red-600">
                  <strong>에러:</strong> {result.error}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 p-6 bg-white rounded-lg">
            <h2 className="text-xl font-bold mb-4">브라우저 콘솔</h2>
            <p className="text-gray-600">
              F12 키를 눌러 개발자 도구를 열고 Console 탭에서 상세한 로그를 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
