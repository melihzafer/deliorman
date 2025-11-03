"use client";

import { Formik } from 'formik';
import { useState } from 'react';

const ReservationForm = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  return (
    <>
        {/* reservation form */}
        <Formik
        initialValues = {{ email: '', first_name: '', last_name: '', time: '', date: '', person: '', message: '' }}
        validate = { values => {
            const errors = {};
            
            if (!values.first_name || values.first_name.trim().length < 2) {
                errors.first_name = 'Името трябва да е поне 2 символа';
            }
            
            if (!values.last_name || values.last_name.trim().length < 2) {
                errors.last_name = 'Фамилията трябва да е поне 2 символа';
            }
            
            if (!values.email) {
                errors.email = 'Задължително поле';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Невалиден имейл адрес';
            }
            
            if (!values.person || values.person === '') {
                errors.person = 'Моля изберете брой гости';
            }
            
            if (!values.date) {
                errors.date = 'Моля изберете дата';
            } else {
                const selectedDate = new Date(values.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errors.date = 'Не може да резервирате за минала дата';
                }
            }
            
            if (!values.time || values.time === '') {
                errors.time = 'Моля изберете час';
            }
            
            return errors;
        }}
        onSubmit = { async ( values, { setSubmitting, resetForm } ) => {
            setSubmitStatus({ type: '', message: '' });
            
            const data = new FormData();
            data.append('first_name', values.first_name);
            data.append('last_name', values.last_name);
            data.append('email', values.email);
            data.append('person', values.person);
            data.append('time', values.time);
            data.append('date', values.date);
            data.append('message', values.message);

            try {
                const response = await fetch('/api/reservation', {
                    method: 'POST',
                    body: data,
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setSubmitStatus({ 
                        type: 'success', 
                        message: 'Благодарим за вашата резервация! Ще получите потвърждение скоро.' 
                    });
                    resetForm();
                } else {
                    const errorMessages = result.errors?.map(e => e.message).join(', ') || 'Възникна проблем';
                    setSubmitStatus({ 
                        type: 'error', 
                        message: errorMessages
                    });
                }
            } catch (error) {
                console.error('Form submission error:', error);
                setSubmitStatus({ 
                    type: 'error', 
                    message: 'Грешка при резервацията. Моля, обадете се на +359 89 4766273.' 
                });
            }

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
        }) => (
        <form onSubmit={handleSubmit} id="reservationForm">
            <div className="row">
                <div className="col-6 col-md-4">
                    <input
                        type="text" 
                        placeholder="Име *"
                        name="first_name" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.first_name}
                        className={errors.first_name && touched.first_name ? 'error' : ''}
                    />
                    {errors.first_name && touched.first_name && (
                        <div className="tst-field-error">{errors.first_name}</div>
                    )}
                </div>
                <div className="col-6 col-md-4">
                    <input
                        type="text" 
                        placeholder="Фамилия *"
                        name="last_name" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.last_name}
                        className={errors.last_name && touched.last_name ? 'error' : ''}
                    />
                    {errors.last_name && touched.last_name && (
                        <div className="tst-field-error">{errors.last_name}</div>
                    )}
                </div>
                <div className="col-6 col-md-4">
                    <input 
                        type="email" 
                        placeholder="Имейл *"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className={errors.email && touched.email ? 'error' : ''}
                    />
                    {errors.email && touched.email && (
                        <div className="tst-field-error">{errors.email}</div>
                    )}
                </div>
                <div className="col-6 col-md-4">
                    <select 
                        name="person" 
                        className={`wide ${errors.person && touched.person ? 'error' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.person}
                    >
                        <option value="">Брой гости *</option>
                        <option value="1">1 човек</option>
                        <option value="2">2 души</option>
                        <option value="3">3 души</option>
                        <option value="4">4 души</option>
                        <option value="5">5 души</option>
                        <option value="6+">6 или повече</option>
                    </select>
                    {errors.person && touched.person && (
                        <div className="tst-field-error">{errors.person}</div>
                    )}
                </div>
                <div className="col-6 col-md-4">
                    <input 
                        type="date" 
                        name="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date}
                        className={errors.date && touched.date ? 'error' : ''}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && touched.date && (
                        <div className="tst-field-error">{errors.date}</div>
                    )}
                </div>
                <div className="col-6 col-md-4">
                    <select 
                        name="time" 
                        className={`wide ${errors.time && touched.time ? 'error' : ''}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.time}
                    >
                        <option value="">Час *</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:00">21:00</option>
                        <option value="22:00">22:00</option>
                    </select>
                    {errors.time && touched.time && (
                        <div className="tst-field-error">{errors.time}</div>
                    )}
                </div>
                <div className="col-12">
                    <textarea 
                        placeholder="Допълнително съобщение (незадължително)"
                        name="message" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                        rows="4" 
                    />
                </div>
            </div>
            
            <button 
                className="tst-btn" 
                type="submit" 
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Изпращане...' : 'Резервирай маса'}
            </button>

            {submitStatus.message && (
                <div className={`tst-form-status ${submitStatus.type}`}>
                    <h5 style={{ color: submitStatus.type === 'success' ? '#4CAF50' : '#f44336' }}>
                        {submitStatus.message}
                    </h5>
                </div>
            )}
        </form>
        )}
        </Formik>
        {/* reservation form end */}
        
        <style jsx>{`
            .tst-field-error {
                color: #f44336;
                font-size: 13px;
                margin-top: 5px;
                margin-bottom: 10px;
            }
            
            input.error,
            textarea.error,
            select.error {
                border-color: #f44336 !important;
            }
            
            .tst-form-status {
                margin-top: 20px;
                padding: 15px;
                border-radius: 8px;
                animation: slideIn 0.3s ease;
            }
            
            .tst-form-status.success {
                background-color: #e8f5e9;
                border: 1px solid #4CAF50;
            }
            
            .tst-form-status.error {
                background-color: #ffebee;
                border: 1px solid #f44336;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}</style>
    </>
  );
};
export default ReservationForm;