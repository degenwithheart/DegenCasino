# DegenCasino Admin/Dev URL Commands

This document contains all URL-based commands that an admin/developer would use for managing the DegenCasino platform.

## Direct Browser URLs

### **Admin Control Panel**
```
https://degenheart.casino/admin
```
*Creator wallet only - Also accessible via sidebar menu when connected*

### RTP Audit Testing
```
https://degenheart.casino/api/audit/edgeCases
https://degenheart.casino/api/audit/edgeCases?plays=50000
```

### Cache Management
```
https://degenheart.casino/api/cache/cache-admin?action=stats
https://degenheart.casino/api/cache/cache-admin?action=cleanup
```

### Cache Warmup
```
https://degenheart.casino/api/cache/cache-warmup
```

### DNS Health Check
```
https://degenheart.casino/api/dns/check-dns
https://degenheart.casino/api/dns/check-dns?domain=degenheart.casino
```

### Price Data
```
https://degenheart.casino/api/services/coingecko
https://degenheart.casino/api/services/coingecko?ids=solana,bonk
https://degenheart.casino/api/services/coingecko?ids=solana,usd-coin,jupiter-exchange,bonk&vs_currencies=usd
```

### Chat System
```
https://degenheart.casino/api/chat/chat
```

## Admin Control Panel

The admin control panel provides a user-friendly interface for executing admin commands:

- **URL**: `https://degenheart.casino/admin`
- **Access**: Creator wallet only
- **Navigation**: Available in sidebar menu when creator wallet is connected
- **Features**:
  - One-click execution of all admin commands
  - Real-time results in modal popups
  - Secure authentication with admin tokens
  - Visual feedback and loading states

## Curl Commands for Admin Operations

### Cache Configuration (POST)
```bash
curl -X POST "https://degenheart.casino/api/cache/cache-admin?action=configure" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  -d '{"maxSize": 100, "ttl": 3600}'
```

### Admin Authentication
```bash
curl -X POST "https://degenheart.casino/api/auth/auth" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  -d '{"password": "YOUR_ADMIN_PASSWORD"}'
```

### Helius API Proxy
```bash
curl -X POST "https://degenheart.casino/api/services/helius" \
  -H "Content-Type: application/json" \
  -d '{"method": "getBalance", "params": ["YOUR_WALLET_ADDRESS"]}'
```

### Chat Operations
```bash
# Get messages
curl "https://degenheart.casino/api/chat/chat"

# Post message
curl -X POST "https://degenheart.casino/api/chat/chat" \
  -H "Content-Type: application/json" \
  -d '{"user": "admin", "text": "System maintenance"}'

# Clear chat (requires signature)
curl -X DELETE "https://degenheart.casino/api/chat/chat" \
  -H "Content-Type: application/json" \
  -d '{"address": "CREATOR_ADDRESS", "signature": "SIGNATURE", "nonce": "NONCE"}'
```

## Local Development URLs

If running locally on `http://localhost:4001`:

```
http://localhost:4001/api/audit/edgeCases
http://localhost:4001/api/cache/cache-admin?action=stats
http://localhost:4001/api/services/coingecko
http://localhost:4001/api/dns/check-dns
```

## Quick Admin Commands

### Health Check Combo
```bash
# Check everything at once
curl "https://degenheart.casino/api/cache/cache-admin?action=stats"
curl "https://degenheart.casino/api/dns/check-dns"
curl "https://degenheart.casino/api/services/coingecko"
```

### Emergency Cache Clear
```bash
curl "https://degenheart.casino/api/cache/cache-admin?action=cleanup" \
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN"
```

### RTP Verification
```bash
curl "https://degenheart.casino/api/audit/edgeCases?plays=100000"
```

## Browser Bookmarks

For quick access, bookmark these URLs:
- **Cache Stats**: `https://degenheart.casino/api/cache/cache-admin?action=stats`
- **DNS Check**: `https://degenheart.casino/api/dns/check-dns`
- **Price Feed**: `https://degenheart.casino/api/services/coingecko`
- **RTP Audit**: `https://degenheart.casino/api/audit/edgeCases`

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/audit/edgeCases` | GET | RTP validation tests | No |
| `/api/auth/auth` | POST | Admin authentication | Admin Token |
| `/api/cache/cache-admin` | GET/POST | Cache management | Token for actions |
| `/api/cache/cache-warmup` | GET | Cache warmup | No |
| `/api/chat/chat` | GET/POST/DELETE | Chat system | No (DELETE needs signature) |
| `/api/dns/check-dns` | GET | DNS health check | No |
| `/api/services/coingecko` | GET | Price data proxy | No |
| `/api/services/helius` | POST | Helius API proxy | No |

## Environment Variables Required

- `ADMIN_TOKEN`: For admin operations (set in Vercel environment variables)
- `HELIUS_API_KEY`: For Helius API proxy
- `ACCESS_OVERRIDE_PASSWORD`: For admin authentication

### Setting up Admin Token

1. **Local Development**: Add to `.env` file:
   ```bash
   ADMIN_TOKEN=your_secure_random_token_here
   ```

2. **Production (Vercel)**: Set in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `ADMIN_TOKEN` with a secure random value
   - Redeploy the application

3. **Generate Secure Token**:
   ```bash
   # Generate a secure random token
   openssl rand -hex 32
   # or
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Notes

- All endpoints support CORS for `degenheart.casino` and `localhost:4001`
- Rate limiting is implemented on most endpoints
- Cache TTL varies by endpoint (1 minute to 5 minutes)
- Admin operations require `X-Admin-Token` header
- Local development typically runs on port 4001

## Quick Reference

### Most Used Commands:
1. `https://degenheart.casino/admin` - **NEW**: Admin control panel (creator only, sidebar access)
2. `https://degenheart.casino/api/cache/cache-admin?action=stats` - Check cache health
3. `https://degenheart.casino/api/dns/check-dns` - DNS status
4. `https://degenheart.casino/api/services/coingecko` - Price data
5. `https://degenheart.casino/api/audit/edgeCases` - RTP verification

### Emergency Commands:
1. Cache cleanup: `https://degenheart.casino/api/cache/cache-admin?action=cleanup`
2. Full system check: Run all health check URLs
3. Chat clear: DELETE to `/api/chat/chat` with signature</content>
<parameter name="filePath">/Users/degenwithheart/GitHub/DegenCasino/ADMIN_URL_COMMANDS.md
