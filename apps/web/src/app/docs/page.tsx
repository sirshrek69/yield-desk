export default function DocsPage() {
  return (
    <div className="min-h-screen bg-brand-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">Documentation</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <div className="space-y-3">
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Quick Start Guide →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  How to Invest →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Wallet Setup →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  First Investment →
                </a>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Protocol</h2>
              <div className="space-y-3">
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Architecture Overview →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Smart Contracts →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Bond Tokenization →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Yield Calculations →
                </a>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">API Reference</h2>
              <div className="space-y-3">
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  REST API →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  WebSocket API →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  SDK Documentation →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Rate Limits →
                </a>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-3">
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Security Audit →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Bug Bounty →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Risk Management →
                </a>
                <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Insurance Coverage →
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Community</h3>
                <div className="space-y-2 text-sm">
                  <a href="https://x.com/yielddesk" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Twitter/X →
                  </a>
                  <a href="https://t.me/yielddesk" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Telegram →
                  </a>
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Discord →
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Development</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    GitHub →
                  </a>
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Smart Contract Code →
                  </a>
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    SDK Repository →
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Legal</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Terms of Service →
                  </a>
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Privacy Policy →
                  </a>
                  <a href="#" className="block text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Risk Disclosure →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
