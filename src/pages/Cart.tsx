import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Discover something you'll love.</p>
        <Link
          to="/"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <AnimatedSection>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-8">Your Cart</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-6 bg-surface rounded-2xl p-6"
              >
                <div className="w-20 h-20 bg-muted rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize mt-1">{item.product.category}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium tabular-nums w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-foreground tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-surface rounded-3xl p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground tabular-nums">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">Free</span>
                </div>
                <div className="border-t border-foreground/[0.05] pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground tabular-nums text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                Proceed to Checkout
              </button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                0% financing available at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
