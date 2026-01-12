"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from "@/store/cart-store";
import { checkoutSchema } from '@/lib/validations/checkout';
import { CustomInput } from '../ui/CustomInput';
import { CustomButton } from '../ui/CustomButton';
import { PaymentSelector } from './PaymentSelector';
import { Package, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

const CheckoutForm = () => {

  const router = useRouter();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);



  return (
    <>
      <div className="tst-checkout-flow-header">
        <div className={step === 1 ? 'flow-step active' : 'flow-step'}>
          <div className="step-number">1</div>
          <div className="step-label">Доставка</div>
        </div>
        <div className="flow-divider" />
        <div className={step === 2 ? 'flow-step active' : 'flow-step'}>
          <div className="step-number">2</div>
          <div className="step-label">Плащане</div>
        </div>
      </div>

      <Formik
        initialValues={{
          customerName: '',
          phone: '',
          address: '',
          notes: '',
          paymentMethod: 'cash'
        }}
        validate={values => {
          const errors = {};
          const result = checkoutSchema.safeParse({
            ...values,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            }))
          });

          if (!result.success) {
            result.error.errors.forEach(err => {
              const field = err.path[0];
              if (field && field !== 'items') {
                errors[field] = err.message;
              }
            });
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setIsSubmitting(true);
          setStatus(null);

          try {
            const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...values,
                items: items.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                }))
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              const errorMessage = data.errors?.map(e => e.message).join(', ') || 'Грешка при обработката.';
              setStatus({ type: 'error', message: errorMessage });
              setIsSubmitting(false);
              setSubmitting(false);
              return;
            }

            if (data.success) {
              if (values.paymentMethod === 'cash') {
                clearCart();
                router.push(`/success?orderId=${data.orderId}&method=cash`);
              } else if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
              }
            }
          } catch (error) {
            setStatus({ type: 'error', message: 'Възникна грешка. Опитайте отново.' });
            setIsSubmitting(false);
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          status,
        }) => (
          <form onSubmit={handleSubmit} className="tst-checkout-form">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="tst-mb-30">
                    <h5>Детайли за доставка</h5>
                  </div>
                  
                  <div className="row">
                    <div className="col-lg-12">
                      <CustomInput
                        label="Име и фамилия *"
                        name="customerName"
                        placeholder="Вашето име"
                        value={values.customerName}
                        error={errors.customerName}
                        touched={touched.customerName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col-lg-12">
                      <CustomInput
                        label="Телефон *"
                        name="phone"
                        placeholder="0888 000 000"
                        value={values.phone}
                        error={errors.phone}
                        touched={touched.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col-lg-12">
                      <CustomInput
                        label="Адрес за доставка *"
                        name="address"
                        placeholder="Град, улица, номер..."
                        value={values.address}
                        error={errors.address}
                        touched={touched.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className="tst-group-input">
                        <label>Бележки (опционално)</label>
                        <textarea
                          name="notes"
                          placeholder="Бележки към ресторанта или куриера"
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="tst-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-30">
                    <CustomButton
                      onClick={() => {
                        // Mark fields as touched to show errors if any
                        const fields = ['customerName', 'phone', 'address'];
                        const hasErrors = fields.some(f => errors[f]);
                        if (!hasErrors && values.customerName && values.phone && values.address) {
                          setStep(2);
                        } else {
                          // Force show errors
                          fields.forEach(f => handleBlur({ target: { name: f } }));
                        }
                      }}
                      className="tst-btn-with-icon"
                    >
                      <span>Напред към плащане</span>
                      <ChevronRight size={18} className="ml-10" />
                    </CustomButton>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="tst-mb-30">
                    <h5>Метод на плащане</h5>
                  </div>

                  <PaymentSelector
                    value={values.paymentMethod}
                    onChange={(val) => setFieldValue('paymentMethod', val)}
                  />

                  {status && (
                    <div className={`form-status ${status.type} text-center mt-30 p-15 rounded-md ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}`}>
                      {status.message}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-60">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={18} />
                      <span>Назад към доставка</span>
                    </button>

                    <CustomButton
                      type="submit"
                      loading={isSubmitting}
                      className="tst-btn-main tst-btn-with-icon"
                    >
                      <Package size={18} className="mr-10" />
                      <span>{values.paymentMethod === 'cash' ? 'Завърши поръчката' : 'Към плащане'}</span>
                    </CustomButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CheckoutForm;

