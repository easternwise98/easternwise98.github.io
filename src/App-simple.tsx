import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EasternWise98 구조공학 연구 블로그
          </h1>
          <p className="text-xl text-gray-600">
            구조공학과 건설기술에 대한 전문 연구 블로그
          </p>
        </header>
        
        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">고층건물의 내진 설계</h2>
            <p className="text-gray-600 mb-4">
              최근 국내외 고층건물 내진설계 기준의 변화와 성능기반 설계법의 적용 사례를 분석합니다.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>2024.12.20</span>
              <span>15분 읽기</span>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">강구조 접합부 설계</h2>
            <p className="text-gray-600 mb-4">
              강구조 건물에서 핵심적인 접합부 설계에 대해 볼트접합과 용접접합의 장단점을 비교 분석합니다.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>2024.12.18</span>
              <span>12분 읽기</span>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">MIDAS Civil 구조해석</h2>
            <p className="text-gray-600 mb-4">
              MIDAS Civil 프로그램을 이용한 교량 구조해석의 전 과정을 단계별로 설명합니다.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>2024.12.15</span>
              <span>20분 읽기</span>
            </div>
          </article>
        </main>
        
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2024 EasternWise98. 구조공학 연구에 대한 열정을 공유합니다.
          </p>
        </footer>
      </div>
    </div>
  );
}
