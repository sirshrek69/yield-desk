'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The leading platform for<br />
              <span className="text-brand-primary">tokenized fixed income</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Access institutional-grade government bonds, corporate bonds, and inflation-protected securities 
              with transparent pricing and instant settlement onchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/markets" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg inline-flex items-center justify-center"
              >
                Start Investing
              </Link>
              <Link 
                href="/portfolio" 
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-medium transition-colors text-lg inline-flex items-center justify-center"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">💰</span>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">$646M</div>
              </div>
              <div className="text-gray-600 text-sm md:text-base">Total Assets Financed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🔗</span>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">1,531</div>
              </div>
              <div className="text-gray-600 text-sm md:text-base">Assets Tokenized</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">📈</span>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">4.2%</div>
              </div>
              <div className="text-gray-600 text-sm md:text-base">Average YTM</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">⏰</span>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">24/7</div>
              </div>
              <div className="text-gray-600 text-sm md:text-base">Trading Hours</div>
            </div>
          </div>

          {/* Floating Corporate Logos */}
          <div className="mt-16 overflow-hidden">
            <div className="flex animate-scroll gap-8 md:gap-12">
              {/* First set of logos */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/bankofamerica.svg"
                    alt="Bank of America logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">BAC</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/goldmansachs.svg"
                    alt="Goldman Sachs logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">GS</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/wellsfargo.svg"
                    alt="Wells Fargo logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">WFC</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/tesla.svg"
                    alt="Tesla logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">TSLA</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/apple.svg"
                    alt="Apple logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">AAPL</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/google.svg"
                    alt="Alphabet logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">GOOGL</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/bmw.svg"
                    alt="BMW logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">BMW</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/siemens.svg"
                    alt="Siemens logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">SIE</span></div>'
                    }}
                  />
                </div>
              </div>
              
              {/* Duplicate set for seamless infinite loop */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/bankofamerica.svg"
                    alt="Bank of America logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">BAC</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/goldmansachs.svg"
                    alt="Goldman Sachs logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">GS</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/wellsfargo.svg"
                    alt="Wells Fargo logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">WFC</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/tesla.svg"
                    alt="Tesla logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">TSLA</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/apple.svg"
                    alt="Apple logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">AAPL</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/google.svg"
                    alt="Alphabet logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">GOOGL</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/bmw.svg"
                    alt="BMW logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">BMW</span></div>'
                    }}
                  />
                </div>
                <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/siemens.svg"
                    alt="Siemens logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><span class="text-gray-400 font-bold text-xs">SIE</span></div>'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Access world-class fixed income products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Invest in tokenized bonds from leading governments and corporations with institutional-grade security.
            </p>
          </div>

          {/* Products Carousel */}
          <div className="relative">
            {/* Left Scroll Button */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
              onClick={() => {
                const container = document.getElementById('products-carousel')
                if (container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' })
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Scroll Button */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
              onClick={() => {
                const container = document.getElementById('products-carousel')
                if (container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' })
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Products Container */}
            <div 
              id="products-carousel"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* U.S. Treasury Bills 3M */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🇺🇸</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">U.S. Treasury Bills 3M</h3>
                <p className="text-gray-600 mb-6">U.S. Treasury</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">4.85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AAA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">$100</span>
                  </div>
                </div>
              </div>

              {/* Apple 5Y 4.25% */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🍎</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Upcoming</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Apple 5Y 4.25%</h3>
                <p className="text-gray-600 mb-6">Apple Inc.</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">4.68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AA+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">$1,000</span>
                  </div>
                </div>
              </div>

              {/* U.S. TIPS 10Y */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🛡️</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">U.S. TIPS 10Y</h3>
                <p className="text-gray-600 mb-6">U.S. Treasury</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">1.10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AAA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">$100</span>
                  </div>
                </div>
              </div>

              {/* Germany Bund 10Y */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🇩🇪</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Germany Bund 10Y</h3>
                <p className="text-gray-600 mb-6">German Government</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">2.45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AAA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">€1,000</span>
                  </div>
                </div>
              </div>

              {/* Tesla 7Y 5.5% */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">⚡</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tesla 7Y 5.5%</h3>
                <p className="text-gray-600 mb-6">Tesla Inc.</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">5.25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">BB+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">$1,000</span>
                  </div>
                </div>
              </div>

              {/* UK Gilt 10Y */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🇬🇧</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">UK Gilt 10Y</h3>
                <p className="text-gray-600 mb-6">UK Government</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">3.85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">£100</span>
                  </div>
                </div>
              </div>

              {/* JPMorgan 10Y 4.8% */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🏦</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">JPMorgan 10Y 4.8%</h3>
                <p className="text-gray-600 mb-6">JPMorgan Chase</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">4.65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">A+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">$1,000</span>
                  </div>
                </div>
              </div>

              {/* France OAT 10Y */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🇫🇷</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Open</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">France OAT 10Y</h3>
                <p className="text-gray-600 mb-6">French Government</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM</span>
                    <span className="font-semibold text-brand-primary">2.95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-gray-900">AA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-900">€1,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/markets" 
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Yield Desk */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Yield Desk?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Institutional-grade fixed income products with blockchain transparency and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Institutional Grade</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access bonds from leading governments and corporations with AAA to investment-grade ratings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Settlement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Blockchain-powered settlement eliminates traditional T+2 settlement delays.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time pricing with full transparency on bond characteristics and yield calculations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Low Minimums</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Start investing with as little as $100, making institutional-grade bonds accessible to all.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="bg-brand-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to start investing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of investors accessing institutional-grade fixed income products onchain.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/markets" 
              className="bg-white hover:bg-gray-100 text-brand-primary px-8 py-4 rounded-lg font-medium transition-colors text-lg"
            >
              Explore Markets
            </Link>
            <Link 
              href="/portfolio" 
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
