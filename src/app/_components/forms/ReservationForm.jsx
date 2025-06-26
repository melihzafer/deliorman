"use client";

import { Formik } from 'formik';
import AppData from "@data/app.json";

const ReservationForm = () => {
  return (
    <>
        {/* contact form */}
        <Formik
        initialValues = {{ email: '', first_name: '', last_name: '', time: '', date: '', person: '', message: '' }}
        validate = { values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Задължително поле';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Невалиден имейл адрес';
            }
            return errors;
        }}
        onSubmit = {( values, { setSubmitting } ) => {
            const form = document.getElementById("reservationForm");
            const status = document.getElementById("reservationFormStatus");
            const data = new FormData();

            data.append('first_name', values.first_name);
            data.append('last_name', values.last_name);
            data.append('email', values.email);
            data.append('person', values.person);
            data.append('time', values.time);
            data.append('date', values.date);
            data.append('message', values.message);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "<h5>Благодарим за вашата резервация!</h5>"
                    form.reset()
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = "<h5 style='color:red;'>"+data["errors"].map(error => error["message"]).join(", ")+"</h5>"
                        } else {
                            status.innerHTML = "<h5 style='color:red;'>Упс! Възникна проблем при изпращането на формата</h5>"
                        }
                    })
                }
            }).catch(error => {
                status.innerHTML = "<h5 style='color:red;'>Упс! Възникна проблем при изпращането на формата</h5>"
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
        <form onSubmit={handleSubmit} id="reservationForm" action={AppData.settings.formspreeURL}>
            <div className="row">
                <div className="col-6 col-md-4">
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
                <div className="col-6 col-md-4">
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
                <div className="col-6 col-md-4">
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
                <div className="col-6 col-md-4">
                    <select name="person" className="wide">
                        <option>Брой гости</option>
                        <option value="1">1 човек</option>
                        <option value="2">2 души</option>
                        <option value="3">3 души</option>
                        <option value="4">4 души</option>
                        <option value="5">5 души</option>
                        <option value="6+">6 или повече</option>
                    </select>
                </div>
                <div className="col-6 col-md-4">
                    <input 
                        type="date" 
                        name="date"
                        required="required"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date} 
                    />
                </div>
                <div className="col-6 col-md-4">
                    <select name="time" className="wide">
                        <option>Час</option>
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
                </div>
                <div className="col-12">
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
            <button className="tst-btn" type="submit" name="button">Резервирай маса</button>

            <div id="reservationFormStatus" className="tst-form-status"></div>
        </form>
        )}
        </Formik>
        {/* contact form end */}
    </>
  );
};
export default ReservationForm;