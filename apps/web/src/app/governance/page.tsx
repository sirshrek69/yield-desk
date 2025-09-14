export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-brand-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">Governance</h1>
          
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4">Yield Desk Protocol Governance</h2>
            <p className="text-muted-foreground mb-6">
              Yield Desk operates as a decentralized protocol where token holders participate in key decisions 
              regarding protocol parameters, new bond listings, and platform development.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Governance Token</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  YD token holders can propose and vote on protocol changes, bond listing criteria, 
                  and fee structures.
                </p>
                <div className="text-sm text-muted-foreground">
                  <div>• Voting Power: 1 token = 1 vote</div>
                  <div>• Minimum Proposal Threshold: 1% of supply</div>
                  <div>• Voting Period: 7 days</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Active Proposals</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Currently no active proposals. Check back for upcoming governance votes.
                </p>
                <div className="text-sm text-muted-foreground">
                  <div>• Proposal #1: Fee Structure Update (Ended)</div>
                  <div>• Proposal #2: New Bond Listing Criteria (Ended)</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">Governance Resources</h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="text-brand-accent hover:text-brand-accent/80 transition-colors">
                  View Proposals →
                </a>
                <a href="#" className="text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Token Economics →
                </a>
                <a href="#" className="text-brand-accent hover:text-brand-accent/80 transition-colors">
                  Governance Forum →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
