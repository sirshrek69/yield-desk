'use client'

import { useState, useEffect } from 'react'
import ReactCountryFlag from 'react-country-flag'

interface PortfolioItem {
  id: string
  productId: string
  productName: string
  amount: number
  price: number
  ytmPct?: number
  timestamp: string
  status: 'committed' | 'active' | 'matured'
}

interface Product {
  id: string
  category: string
  name: string
  issuer: string
  currency: string
  rating?: { 
    sp?: string; 
    moodys?: string; 
    fitch?: string;
    composite?: string;
    asOf?: string;
    scope?: string;
  } | null
  couponType: string
  couponRatePct: number
  couponFrequency: string
  maturityDate: string
  priceClean: number
  ytmPct: number
  minInvestment: number
  increment: number
  faceCurrency: string
  issuerMinFace: number | null
  faceIncrement: number | null
  countryCode: string
  minInvestmentDisplay: {
    type: 'issuer' | 'platform'
    issuerMinUSD?: number
    incrementUSD?: number
    issuerMinFace?: number
    faceIncrement?: number
    faceCurrency?: string
    platformMinUSD?: number
  }
  tenor?: string
  isOnTheRun?: boolean
  issuerTicker?: string
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [walletBalance, setWalletBalance] = useState(10000)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<PortfolioItem | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [productYTMData, setProductYTMData] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'committed' | 'active' | 'matured'>('committed')

  useEffect(() => {
    // Load portfolio and wallet balance from localStorage
    const savedPortfolio = localStorage.getItem('portfolio')
    const savedWalletBalance = localStorage.getItem('walletBalance')
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
    
    if (savedWalletBalance) {
      setWalletBalance(parseFloat(savedWalletBalance))
    }

    // Fetch live YTM data from markets
    fetchYTMData()
  }, [])

  const fetchYTMData = async () => {
    try {
      const response = await fetch('http://localhost:4001/products')
      if (!response.ok) return
      
      const data = await response.json()
      const ytmData: Record<string, number> = {}
      
      data.products.forEach((product: Product) => {
        ytmData[product.id] = product.ytmPct
      })
      
      setProductYTMData(ytmData)
    } catch (error) {
      console.error('Error fetching YTM data:', error)
    }
  }

  const calculateEarnedYield = (position: PortfolioItem): number => {
    const ytmPct = position.ytmPct || productYTMData[position.productId] || 0
    if (!ytmPct) return 0
    
    const commitmentDate = new Date(position.timestamp)
    const currentDate = new Date()
    const daysHeld = Math.floor((currentDate.getTime() - commitmentDate.getTime()) / (1000 * 60 * 60 * 24))
    const yearsHeld = daysHeld / 365
    
    // For showcase purposes, give more realistic earned yield for active and matured positions
    if (position.status === 'active') {
      // Active positions: simulate 6-12 months of holding
      const showcaseYears = Math.max(0.5, Math.min(1.0, yearsHeld + 0.3))
      const earnedYield = position.amount * (ytmPct / 100) * showcaseYears
      return Math.max(0, earnedYield)
    } else if (position.status === 'matured') {
      // Matured positions: simulate full term holding with some bonus
      const showcaseYears = Math.max(1.0, yearsHeld + 0.8)
      const earnedYield = position.amount * (ytmPct / 100) * showcaseYears
      return Math.max(0, earnedYield)
    } else {
      // Committed positions: actual time held
      const earnedYield = position.amount * (ytmPct / 100) * yearsHeld
      return Math.max(0, earnedYield)
    }
  }

  // Calculate portfolio data
  const committedPositions = portfolio.filter(p => p.status === 'committed')
  const activePositions = portfolio.filter(p => p.status === 'active')
  const maturedPositions = portfolio.filter(p => p.status === 'matured')

  const totalCommitted = committedPositions.reduce((sum, p) => sum + p.amount, 0)
  const totalActive = activePositions.reduce((sum, p) => sum + p.amount, 0)
  const totalMatured = maturedPositions.reduce((sum, p) => sum + p.amount, 0)
  const totalValue = totalCommitted + totalActive + totalMatured
  
