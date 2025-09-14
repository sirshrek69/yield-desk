'use client'

import { useState, useEffect } from 'react'
import ReactCountryFlag from 'react-country-flag'

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
  // New minimum investment fields
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
  // New expansion fields
  tenor?: string
  isOnTheRun?: boolean
  issuerTicker?: string
  raise: {
    status: string
    softCap: number
    hardCap: number
    amountCommitted: number
    start: string
    end: string
  }
  docs?: { label: string; url: string }[]
}

interface Filters {
  rating: string
  tenor: string
  ytmSort: string
  maturitySort: string
  raiseSizeSort: string
  minCommitmentSort: string
}

interface PrimaryDeal {
  id: string
  issuerName: string
  issuerLogoSlug: string
  currency: string
  couponPct: number
  tenorYears: number
  targetAmountUSD: number
  raisedSoFarUSD: number
  status: 'upcoming' | 'open' | 'closed'
  asOf: string
  minOrderUSD?: number
  docsUrl?: string
  disclaimer?: string
}

interface CompanyInfo {
  description: string
  businessModel: string
  keyMetrics: {
    marketCap?: string
    revenue?: string
    employees?: string
    founded?: string
  }
  keyHighlights: string[]
}

export default function MarketsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [primaryDeals, setPrimaryDeals] = useState<PrimaryDeal[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedPrimaryDeal, setSelectedPrimaryDeal] = useState<PrimaryDeal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrimaryModalOpen, setIsPrimaryModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(10000) // Starting balance
  const [portfolio, setPortfolio] = useState<Array<{
    id: string
    productId: string
    productName: string
    amount: number
    price: number
    timestamp: string
    status: 'committed' | 'active' | 'matured'
  }>>([])
  const [filters, setFilters] = useState<Filters>({
    rating: 'All',
    tenor: 'All',
    ytmSort: 'None',
    maturitySort: 'None',
    raiseSizeSort: 'None',
    minCommitmentSort: 'None'
  })

  useEffect(() => {
    // Fetch products
    fetch('http://localhost:4001/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
      })

    // Fetch primary deals
    fetch('http://localhost:4001/primary-deals')
      .then(res => res.json())
      .then(data => {
        setPrimaryDeals(data.deals)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch primary deals:', err)
        setLoading(false)
      })

    // Load portfolio and wallet balance from localStorage
    const savedPortfolio = localStorage.getItem('portfolio')
    const savedWalletBalance = localStorage.getItem('walletBalance')
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
    
    if (savedWalletBalance) {
      setWalletBalance(parseFloat(savedWalletBalance))
    }
  }, [])

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category))), 'Primary Corporate Issuance']
  
  const applyFilters = (productList: Product[]) => {
    return productList.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false
      }
      
      // Rating filter
      if (filters.rating !== 'All') {
        const productRating = product.rating?.sp || product.rating?.moodys || 'N/A'
        if (productRating !== filters.rating) {
          return false
        }
      }
      
      // Tenor filter
      if (filters.tenor !== 'All' && product.tenor !== filters.tenor) {
        return false
      }
      
      return true
    })
  }

  const applyPrimaryDealFilters = (dealList: PrimaryDeal[]) => {
    return dealList.filter(deal => {
      // Tenor filter for primary deals
      if (filters.tenor !== 'All' && deal.tenorYears.toString() !== filters.tenor.replace('Y', '')) {
        return false
      }
      
      return true
    })
  }
  
  const filteredProducts = applyFilters(products).sort((a, b) => {
    // YTM sorting
    if (filters.ytmSort === 'Lowest') {
      return a.ytmPct - b.ytmPct // Ascending (lowest first)
    } else if (filters.ytmSort === 'Highest') {
      return b.ytmPct - a.ytmPct // Descending (highest first)
    }
    
    // Maturity sorting
    if (filters.maturitySort === 'Closest') {
      const dateA = new Date(a.maturityDate).getTime()
      const dateB = new Date(b.maturityDate).getTime()
      return dateA - dateB // Ascending (closest first)
    } else if (filters.maturitySort === 'Farthest') {
      const dateA = new Date(a.maturityDate).getTime()
      const dateB = new Date(b.maturityDate).getTime()
      return dateB - dateA // Descending (farthest first)
    }
    
    // Raise size sorting
    if (filters.raiseSizeSort === 'Lowest') {
      return a.raise.hardCap - b.raise.hardCap // Ascending (lowest first)
    } else if (filters.raiseSizeSort === 'Highest') {
      return b.raise.hardCap - a.raise.hardCap // Descending (highest first)
    }
    
    // Min commitment sorting
    if (filters.minCommitmentSort === 'Lowest') {
      return a.minInvestment - b.minInvestment // Ascending (lowest first)
    } else if (filters.minCommitmentSort === 'Highest') {
      return b.minInvestment - a.minInvestment // Descending (highest first)
    }
    
    
    return 0 // No sorting
  })

  const filteredPrimaryDeals = applyPrimaryDealFilters(primaryDeals)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Currency conversion rates (same as backend)
  const CURRENCY_RATES: Record<string, number> = {
    'USD': 1.0,
    'EUR': 1.08,
    'GBP': 1.27,
    'JPY': 0.0067,
    'CAD': 0.74,
    'AUD': 0.66,
    'NZD': 0.61,
    'CHF': 1.12,
    'SEK': 0.093,
    'DKK': 0.145,
    'NOK': 0.093,
    'PLN': 0.25,
    'MXN': 0.059,
    'BRL': 0.20,
    'CLP': 0.0011,
    'ILS': 0.27,
  }

  const convertToLocalCurrency = (usdAmount: number, targetCurrency: string): number => {
    const rate = CURRENCY_RATES[targetCurrency] || 1.0
    return usdAmount / rate
  }

  const formatPriceDisplay = (priceUSD: number, localCurrency: string) => {
    const localPrice = convertToLocalCurrency(priceUSD, localCurrency)
    return {
      usd: formatCurrency(priceUSD, 'USD'),
      local: formatCurrency(localPrice, localCurrency)
    }
  }

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`

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

  const getStatusColor = (status: string) => {
    if (status === 'open') return 'bg-green-100 text-green-800'
    if (status === 'upcoming') return 'bg-blue-100 text-blue-800'
    if (status === 'closed') return 'bg-gray-100 text-gray-800'
    return 'bg-gray-100 text-gray-600'
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`
    }
    return `$${num.toFixed(0)}`
  }

  const getCompanyInfo = (issuerName: string): CompanyInfo => {
    const companyData: Record<string, CompanyInfo> = {
      'Tesla Inc.': {
        description: "Tesla is a leading electric vehicle (EV) manufacturer and clean energy company. The company designs, develops, manufactures, and sells fully electric vehicles, energy generation and storage systems, and solar panel manufacturing.",
        businessModel: "Tesla operates on a direct-to-consumer model, selling vehicles through company-owned stores and online. Revenue streams include vehicle sales, energy generation and storage, and services including charging infrastructure.",
        keyMetrics: {
          marketCap: "$750B",
          revenue: "$96.8B (2023)",
          employees: "140,000+",
          founded: "2003"
        },
        keyHighlights: [
          "Leading global EV market share with 20%+ growth in deliveries",
          "Expanding manufacturing footprint with Gigafactories worldwide",
          "Pioneering autonomous driving technology with Full Self-Driving (FSD)",
          "Strong energy business with solar and battery storage solutions",
          "Innovative manufacturing processes reducing production costs"
        ]
      },
      'Apple Inc.': {
        description: "Apple is a multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services. The company is known for its iPhone, iPad, Mac, Apple Watch, and services ecosystem.",
        businessModel: "Apple operates a hardware-software-services ecosystem model. Revenue comes from device sales, App Store commissions, subscription services (Apple Music, iCloud), and licensing agreements.",
        keyMetrics: {
          marketCap: "$3.2T",
          revenue: "$383.3B (2023)",
          employees: "164,000+",
          founded: "1976"
        },
        keyHighlights: [
          "Strongest brand loyalty in consumer electronics",
          "Consistent revenue growth with expanding services segment",
          "Leading position in premium smartphone market",
          "Robust ecosystem driving customer retention and lifetime value",
          "Strong cash position with $162B in cash and equivalents"
        ]
      },
      'Alphabet Inc.': {
        description: "Alphabet is the parent company of Google and several other subsidiaries. It operates in internet-related services and products, including search, advertising, cloud computing, software, and hardware.",
        businessModel: "Alphabet generates revenue primarily through advertising (Google Ads), cloud services (Google Cloud), and other services. The company invests heavily in AI, autonomous vehicles, and other emerging technologies.",
        keyMetrics: {
          marketCap: "$2.1T",
          revenue: "$307.4B (2023)",
          employees: "190,000+",
          founded: "1998"
        },
        keyHighlights: [
          "Dominant position in global search advertising market",
          "Rapidly growing cloud computing business",
          "Leading AI research and development capabilities",
          "Diversified portfolio including YouTube, Android, and Waymo",
          "Strong data monetization through multiple platforms"
        ]
      },
      'BMW Group': {
        description: "BMW Group is a German multinational corporation that produces luxury vehicles and motorcycles. The company owns BMW, MINI, and Rolls-Royce brands, and is a leader in premium automotive manufacturing.",
        businessModel: "BMW operates through vehicle sales, financial services, and after-sales services. The company focuses on premium positioning, innovative technology, and sustainable mobility solutions.",
        keyMetrics: {
          marketCap: "$75B",
          revenue: "$155.5B (2023)",
          employees: "149,000+",
          founded: "1916"
        },
        keyHighlights: [
          "Strong brand recognition in luxury automotive segment",
          "Leading electrification strategy with iX and i4 models",
          "Robust financial services division generating recurring revenue",
          "Expanding into autonomous driving and mobility services",
          "Strong performance in key markets including US, China, and Europe"
        ]
      },
      'Siemens AG': {
        description: "Siemens is a German multinational conglomerate company and the largest industrial manufacturing company in Europe. The company operates in industry, infrastructure, transport, and healthcare sectors.",
        businessModel: "Siemens generates revenue through industrial automation, smart infrastructure, mobility solutions, and healthcare technology. The company focuses on digital transformation and sustainable technologies.",
        keyMetrics: {
          marketCap: "$140B",
          revenue: "$77.8B (2023)",
          employees: "311,000+",
          founded: "1847"
        },
        keyHighlights: [
          "Market leader in industrial automation and digitalization",
          "Strong position in renewable energy and grid infrastructure",
          "Expanding healthcare technology portfolio",
          "Leading smart city and mobility solutions",
          "Consistent dividend payments with 175+ year history"
        ]
      }
    }
    
    return companyData[issuerName] || {
      description: "A leading company in their respective industry with strong fundamentals and growth prospects.",
      businessModel: "Diversified business model with multiple revenue streams and strong market position.",
      keyMetrics: {
        marketCap: "N/A",
        revenue: "N/A",
        employees: "N/A",
        founded: "N/A"
      },
      keyHighlights: [
        "Strong market position in core business segments",
        "Innovative product portfolio and technology leadership",
        "Experienced management team with proven track record",
        "Robust financial performance and cash generation"
      ]
    }
  }

  const getCompanyLogoUrl = (issuerName: string): string => {
    const logoMapping: Record<string, string> = {
      'Tesla Inc.': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/tesla.svg',
      'Apple Inc.': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/apple.svg',
      'Alphabet Inc.': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/google.svg',
      'BMW Group': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/bmw.svg',
      'Siemens AG': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/siemens.svg'
    }
    
    return logoMapping[issuerName] || 'https://logo.clearbit.com/company.com'
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handlePrimaryDealClick = (deal: PrimaryDeal) => {
    setSelectedPrimaryDeal(deal)
    setIsPrimaryModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const closePrimaryModal = () => {
    setIsPrimaryModalOpen(false)
    setSelectedPrimaryDeal(null)
  }

  const handleCommitFunds = (product: Product, amount: number) => {
    if (amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amount < product.minInvestment) {
      alert(`Minimum investment is ${formatCurrency(product.minInvestment, product.currency)}`)
      return
    }

    if (amount > walletBalance) {
      alert('Insufficient wallet balance')
      return
    }

    // Deduct from wallet balance
    setWalletBalance(prev => prev - amount)

    // Add to portfolio
    const portfolioItem = {
      id: `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      amount: amount,
      price: product.priceClean,
      ytmPct: product.ytmPct,
      timestamp: new Date().toISOString(),
      status: 'committed' as const
    }

    setPortfolio(prev => [...prev, portfolioItem])

    // Save to localStorage for portfolio page
    const updatedPortfolio = [...portfolio, portfolioItem]
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio))
    localStorage.setItem('walletBalance', (walletBalance - amount).toString())

    // Close modal and show success
    closeModal()
    alert(`Successfully committed ${formatCurrency(amount, product.currency)} to ${product.name}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text mb-4">Loading Markets...</div>
          <div className="text-muted-foreground">Fetching product data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h1 className="text-2xl font-bold gradient-text">Yield Desk Markets</h1>
            <p className="text-muted-foreground mt-1">
              Invest in tokenised bonds with transparent pricing and instant settlement
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="All">All Ratings</option>
                <option value="AAA">AAA</option>
                <option value="AA+">AA+</option>
                <option value="AA">AA</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="BB+">BB+</option>
                <option value="Aaa">Aaa</option>
                <option value="Aa1">Aa1</option>
                <option value="Aa2">Aa2</option>
                <option value="Aa3">Aa3</option>
                <option value="A1">A1</option>
                <option value="A3">A3</option>
                <option value="Ba1">Ba1</option>
              </select>
            </div>

            {/* Tenor Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tenor</label>
              <select
                value={filters.tenor}
                onChange={(e) => setFilters(prev => ({ ...prev, tenor: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="All">All Tenors</option>
                <option value="1Y">1 Year</option>
                <option value="2Y">2 Years</option>
                <option value="3Y">3 Years</option>
                <option value="5Y">5 Years</option>
                <option value="7Y">7 Years</option>
                <option value="10Y">10 Years</option>
                <option value="20Y">20 Years</option>
                <option value="30Y">30 Years</option>
                <option value="40Y">40 Years</option>
              </select>
            </div>

            {/* YTM Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block">YTM Yield</label>
              <select
                value={filters.ytmSort}
                onChange={(e) => setFilters(prev => ({ ...prev, ytmSort: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="None">No sorting</option>
                <option value="Lowest">Lowest yield</option>
                <option value="Highest">Highest yield</option>
              </select>
            </div>

            {/* Maturity Date Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block">Maturity Date</label>
              <select
                value={filters.maturitySort}
                onChange={(e) => setFilters(prev => ({ ...prev, maturitySort: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="None">No sorting</option>
                <option value="Closest">Closest maturity</option>
                <option value="Farthest">Farthest maturity</option>
              </select>
            </div>

            {/* Raise Size Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block">Raise Size</label>
              <select
                value={filters.raiseSizeSort}
                onChange={(e) => setFilters(prev => ({ ...prev, raiseSizeSort: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="None">No sorting</option>
                <option value="Lowest">Smallest raises</option>
                <option value="Highest">Largest raises</option>
              </select>
            </div>

            {/* Min Commitment Sort */}
            <div>
              <label className="text-sm font-medium mb-2 block">Min Commitment</label>
              <select
                value={filters.minCommitmentSort}
                onChange={(e) => setFilters(prev => ({ ...prev, minCommitmentSort: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="None">No sorting</option>
                <option value="Lowest">Lowest minimum</option>
                <option value="Highest">Highest minimum</option>
              </select>
            </div>

          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                rating: 'All',
                tenor: 'All',
                ytmSort: 'None',
                maturitySort: 'None',
                raiseSizeSort: 'None',
                minCommitmentSort: 'None'
              })}
              className="px-4 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-400px)]">
          {/* Left Panel - Category Menu */}
          <div className="col-span-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-brand-primary text-white"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {category === 'All' 
                            ? products.length 
                            : category === 'Primary Corporate Issuance'
                            ? primaryDeals.length
                            : products.filter(p => p.category === category).length
                          }
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Product List */}
          <div className="col-span-9">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {selectedCategory === 'Primary Corporate Issuance' ? 'Primary Corporate Issuance' : 'Products'}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {selectedCategory === 'Primary Corporate Issuance' 
                      ? `${filteredPrimaryDeals.length} of ${primaryDeals.length} deals`
                      : `${filteredProducts.length} of ${products.length} products`
                    }
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {selectedCategory === 'Primary Corporate Issuance' ? (
                  filteredPrimaryDeals.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <div className="text-4xl mb-4">🏢</div>
                        <h3 className="text-lg font-semibold mb-2">No primary deals found</h3>
                        <p className="text-sm">
                          Try adjusting your filters to see more results.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPrimaryDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:border-brand-primary/50 bg-card hover:bg-card/80 h-[28rem] flex flex-col"
                          onClick={() => handlePrimaryDealClick(deal)}
                        >
                          {/* Header */}
                          <div className="mb-3 flex-shrink-0 h-16">
                            <div className="flex-1 min-w-0 h-full flex flex-col justify-center relative">
                              <h3 className="font-semibold text-lg leading-tight pr-16">{deal.issuerName}</h3>
                              {/* Company Logo */}
                              <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                <img
                                  src={getCompanyLogoUrl(deal.issuerName)}
                                  alt={`${deal.issuerName} logo`}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    // Fallback to a generic company icon if logo fails to load
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.parentElement!.innerHTML = `
                                      <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd"/>
                                        </svg>
                                      </div>
                                    `
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="space-y-3 mb-4 flex-grow">
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Coupon</span>
                              <span className="font-semibold text-brand-accent text-sm">
                                {formatPercentage(deal.couponPct)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Tenor</span>
                              <span className="font-medium text-sm">{deal.tenorYears} Years</span>
                            </div>
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Target</span>
                              <span className="font-medium text-sm">{formatLargeNumber(deal.targetAmountUSD)}</span>
                            </div>
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Raised</span>
                              <span className="font-medium text-sm">
                                {deal.status === 'upcoming' ? '$0' : formatLargeNumber(deal.raisedSoFarUSD)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Progress</span>
                              <span className="font-medium text-sm">
                                {deal.status === 'upcoming' ? '0.0%' : ((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100).toFixed(1) + '%'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between h-8">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-auto pt-3 border-t border-border flex-shrink-0">
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{deal.status === 'upcoming' ? '0.0%' : ((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100).toFixed(1) + '%'}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${deal.status === 'upcoming' ? '0' : Math.min((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-sm">
                        Try adjusting your filters to see more results.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:border-brand-primary/50 bg-card hover:bg-card/80 h-96 flex flex-col"
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Header */}
                        <div className="mb-3 flex-shrink-0 h-16">
                          <div className="flex-1 min-w-0 h-full flex flex-col justify-between">
                            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground truncate">{product.issuer}</p>
                              {product.category === 'Government Bonds' && (
                                <ReactCountryFlag
                                  countryCode={product.countryCode}
                                  svg
                                  style={{
                                    width: '16px',
                                    height: '12px',
                                    borderRadius: '2px'
                                  }}
                                />
                              )}
                              {product.category === 'Inflation-Protected' && (
                                <ReactCountryFlag
                                  countryCode={product.countryCode}
                                  svg
                                  style={{
                                    width: '16px',
                                    height: '12px',
                                    borderRadius: '2px'
                                  }}
                                />
                              )}
                              {product.category === 'Corporate Bonds' && product.issuerTicker && (
                                <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                  {product.issuerTicker.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="space-y-3 mb-4 flex-grow">
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">YTM</span>
                            <span className="font-semibold text-brand-accent text-sm">
                              {formatPercentage(product.ytmPct)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">Rating</span>
                            <div className="flex items-center">
                              {product.rating ? (
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(product.rating.composite)}`}
                                  title={`Moody's: ${product.rating.moodys || 'N/A'}\nS&P: ${product.rating.sp || 'N/A'}\nFitch: ${product.rating.fitch || 'N/A'}\nAs of: ${product.rating.asOf}`}
                                >
                                  {product.rating.composite}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">N/A</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">Maturity</span>
                            <span className="font-medium text-sm">{formatDate(product.maturityDate)}</span>
                          </div>
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <div className="text-right">
                              <div className="font-medium text-sm">
                                {formatPriceDisplay(product.priceClean, product.currency).usd}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ({formatPriceDisplay(product.priceClean, product.currency).local})
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">
                              {product.minInvestmentDisplay.type === 'issuer' ? 'Issuer minimum' : 'Platform minimum'}
                            </span>
                            <div className="text-right">
                              <div className="font-medium text-sm">
                                ${product.minInvestment.toFixed(0)}
                              </div>
                              {product.minInvestmentDisplay.type === 'issuer' && (
                                <div className="text-xs text-muted-foreground">
                                  ({product.minInvestmentDisplay.issuerMinFace} {product.minInvestmentDisplay.faceCurrency})
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between h-8">
                            <span className="text-sm text-muted-foreground">Coupon</span>
                            <span className="font-medium text-sm">
                              {product.couponType === 'Discount' 
                                ? 'Discount' 
                                : `${formatPercentage(product.couponRatePct)} ${product.couponFrequency}`
                              }
                            </span>
                          </div>
                        </div>

                        {/* Spacer to push content to top */}
                        <div className="mt-auto flex-shrink-0"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Investment Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Invest in {selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedProduct.issuer}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="font-medium">{selectedProduct.rating?.sp || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Coupon:</span>
                  <div className="font-medium">
                    {selectedProduct.couponType === 'Discount' 
                      ? 'Discount' 
                      : `${formatPercentage(selectedProduct.couponRatePct)} ${selectedProduct.couponFrequency}`
                    }
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Maturity:</span>
                  <div className="font-medium">{formatDate(selectedProduct.maturityDate)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">YTM:</span>
                  <div className="font-medium text-brand-accent">
                    {formatPercentage(selectedProduct.ytmPct)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <div className="font-medium">
                    {formatPriceDisplay(selectedProduct.priceClean, selectedProduct.currency).usd}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({formatPriceDisplay(selectedProduct.priceClean, selectedProduct.currency).local})
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Min Investment:</span>
                  <div className="font-medium">
                    {formatCurrency(selectedProduct.minInvestment, selectedProduct.currency)}
                  </div>
                </div>
              </div>


              {/* Investment Limits */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Investment Limits</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Min: {formatCurrency(selectedProduct.minInvestment, selectedProduct.currency)}</div>
                  <div>Increment: {formatCurrency(selectedProduct.increment, selectedProduct.currency)}</div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Wallet Balance</div>
                <div className="text-sm text-muted-foreground">
                  USDC: {formatCurrency(walletBalance, 'USD')}
                </div>
              </div>

              {/* Investment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commitment Amount (USD)
                  </label>
                  <input
                    type="number"
                    id="commitmentAmount"
                    min={selectedProduct.minInvestment}
                    step={selectedProduct.increment}
                    placeholder={`Min: ${formatCurrency(selectedProduct.minInvestment, selectedProduct.currency)}`}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const amountInput = document.getElementById('commitmentAmount') as HTMLInputElement
                      const amount = parseFloat(amountInput.value)
                      handleCommitFunds(selectedProduct, amount)
                    }}
                    className="flex-1 px-4 py-2 text-sm bg-brand-primary text-white hover:bg-brand-primary/90 rounded-md transition-colors"
                  >
                    Commit Funds
                  </button>
                </div>
              </div>



              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Deal Modal */}
      {isPrimaryModalOpen && selectedPrimaryDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
                    <img
                      src={getCompanyLogoUrl(selectedPrimaryDeal.issuerName)}
                      alt={`${selectedPrimaryDeal.issuerName} logo`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        // Fallback to a generic company icon if logo fails to load
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        `
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedPrimaryDeal.issuerName}</h2>
                    <p className="text-muted-foreground">Primary Corporate Issuance</p>
                  </div>
                </div>
                <button
                  onClick={closePrimaryModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Company Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuer</span>
                      <span className="font-medium">{selectedPrimaryDeal.issuerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ticker</span>
                      <span className="font-medium">{selectedPrimaryDeal.issuerLogoSlug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="font-medium">{selectedPrimaryDeal.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPrimaryDeal.status)}`}>
                        {selectedPrimaryDeal.status.charAt(0).toUpperCase() + selectedPrimaryDeal.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Deal Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coupon Rate</span>
                      <span className="font-medium text-brand-accent">{formatPercentage(selectedPrimaryDeal.couponPct)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenor</span>
                      <span className="font-medium">{selectedPrimaryDeal.tenorYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target Amount</span>
                      <span className="font-medium">{formatLargeNumber(selectedPrimaryDeal.targetAmountUSD)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Raised So Far</span>
                      <span className="font-medium">{formatLargeNumber(selectedPrimaryDeal.raisedSoFarUSD)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Fundraising Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-semibold text-brand-accent">
                      {selectedPrimaryDeal.status === 'upcoming' ? '0.0%' : ((selectedPrimaryDeal.raisedSoFarUSD / selectedPrimaryDeal.targetAmountUSD) * 100).toFixed(1) + '%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-brand-accent h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedPrimaryDeal.status === 'upcoming' ? '0' : Math.min((selectedPrimaryDeal.raisedSoFarUSD / selectedPrimaryDeal.targetAmountUSD) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Raised</div>
                      <div className="font-semibold">
                        {selectedPrimaryDeal.status === 'upcoming' ? '$0' : formatLargeNumber(selectedPrimaryDeal.raisedSoFarUSD)}
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-semibold">{formatLargeNumber(selectedPrimaryDeal.targetAmountUSD)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description Section */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">About {selectedPrimaryDeal.issuerName}</h3>
                {(() => {
                  const companyInfo = getCompanyInfo(selectedPrimaryDeal.issuerName)
                  return (
                    <div className="space-y-6">
                      {/* Company Description */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Company Overview</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {companyInfo.description}
                        </p>
                      </div>

                      {/* Business Model */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Business Model</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {companyInfo.businessModel}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Key Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(companyInfo.keyMetrics).map(([key, value]) => (
                            <div key={key} className="bg-muted rounded-lg p-3 text-center">
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="font-semibold text-foreground mt-1">
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Investment Highlights</h4>
                        <div className="space-y-2">
                          {companyInfo.keyHighlights.map((highlight, index) => (
                            <div key={index} className="flex items-start">
                              <svg className="w-4 h-4 text-brand-accent mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm text-muted-foreground">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Investment Section */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Register Interest</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        min={selectedPrimaryDeal.minOrderUSD || 100000}
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Order</label>
                      <div className="px-3 py-2 bg-muted rounded-md text-sm">
                        {formatLargeNumber(selectedPrimaryDeal.minOrderUSD || 100000)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Demo / Not an offer</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          This is a hypothetical primary issuance preview. No actual investment or token minting will occur.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-brand-primary text-white py-3 px-4 rounded-md font-medium hover:bg-brand-primary/90 transition-colors">
                    Register Interest (Non-Binding)
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {selectedPrimaryDeal.disclaimer || "This is a demonstration of potential primary corporate issuance. All data is hypothetical and for educational purposes only."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  onClick={closePrimaryModal}
                  className="px-4 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
