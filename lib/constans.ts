// lib/constants.ts
// Single source of truth for the flat delivery fee (DA).
// Cart and the product page now import this. Checkout still hardcodes 1000 —
// switch it to this import during the checkout sweep so all three agree.
export const SHIPPING = 800;