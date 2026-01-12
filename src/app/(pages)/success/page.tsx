"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import PageBanner from "@components/PageBanner";
import ScrollHint from "@layouts/scroll-hint/Index";
import { useCartStore } from "@/store/cart-store";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { CustomButton } from "@/app/_components/ui/CustomButton";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const method = searchParams.get('method');
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    clearCart();
    
    // Celebration effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [clearCart]);

  return (
    <div className="container tst-p-60-60">
      <ScrollHint />
      <section className="tst-p-90-90">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex justify-center mb-40">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                  className="w-120 h-120 rounded-full bg-accent/20 flex items-center justify-center border-4 border-accent"
                >
                  <CheckCircle size={64} className="text-accent" />
                </motion.div>
              </div>

              <h2 className="mb-20">Поръчката е приета!</h2>
              <p className="tst-text text-xl mb-40 opacity-60">
                Благодарим Ви, че избрахте ресторант „Делиорман“.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-60">
                <div className="p-30 bg-white/5 border border-white/10 rounded-xl text-left">
                  <Package className="text-accent mb-15" size={24} />
                  <h6 className="mb-10 uppercase tracking-widest text-xs opacity-40">Детайли</h6>
                  {orderId && (
                    <p className="text-sm font-bold mb-5"># {orderId}</p>
                  )}
                  <p className="text-xs opacity-50">
                    {method === 'cash' ? 'Наложен платеж' : 'Платено с карта'}
                  </p>
                </div>

                <div className="p-30 bg-white/5 border border-white/10 rounded-xl text-left">
                  <CheckCircle className="text-accent mb-15" size={24} />
                  <h6 className="mb-10 uppercase tracking-widest text-xs opacity-40">Следващи стъпки</h6>
                  <p className="text-xs opacity-60 leading-relaxed">
                    Ще получите потвърждение по имейл. Нашите колеги ще се свържат с Вас за финално уточнение.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-20">
                <Link href="/menu">
                  <CustomButton className="w-full sm:w-auto flex items-center gap-2">
                    <span>Към менюто</span>
                    <ArrowRight size={18} />
                  </CustomButton>
                </Link>
                <Link href="/">
                  <CustomButton variant="secondary" className="w-full sm:w-auto flex items-center gap-2">
                    <Home size={18} />
                    <span>Начало</span>
                  </CustomButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Success = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Успешна поръчка"}
          description={"Вкусната храна е на път към Вас!"}
          breadTitle={"Успех"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <Suspense fallback={<div>Зареждане...</div>}>
              <SuccessContent />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;