  // Calculate total earned yield from all positions
  const totalEarnedYield = [...committedPositions, ...activePositions, ...maturedPositions]
    .reduce((sum, p) => sum + calculateEarnedYield(p), 0)

  const portfolioData = {
    totalValue,
    totalCommitted,
    totalActive,
    totalMatured,
    totalPnl: 0, // Will be calculated when positions become active
    totalYield: 0, // Will be calculated when positions become active
    totalEarnedYield
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRatingColor = (rating: string) => {
    if (!rating || rating === 'N/A') return 'bg-gray-100 text-gray-600'
    
    if (rating.startsWith('AAA')) return 'bg-green-100 text-green-800'
    if (rating.startsWith('AA')) return 'bg-blue-100 text-blue-800'
    if (rating.startsWith('A')) return 'bg-purple-100 text-purple-800'
    if (rating.startsWith('BBB')) return 'bg-yellow-100 text-yellow-800'
    if (rating.startsWith('BB')) return 'bg-orange-100 text-orange-800'
    if (rating.startsWith('B')) return 'bg-red-100 text-red-800'
    if (rating.startsWith('CCC')) return 'bg-red-200 text-red-900'
    
    return 'bg-gray-100 text-gray-600'
  }

  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    try {
      const response = await fetch(`http://localhost:4001/product/${productId}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.product
    } catch (error) {
      console.error('Error fetching product details:', error)
      return null
    }
  }

  const handleViewDetails = async (position: PortfolioItem) => {
    const product = await fetchProductDetails(position.productId)
    if (product) {
      setSelectedProduct(product)
      setIsDetailsModalOpen(true)
    } else {
      alert('Unable to fetch product details')
    }
  }

  const handleWithdraw = (position: PortfolioItem) => {
    setSelectedPosition(position)
    setWithdrawAmount('')
    setIsWithdrawModalOpen(true)
  }

  const handleWithdrawSubmit = () => {
    if (!selectedPosition) return

    const amount = parseFloat(withdrawAmount)
    if (amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amount > selectedPosition.amount) {
      alert('Cannot withdraw more than committed amount')
      return
    }

    // Update portfolio - reduce amount or remove if fully withdrawn
    setPortfolio(prev => {
      const updated = prev.map(p => {
        if (p.id === selectedPosition.id) {
          const newAmount = p.amount - amount
          if (newAmount <= 0) {
            return null // Remove position
          }
          return { ...p, amount: newAmount }
        }
        return p
      }).filter(Boolean) as PortfolioItem[]

      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(updated))
      return updated
    })

    // Update wallet balance
    const newBalance = walletBalance + amount
    setWalletBalance(newBalance)
    localStorage.setItem('walletBalance', newBalance.toString())

    // Close modal
    setIsWithdrawModalOpen(false)
    setSelectedPosition(null)
    setWithdrawAmount('')

    alert(`Successfully withdrew ${formatCurrency(amount)}`)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedProduct(null)
  }

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false)
    setSelectedPosition(null)
    setWithdrawAmount('')
  }

  const addDemoPositions = () => {
    // Add Poland and Canada positions if they don't exist
    setPortfolio(prev => {
      const hasPoland = prev.some(p => p.productId === 'PL_PSZ_10Y_OTR')
      const hasCanada = prev.some(p => p.productId === 'CA_GOC_10Y_OTR')
      
      const newPositions = []
      
      if (!hasPoland) {
        newPositions.push({
          id: `commit_${Date.now()}_poland`,
          productId: 'PL_PSZ_10Y_OTR',
          productName: 'Poland 10Y Benchmark (On‑the‑Run)',
          amount: 5000,
          price: 98.5,
          ytmPct: 5.25,
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          status: 'committed' as const
        })
      }
      
      if (!hasCanada) {
        newPositions.push({
          id: `commit_${Date.now()}_canada`,
          productId: 'CA_GOC_10Y_OTR',
          productName: 'Canada GoC 10Y (On‑the‑Run)',
          amount: 7500,
          price: 99.2,
          ytmPct: 4.85,
          timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          status: 'committed' as const
        })
      }
      
      const updated = [...prev, ...newPositions]
      localStorage.setItem('portfolio', JSON.stringify(updated))
      return updated
    })
  }

  const updatePortfolioStatuses = () => {
    // Update specific positions to active and matured for demo purposes
    setPortfolio(prev => {
      const updated = prev.map((position) => {
        // Move Poland 10Y Benchmark to active
        if ((position.productName.includes('Poland 10Y Benchmark') || position.productId === 'PL_PSZ_10Y_OTR') && position.status === 'committed') {
          return { ...position, status: 'active' as const }
        }
        // Move Canada GOC 10Y to matured
        if ((position.productName.includes('Canada GoC 10Y') || position.productId === 'CA_GOC_10Y_OTR') && position.status === 'committed') {
          return { ...position, status: 'matured' as const }
        }
        return position
      })
      
      // Save to localStorage
      localStorage.setItem('portfolio', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Yield Desk Portfolio</h1>
              <p className="text-muted-foreground mt-1">
                Track your tokenised fixed income investments
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors">
                Export CSV
              </button>
              <button 
                onClick={addDemoPositions}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
              >
                Add Demo Positions
              </button>
              <button 
                onClick={updatePortfolioStatuses}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
              >
                Demo Status Update
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors">
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Wallet Balance</h3>
              <div className="text-2xl">💳</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(walletBalance)}</div>
            <div className="text-xs text-muted-foreground">Available USDC</div>
          </div>
          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h3>
              <div className="text-2xl">💰</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              ↗ +{formatCurrency(portfolioData.totalPnl)}
            </div>
          </div>

          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Committed (Pending)</h3>
              <div className="text-2xl">🎯</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalCommitted)}</div>
            <div className="text-xs text-muted-foreground">Awaiting finalization</div>
          </div>

          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Holdings</h3>
              <div className="text-2xl">📈</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalActive)}</div>
            <div className="text-xs text-brand-accent">{formatPercentage(portfolioData.totalYield)} yield</div>
          </div>

          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Matured/Closed</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalMatured)}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Earned Yield</h3>
              <div className="text-2xl">📈</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(portfolioData.totalEarnedYield)}</div>
            <div className="text-xs text-muted-foreground">From committed positions</div>
          </div>
        </div>
      </div>

      {/* Portfolio Tabs */}
      <div className="container mx-auto px-4 pb-6">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('committed')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'committed' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Committed (Pending)
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                {committedPositions.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'active' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Active (Live)
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                {activePositions.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('matured')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'matured' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Matured/Closed
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                {maturedPositions.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {activeTab === 'committed' && 'Committed Positions'}
                {activeTab === 'active' && 'Active Positions'}
                {activeTab === 'matured' && 'Matured/Closed Positions'}
              </h2>
              <div className="space-y-4">
                {(() => {
                  const positions = activeTab === 'committed' ? committedPositions : 
                                  activeTab === 'active' ? activePositions : 
                                  maturedPositions;
                  
                  const emptyState = {
                    committed: { icon: '📝', title: 'No committed positions yet', subtitle: 'Visit the Markets page to commit funds to bonds' },
                    active: { icon: '📈', title: 'No active positions yet', subtitle: 'Positions become active after finalization' },
                    matured: { icon: '📊', title: 'No matured positions yet', subtitle: 'Positions mature at their maturity date' }
                  };
                  
                  const statusInfo = {
                    committed: { badge: 'Committed', badgeColor: 'bg-blue-500', statusText: 'Pending', dateLabel: 'Commitment Date' },
                    active: { badge: 'Active', badgeColor: 'bg-green-500', statusText: 'Live', dateLabel: 'Start Date' },
                    matured: { badge: 'Matured', badgeColor: 'bg-gray-500', statusText: 'Completed', dateLabel: 'Maturity Date' }
                  };
                  
                  if (positions.length === 0) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-2">{emptyState[activeTab].icon}</div>
                        <p>{emptyState[activeTab].title}</p>
                        <p className="text-sm">{emptyState[activeTab].subtitle}</p>
                      </div>
                    );
                  }
                  
                  return positions.map((position) => (
                    <div key={position.id} className="card-hover p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{position.productName}</h3>
                          <p className="text-sm text-muted-foreground">Product ID: {position.productId}</p>
                        </div>
                        <span className={`px-2 py-1 text-white text-xs rounded-full ${statusInfo[activeTab].badgeColor}`}>
                          {statusInfo[activeTab].badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <div className="font-medium">
                            {formatCurrency(position.amount, 'USD')}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <div className="font-medium">
                            {formatCurrency(position.price, 'USD')}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">YTM:</span>
                          <div className="font-medium text-brand-accent">
                            {formatPercentage(position.ytmPct || productYTMData[position.productId])}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Earned Yield:</span>
                          <div className="font-medium text-green-600">
                            {formatCurrency(calculateEarnedYield(position))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{statusInfo[activeTab].dateLabel}:</span>
                          <div className="font-medium">{formatDate(position.timestamp)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <div className="font-medium">{statusInfo[activeTab].statusText}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(position)}
                            className="px-3 py-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded text-sm transition-colors"
                          >
                            View Details
                          </button>
                          {activeTab === 'committed' && (
                            <button 
                              onClick={() => handleWithdraw(position)}
                              className="px-3 py-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded text-sm transition-colors"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Details Modal */}
      {isDetailsModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Product Details</h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Product Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                  {selectedProduct.category === 'Government Bonds' && (
                    <ReactCountryFlag
                      countryCode={selectedProduct.countryCode}
                      svg
                      style={{
                        width: '20px',
                        height: '15px',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                  {selectedProduct.category === 'Inflation-Protected' && (
                    <ReactCountryFlag
                      countryCode={selectedProduct.countryCode}
                      svg
                      style={{
                        width: '20px',
                        height: '15px',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                  {selectedProduct.category === 'Corporate Bonds' && selectedProduct.issuerTicker && (
                    <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                      {selectedProduct.issuerTicker.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{selectedProduct.issuer}</p>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="font-medium">{selectedProduct.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    {selectedProduct.rating ? (
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(selectedProduct.rating.composite)}`}
                        title={`Moody's: ${selectedProduct.rating.moodys || 'N/A'}\nS&P: ${selectedProduct.rating.sp || 'N/A'}\nFitch: ${selectedProduct.rating.fitch || 'N/A'}\nAs of: ${selectedProduct.rating.asOf}`}
                      >
                        {selectedProduct.rating.composite}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coupon Type:</span>
                    <span className="font-medium">{selectedProduct.couponType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coupon Rate:</span>
                    <span className="font-medium">{formatPercentage(selectedProduct.couponRatePct)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium">{selectedProduct.couponFrequency}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maturity Date:</span>
                    <span className="font-medium">{formatDate(selectedProduct.maturityDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price (per 100):</span>
                    <span className="font-medium">{formatCurrency(selectedProduct.priceClean, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yield to Maturity:</span>
                    <span className="font-medium text-brand-accent">{formatPercentage(selectedProduct.ytmPct)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Investment:</span>
                    <span className="font-medium">{formatCurrency(selectedProduct.minInvestment, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Increment:</span>
                    <span className="font-medium">{formatCurrency(selectedProduct.increment, 'USD')}</span>
                  </div>
                  {selectedProduct.tenor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenor:</span>
                      <span className="font-medium">{selectedProduct.tenor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && selectedPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Withdraw Funds</h2>
                <button
                  onClick={closeWithdrawModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedPosition.productName}</h3>
                  <p className="text-sm text-muted-foreground">Product ID: {selectedPosition.productId}</p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Committed Amount:</span>
                    <span className="font-semibold">{formatCurrency(selectedPosition.amount)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Withdrawal Amount (USD)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    min="0"
                    max={selectedPosition.amount}
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {formatCurrency(selectedPosition.amount)}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeWithdrawModal}
                    className="flex-1 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawSubmit}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
