# ISSO TIME LUXURY

**A full-stack luxury watch e-commerce platform built for the Algerian market.**

ISSO TIME LUXURY delivers a refined online experience for discovering and ordering premium timepieces. The platform combines an elegant, responsive storefront with a complete order workflow: customers can explore collections, save favourite watches, place an order, receive confirmation, and track its progress.

Designed around the needs of local customers, the experience includes wilaya-based delivery details, order confirmation by phone, and accessible customer support.

## Features

- Curated luxury watch collections
- Detailed product pages with availability management
- Shopping cart and wishlist
- Checkout flow with customer and delivery information
- Order creation, confirmation, and tracking
- Wilaya-based delivery workflow across Algeria
- Email confirmation for completed orders
- Contact, FAQ, warranty, return, and delivery information pages
- Fully responsive design for mobile, tablet, and desktop

## Security and reliability

- Server-side price calculation — prices are never trusted from the browser
- Atomic stock updates when an order is placed
- Input validation for orders and customer details
- Rate limiting on order requests
- Cloudflare Turnstile bot protection
- Order confirmation pages verify the order in the database

## Built with

- Next.js
- React
- TypeScript
- Supabase
- Cloudflare Turnstile

## Run locally

```bash
npm install
npm run dev