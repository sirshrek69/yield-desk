# Tokenised Fixed Income MVP

A production-grade MVP for tokenised fixed income investing. Users can browse bond categories, view product details, and commit USDC into raises. Includes a Portfolio page showing all investments.

## Features

- **3-Panel Layout**: Category menu, product list, and investment panel
- **Real-time Data**: Live pricing and commitment tracking via price service
- **Portfolio Management**: Track committed, active, and matured positions
- **Web3 Integration**: wagmi/viem with RainbowKit for wallet connection
- **Smart Contracts**: Foundry-based contracts for primary issuance

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev
```

This will start:
- Web app at http://localhost:3000
- Price service at http://localhost:4001

## Project Structure

```
tokenised-fixed-income/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── price-service/       # Express API service
├── packages/
│   ├── sdk/                 # TypeScript SDK
│   └── contracts/           # Foundry smart contracts
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # Workspace configuration
└── turbo.json              # Turborepo configuration
```

## Development

### Web App
- Next.js 14 with App Router
- Tailwind CSS + shadcn/ui components
- wagmi v2 + viem for Web3
- RainbowKit for wallet connection

### Price Service
- Express.js API server
- Serves product data and time series
- Mock pricing and commitment data

### SDK
- TypeScript library
- Bond pricing calculations (YTM)
- Chain interaction helpers
- Type definitions

### Contracts
- Foundry-based smart contracts
- USDC (mintable test token)
- PrimaryIssuance (commit/withdraw/finalise)
- BondToken (ERC20 for bond holdings)

## Environment Setup

1. Copy `env.example` to `.env`
2. Set your private key for contract deployment
3. Configure RPC URLs for Base Sepolia

## Deployment

### Contracts
```bash
cd packages/contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### Services
```bash
# Build all packages
pnpm build

# Start production services
pnpm start
```

## Testing

```bash
# Run all tests
pnpm test

# SDK unit tests
cd packages/sdk && pnpm test

# Contract tests
cd packages/contracts && forge test
```

## License

MIT
