'use client'

import { useState, useEffect } from 'react'

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
  disclaimer: string
}

export default function PrimaryIssuancePage() {
  const [deals, setDeals] = useState<PrimaryDeal[]>([])
  const [selectedDeal, setSelectedDeal] = useState<PrimaryDeal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [interestAmount, setInterestAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4001/primary-deals')
      .then(res => res.json())
      .then(data => {
        setDeals(data.deals)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch primary deals:', err)
        setLoading(false)
      })
  }, [])

  const handleDealClick = (deal: PrimaryDeal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDeal(null)
    setInterestAmount('')
  }

  const handleRegisterInterest = async () => {
    if (!selectedDeal || !interestAmount) return

    setSubmitting(true)
    try {
      const response = await fetch(`http://localhost:4001/primary-deals/${selectedDeal.id}/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          amountUSD: parseFloat(interestAmount)
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Interest registered successfully! (Non-binding)')
        closeModal()
      } else {
        alert('Failed to register interest')
      }
    } catch (error) {
      console.error('Error registering interest:', error)
      alert('Failed to register interest')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500'
      case 'upcoming': return 'bg-blue-500'
      case 'closed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open'
      case 'upcoming': return 'Upcoming'
      case 'closed': return 'Closed'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading primary deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text">Primary Corporate Issuance</h1>
          <p className="text-muted-foreground mt-1">
            Demo / Not an offer. Hypothetical primary issuance previews.
          </p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <div className="text-yellow-800 text-sm font-medium">
              ⚠️ Demo / Not an offer. Hypothetical primary issuance previews.
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:border-brand-primary/50 bg-card hover:bg-card/80"
              onClick={() => handleDealClick(deal)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight mb-1">{deal.issuerName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                      {deal.issuerLogoSlug.charAt(0)}
                    </div>
                    <span className="text-sm text-muted-foreground">{deal.issuerLogoSlug}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs text-white whitespace-nowrap ml-2 ${getStatusColor(deal.status)}`}>
                  {getStatusText(deal.status)}
                </span>
              </div>

              {/* Deal Terms */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coupon</span>
                  <span className="font-semibold text-brand-accent">
                    {deal.couponPct.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tenor</span>
                  <span className="font-medium">{deal.tenorYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Min Order</span>
                  <span className="font-medium">{formatCurrency(deal.minOrderUSD || 100000)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((deal.raisedSoFarUSD / deal.targetAmountUSD) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {formatCurrency(deal.raisedSoFarUSD)} / {formatCurrency(deal.targetAmountUSD)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-1">{selectedDeal.issuerName}</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                      {selectedDeal.issuerLogoSlug.charAt(0)}
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedDeal.issuerLogoSlug}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Deal Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coupon Rate</span>
                  <span className="font-semibold text-brand-accent">
                    {selectedDeal.couponPct.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tenor</span>
                  <span className="font-medium">{selectedDeal.tenorYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target Amount</span>
                  <span className="font-medium">{formatCurrency(selectedDeal.targetAmountUSD)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Raised So Far</span>
                  <span className="font-medium">{formatCurrency(selectedDeal.raisedSoFarUSD)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Minimum Order</span>
                  <span className="font-medium">{formatCurrency(selectedDeal.minOrderUSD || 100000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(selectedDeal.status)}`}>
                    {getStatusText(selectedDeal.status)}
                  </span>
                </div>
              </div>

              {/* Interest Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Interest Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={interestAmount}
                    onChange={(e) => setInterestAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    min={selectedDeal.minOrderUSD || 100000}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  {selectedDeal.disclaimer}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegisterInterest}
                    disabled={!interestAmount || submitting}
                    className="flex-1 px-4 py-2 text-sm bg-brand-primary text-white hover:bg-brand-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Registering...' : 'Register Interest'}
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
