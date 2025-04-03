"use client";

import { Formik } from 'formik';
import AppData from "@data/app.json";

const OpenTableForm = () => {
  return (
    <>
        {/* contact form */}
        <Formik
        initialValues = {{ email: '', first_name: '', last_name: '', time: '', startDate: '', person: '', message: '' }}
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
            setSubmitting(true);
            return true;
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
            <form id="reservationForm" method="get" className="tst-opentable-form" action={AppData.settings.openTable.actionUrl} target="_blank">
            <div className="row">
                <div className="col-12 col-md-4">
                    <select name="partySize">
                        <option value="1">1 Person</option>
                        <option value="2" defaultValue="selected">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6">6 People</option>
                        <option value="7">7 People</option>
                        <option value="8">8 People</option>
                        <option value="9">9 People</option>
                        <option value="10">10 People</option>
                        <option value="11">11 People</option>
                        <option value="12">12 People</option>
                        <option value="13">13 People</option>
                        <option value="14">14 People</option>
                        <option value="15">15 People</option>
                        <option value="16">16 People</option>
                        <option value="17">17 People</option>
                        <option value="18">18 People</option>
                        <option value="19">19 People</option>
                        <option value="20">20 People</option>
                        <option value="21">Larger party</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <div className="datepicker__container">
                        <input 
                            type="date" 
                            name="startDate"
                            required="required"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.date} 
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <select name="ResTime">
                        <option value="8:00am">8:00 am</option>
                        <option value="8:30am">8:30 am</option>
                        <option value="9:00am">9:00 am</option>
                        <option value="9:30am">9:30 am</option>
                        <option value="10:00am">10:00 am</option>
                        <option value="10:30am">10:30 am</option>
                        <option value="11:00am">11:00 am</option>
                        <option value="11:30am">11:30 am</option>
                        <option value="12:00pm">12:00 pm</option>
                        <option value="12:30pm">12:30 pm</option>
                        <option value="1:00pm">1:00 pm</option>
                        <option value="1:30pm">1:30 pm</option>
                        <option value="2:00pm">2:00 pm</option>
                        <option value="2:30pm">2:30 pm</option>
                        <option value="3:00pm">3:00 pm</option>
                        <option value="3:30pm">3:30 pm</option>
                        <option value="4:00pm">4:00 pm</option>
                        <option value="4:30pm">4:30 pm</option>
                        <option value="5:00pm">5:00 pm</option>
                        <option value="5:30pm">5:30 pm</option>
                        <option value="6:00pm">6:00 pm</option>
                        <option value="6:30pm">6:30 pm</option>
                        <option value="7:00pm" defaultValue="selected">7:00 pm</option>
                        <option value="7:30pm">7:30 pm</option>
                        <option value="8:00pm">8:00 pm</option>
                        <option value="8:30pm">8:30 pm</option>
                        <option value="9:00pm">9:00 pm</option>
                        <option value="9:30pm">9:30 pm</option>
                        <option value="10:00pm">10:00 pm</option>
                        <option value="10:30pm">10:30 pm</option>
                        <option value="11:00pm">11:00 pm</option>
                        <option value="11:30pm">11:30 pm</option>
                    </select>
                </div>
            </div>
            <div className="text-center">
                <button className="tst-btn" type="submit" name="button">Reserve a table</button>
                <p className="tst-powered d-center tst-p-15-0">
                    * Powered by 
                    <img src="/img/ui/icons/opentable.svg" alt="opentable" />
                </p>
            </div>
            
            <input type="hidden" name="RestaurantID" value={AppData.settings.openTable.restaurantID} />
            <input type="hidden" name="rid" value={AppData.settings.openTable.restaurantID} />
            <input type="hidden" name="GeoID" value={AppData.settings.openTable.geoID} />
            <input type="hidden" name="txtDateFormat" value="MM/dd/yyyy" />
            <input type="hidden" name="RestaurantReferralID" value={AppData.settings.openTable.restaurantID} />
            <input type="hidden" name="lang" value={AppData.settings.openTable.lang} />
        </form>
        )}
        </Formik>
        {/* contact form end */}
    </>
  );
};
export default OpenTableForm;