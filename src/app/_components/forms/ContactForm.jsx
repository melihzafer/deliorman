"use client";

import { Formik } from 'formik';
import AppData from "@data/app.json";

const ContactForm = () => {
  return (
    <>
        {/* contact form */}
        <Formik
        initialValues = {{ email: '', phone: '', first_name: '', last_name: '', message: '' }}
        validate = { values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address';
            }
            return errors;
        }}
        onSubmit = {( values, { setSubmitting } ) => {
            const form = document.getElementById("contactForm");
            const status = document.getElementById("contactFormStatus");
            const data = new FormData();

            data.append('first_name', values.first_name);
            data.append('last_name', values.last_name);
            data.append('email', values.email);
            data.append('phone', values.phone);
            data.append('message', values.message);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "<h5>Thanks for your submission!</h5>"
                    form.reset()
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = "<h5 style='color:red;'>"+data["errors"].map(error => error["message"]).join(", ")+"</h5>"
                        } else {
                            status.innerHTML = "<h5 style='color:red;'>Oops! There was a problem submitting your form</h5>"
                        }
                    })
                }
            }).catch(error => {
                status.innerHTML = "<h5 style='color:red;'>Oops! There was a problem submitting your form</h5>"
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
        <form onSubmit={handleSubmit} id="contactForm" action={AppData.settings.formspreeURL}>
            <div className="row">
                <div className="col-lg-6">
                    <input 
                        type="text" 
                        placeholder="Име"
                        name="first_name" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.first_name} 
                    />
                </div>
                <div className="col-lg-6">
                    <input 
                        type="text" 
                        placeholder="Фамилия"
                        name="last_name" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.last_name} 
                    />
                </div>
                <div className="col-lg-6">
                    <input 
                        type="tel" 
                        placeholder="Телефон"
                        name="phone" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone} 
                    />
                </div>
                <div className="col-lg-6">
                    <input 
                        type="email" 
                        placeholder="Имейл"
                        name="email" 
                        required="required" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email} 
                    />
                </div>
                <div className="col-lg-12">
                    <textarea 
                        placeholder="Съобщение"
                        name="message" 
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message} 
                        rows="4"
                    />
                </div>
            </div>
            <button className="tst-btn" type="submit" name="button">Изпрати съобщение</button>

            <div id="contactFormStatus" className="tst-form-status"></div>
        </form>
        )}
        </Formik>
        {/* contact form end */}
    </>
  );
};
export default ContactForm;