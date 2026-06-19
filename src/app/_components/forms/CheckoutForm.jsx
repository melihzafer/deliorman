"use client";

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import AppData from "@data/app.json";

const CheckoutForm = () => {
  const t = useTranslations('components.checkout');
  
  return (
    <>
        {/* contact form */}
        <Formik
        initialValues = {{ firstname: '', lastname: '', email: '', tel: '', company: '', country: '', city: '', state: '', address: '', postcode: '', message: '', payment_method: 1 }}
        validate = { values => {
            const errors = {};
            if (!values.email) {
                errors.email = t('requiredField');
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = t('invalidEmail');
            }
            return errors;
        }}
        onSubmit = {( values, { setSubmitting } ) => {
            const form = document.getElementById("checkoutForm");
            const status = document.getElementById("checkoutFormStatus");
            const data = new FormData();

            data.append('firstname', values.firstname);
            data.append('lastname', values.lastname);
            data.append('email', values.email);
            data.append('tel', values.tel);
            data.append('company', values.company);
            data.append('country', values.country);
            data.append('city', values.city);
            data.append('state', values.state);
            data.append('address', values.address);
            data.append('postcode', values.postcode);
            data.append('message', values.message);
            data.append('payment_method', values.payment_method);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = `<h5>${t('successMessage')}</h5>`;
                    form.reset()
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                        } else {
                            status.innerHTML = "<h5>Oops! There was a problem submitting your form</h5>"
                        }
                    })
                }
            }).catch(error => {
                status.innerHTML = "<h5>Oops! There was a problem submitting your form</h5>"
            });

            setSubmitting(false);
        }}
        >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
        }) => (
        <form onSubmit={handleSubmit} id="checkoutForm" action={AppData.settings.formspreeURL} className="tst-checkout-form">
            <div className="tst-mb-30">
                <h5>{t('billingDetails')}</h5>
            </div>
            <div className="row">
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('firstName')}</label>
                    <input 
                        type="text" 
                        placeholder={t('firstNamePlaceholder')}
                        name="firstname" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstname} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('lastName')}</label>
                    <input 
                        type="text" 
                        placeholder={t('lastNamePlaceholder')}
                        name="lastname" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastname} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('company')}</label>
                    <input 
                        type="text" 
                        placeholder={t('companyPlaceholder')}
                        name="company"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.company} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('country')}</label>
                    <input 
                        type="text" 
                        placeholder="Bulgaria"
                        name="country"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.country} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('city')}</label>
                    <input 
                        type="text" 
                        placeholder="Samuil"
                        name="city"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.city} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('state')}</label>
                    <input 
                        type="text" 
                        placeholder="Razgrad"
                        name="state"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.state} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('address')}</label>
                    <input 
                        type="text" 
                        placeholder={t('addressPlaceholder')}
                        name="address"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('postcode')}</label>
                    <input 
                        type="text" 
                        placeholder="7450"
                        name="postcode"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.postcode} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('phone')}</label>
                    <input 
                        type="tel" 
                        placeholder="+359 89 1234567"
                        name="tel"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tel} 
                    />
                </div>
                </div>
                <div className="col-lg-6">
                <div className="tst-group-input">
                    <label>{t('email')}</label>
                    <input 
                        type="email" 
                        placeholder="yourEmail@gmail.com"
                        name="email"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email} 
                    />
                </div>
                </div>
            </div>
            <div className="tst-mb-30">
                <h5>{t('notes')}</h5>
            </div>
            <div className="tst-group-input">
                <label>{t('notes')}</label>
                <textarea 
                    placeholder={t('notesPlaceholder')}
                    name="message" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message} 
                />
            </div>
            <div className="tst-mb-30">
                <h5 className="tst-mb-30">{t('paymentMethod')}</h5>
                <ul>
                    <li className="tst-radio">
                        <input type="radio" id="option-1" name="payment_method" defaultChecked value="1" />
                        <label htmlFor="option-1">{t('bankTransfer')}</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio">
                        <input type="radio" id="option-2" name="payment_method" value="2" />
                        <label htmlFor="option-2">{t('checkPayments')}</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio">
                        <input type="radio" id="option-3" name="payment_method" value="3" />
                        <label htmlFor="option-3">{t('cashOnDelivery')}</label>
                        <div className="tst-check"></div>
                    </li>
                </ul>
            </div>
            {/* button */}
            <button type="submit" className="tst-btn tst-btn-with-icon tst-m-0">
                <span className="tst-icon">
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </span>
                <span>{t('placeOrder')}</span>
            </button>
            {/* button end */}

            <div id="checkoutFormStatus" className="form-status"></div>
        </form>
        )}
        </Formik>
        {/* contact form end */}
    </>
  );
};
export default CheckoutForm;