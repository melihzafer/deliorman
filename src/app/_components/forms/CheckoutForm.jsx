"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from "@/store/cart-store";
import { checkoutSchema } from '@/lib/validations/checkout';
import { CustomButton } from '../ui/CustomButton';
import { PaymentSelector } from './PaymentSelector';
import { Package, CreditCard, ChevronRight, ChevronLeft, MapPin, Phone, User, MessageSquare, Truck, AlertCircle } from 'lucide-react';
import styles from '@/app/_styles/scss/Checkout.module.scss';

const CheckoutForm = () => {

  const router = useRouter();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);



  return (
    <div className={styles.checkoutContainer}>
      {/* Step Indicator */}
      <div className={styles.stepIndicator}>
        <div className={step === 1 ? `${styles.step} ${styles.active}` : styles.step}>
          <div className={styles.stepCircle}>
            <Truck size={20} />
          </div>
          <div className={styles.stepLabel}>Доставка</div>
        </div>
        <div className={styles.divider} />
        <div className={step === 2 ? `${styles.step} ${styles.active}` : styles.step}>
          <div className={styles.stepCircle}>
            <CreditCard size={20} />
          </div>
          <div className={styles.stepLabel}>Плащане</div>
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
            result.error.issues.forEach(err => {
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
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className={styles.formSection}
                >
                  <div className={styles.sectionTitle}>
                    <Truck size={24} />
                    <span>Детайли за доставка</span>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className={styles.inputGroup}>
                        <label>
                          <User size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          Име и фамилия *
                        </label>
                        <input
                          name="customerName"
                          placeholder="Вашето име"
                          value={values.customerName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.customerName && touched.customerName ? 'error' : ''}
                        />
                        {errors.customerName && touched.customerName && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.errorMessage}
                          >
                            {errors.customerName}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className={styles.inputGroup}>
                        <label>
                          <Phone size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          Телефон *
                        </label>
                        <input
                          name="phone"
                          placeholder="0888 000 000"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.phone && touched.phone ? 'error' : ''}
                        />
                        {errors.phone && touched.phone && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.errorMessage}
                          >
                            {errors.phone}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className={styles.inputGroup}>
                        <label>
                          <MapPin size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          Адрес за доставка *
                        </label>
                        <input
                          name="address"
                          placeholder="Град, улица, номер..."
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.address && touched.address ? 'error' : ''}
                        />
                        {errors.address && touched.address && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.errorMessage}
                          >
                            {errors.address}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className={styles.inputGroup}>
                        <label>
                          <MessageSquare size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          Бележки (опционално)
                        </label>
                        <textarea
                          name="notes"
                          placeholder="Бележки към ресторанта или куриера"
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <div></div>
                    <CustomButton
                      type="button"
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
                      <ChevronRight size={18} style={{ marginLeft: '8px' }} />
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
                  className={styles.formSection}
                >
                  <div className={styles.sectionTitle}>
                    <CreditCard size={24} />
                    <span>Метод на плащане</span>
                  </div>

                  <PaymentSelector
                    value={values.paymentMethod}
                    onChange={(val) => setFieldValue('paymentMethod', val)}
                  />

                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${styles.statusMessage} ${status.type === 'error' ? styles.error : styles.success}`}
                    >
                      <AlertCircle size={18} />
                      <span>{status.message}</span>
                    </motion.div>
                  )}

                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={styles.backButton}
                    >
                      <ChevronLeft size={18} />
                      <span>Назад към доставка</span>
                    </button>

                    <CustomButton
                      type="submit"
                      loading={isSubmitting}
                      className="tst-btn-main tst-btn-with-icon"
                    >
                      <Package size={18} style={{ marginRight: '8px' }} />
                      <span>{values.paymentMethod === 'cash' ? 'Завърши поръчката' : 'Към плащане'}</span>
                    </CustomButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CheckoutForm;
