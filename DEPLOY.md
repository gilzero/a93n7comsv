# Cloudflare Workers Deployment Guide

This guide explains how to deploy the A93N7 landing page to Cloudflare Workers.

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed globally:
   ```bash
   bun add -g wrangler
   ```
3. Authentication with Cloudflare:
   ```bash
   wrangler login
   ```

## Configuration

The project is configured to use Cloudflare Workers via:
- `svelte.config.js` - Uses `@sveltejs/adapter-cloudflare`
- `wrangler.toml` - Cloudflare Workers configuration

## Deployment Methods

### 1. Cloudflare Pages (Recommended)

Deploy using Cloudflare Pages for automatic deployments:

```bash
# First-time setup (only needed once)
bun run deploy:create

# Deploy to production
bun run deploy

# Deploy to preview environment
bun run deploy:preview
```

Note: If you haven't logged in to Cloudflare yet, run:
```bash
wrangler login
```

### 2. Direct Workers Deployment

For direct Workers deployment, uncomment the route configuration in `wrangler.toml`:

```toml
route = { pattern = "a93n7.com/*", zone_name = "a93n7.com" }
```

Then deploy:

```bash
bun run build
wrangler deploy
```

### 3. GitHub Integration

1. Connect your GitHub repository to Cloudflare Pages
2. Set build configuration:
   - Build command: `bun run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Environment variables: Add any required vars

## Environment Variables

Set environment variables in Cloudflare dashboard or `wrangler.toml`:

```toml
[vars]
PUBLIC_API_URL = "https://api.a93n7.com"
```

## Custom Domain

1. Add your domain in Cloudflare Pages dashboard
2. Update DNS records as instructed
3. SSL certificate will be automatically provisioned

## Local Development with Cloudflare

Test Cloudflare Workers features locally:

```bash
bun run cf:dev
```

This runs the site with Cloudflare Workers runtime emulation.

## Monitoring

- View logs: `wrangler tail`
- Analytics: Available in Cloudflare dashboard
- Error tracking: Enable in Workers settings

## Troubleshooting

1. **Build fails**: Ensure all dependencies are installed with `bun install`
2. **Route not working**: Check domain configuration in Cloudflare dashboard
3. **Environment variables**: Verify they're set in the correct environment

## Cost Considerations

- Cloudflare Pages: Free tier includes 500 builds/month
- Workers: Free tier includes 100,000 requests/day
- Custom domains: No additional cost

## Support

For issues specific to Cloudflare deployment:
- [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- [SvelteKit Cloudflare adapter](https://kit.svelte.dev/docs/adapter-cloudflare)