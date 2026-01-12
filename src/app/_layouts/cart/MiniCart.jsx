"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, ArrowRight } from "lucide-react";

const MiniCart = () => {
    const items = useCartStore(state => state.items);
    const removeItem = useCartStore(state => state.removeItem);
    const getItemCount = useCartStore(state => state.getItemCount);
    const getSubtotal = useCartStore(state => state.getSubtotal);

    const cartTotal = getItemCount();
    const subtotal = getSubtotal();

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number');
        if (cartNumberEl) {
            cartNumberEl.innerHTML = cartTotal.toString();
        }
    }, [cartTotal]);

    const removeFromCart = (e, id) => {
        e.preventDefault();
        const cartNumberEl = document.querySelector('.tst-cart-number');

        if (cartNumberEl) {
            cartNumberEl.classList.add('tst-added');
            setTimeout(() => {
                cartNumberEl.classList.remove('tst-added');
            }, 600);
        }

        removeItem(id);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="tst-minicart-header">
                <div className="flex items-center justify-center gap-2 mb-10">
                    <ShoppingBag size={18} className="text-accent" />
                    <h5 className="m-0">Вашата поръчка</h5>
                </div>
                <div className="tst-divider-center"></div>
            </div>

            <div className="flex-grow overflow-hidden relative">
                <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center h-full p-40 text-center"
                        >
                            <div className="w-100 h-100 rounded-full bg-white/5 flex items-center justify-center mb-20">
                                <ShoppingBag size={48} className="text-white/20" />
                            </div>
                            <p className="tst-text mb-20">Количката е празна</p>
                            <Link href="/menu" className="tst-btn tst-btn-2">Към менюто</Link>
                        </motion.div>
                    ) : (
                        <motion.ul 
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="woocommerce-mini-cart cart_list product_list_widget p-0 m-0 overflow-y-auto max-h-[400px]"
                        >
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.li 
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="woocommerce-mini-cart-item relative flex items-center gap-15 p-15 border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="relative w-60 h-60 min-w-[60px] rounded-md overflow-hidden">
                                            <img src={item.image || '/img/menu/1.webp'} alt={item.name} className="object-cover w-full h-full" />
                                        </div>
                                        
                                        <div className="flex-grow">
                                            <h6 className="text-sm m-0 mb-5 leading-tight">{item.name}</h6>
                                            <span className="text-xs text-white/40">
                                                {item.quantity} × <span className="text-accent">{item.price.toFixed(2)} лв.</span>
                                            </span>
                                        </div>

                                        <button 
                                            onClick={(e) => removeFromCart(e, item.id)}
                                            className="opacity-0 group-hover:opacity-100 p-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {items.length > 0 && (
                <div className="p-30 bg-black/20 border-t border-white/5">
                    <div className="flex justify-between items-center mb-20">
                        <span className="text-xs uppercase tracking-widest font-bold opacity-40">Междинна сума</span>
                        <span className="text-xl font-bold">{subtotal.toFixed(2)} лв.</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                        <Link href="/cart" className="tst-btn tst-btn-2 text-center py-15">
                            Количка
                        </Link>
                        <Link href="/checkout" className="tst-btn flex items-center justify-center gap-2 py-15">
                            <span>Поръчай</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniCart;
