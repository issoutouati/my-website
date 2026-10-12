type CartItem = {
  name: string;
  price: number;
};

let cart: CartItem[] = [];

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function addToCart(item: CartItem) {
  cart.push(item);
  notify();
}

export function removeFromCart(index: number) {
  cart.splice(index, 1);
  notify();
}

export function getCart() {
  return cart;
}

export function clearCart() {
  cart = [];
  notify();
}

export function subscribe(callback: () => void) {
  listeners.push(callback);
}