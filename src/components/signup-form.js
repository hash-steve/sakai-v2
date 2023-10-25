import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useMemberstack } from "@memberstack/react";
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Divider} from 'primereact/divider';
import {InputText} from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import * as api from './../api/api';
import axios from 'axios';
import * as fn from '../shared/fn';
//import * as cnst from '../shared/constants';

const SignupForm = (props) => {
    const [errorMessage, setErrorMessage] = useState();
    const [prices] = useState(props.prices);
    const [member] = useState(props.member);
    const [planConnections] = useState(props.member && props.member.planConnections);
    const [customFields] = useState(props.member && props.member.customFields);
    const [formMode, setFormMode] = useState('edit');
    const memberstack = useMemberstack();

    const validate = (data) => {
        if(data && data.firstname)
            localStorage.setItem('__sak_regform_firstname', data.firstname);
        
        if(data && data.lastname)
            localStorage.setItem('__sak_regform_lastname', data.lastname);
        
        if(data && data.email)
            localStorage.setItem('__sak_regform_email', data.email);

        if(!formMode==='edit') return;

        let errors = {};

        if (!data.firstname) {
            errors.firstname = 'First Name is required.';
        }

        if (!data.lastname) {
            errors.lastname = 'Last Name is required.';
        }

        if (!data.email) {
            errors.email = 'Email is required.';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'Invalid email address. E.g. example@email.com';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        }

        if (!data.accept) {
            errors.accept = 'You need to agree to the terms and conditions.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {              
        if(formMode==='edit'){
            setFormMode('review');
            return;
        }

        var errors = false;

        try {
            if(!member) {
                const msMember = await memberstack.signupMemberEmailPassword({
                    email: data.email,
                    password: data.password,                
                })
        
                if(msMember) {
                    await memberstack.updateMember({
                        customFields: {
                            firstname: data.firstname,
                            lastname: data.lastname,
                        }
                    });

                    let paramStr=`msmemberid=${msMember.data.member.id}&authemail=${msMember.data.member.auth.email}&firstname=${data.firstname}&lastname=${data.lastname}&datecreate=${msMember.data.member.createdAt}`;                
                    const member=await axios(`/.netlify/functions/member-create?${paramStr}`)
                        .then(function (response) {                    
                            return response;
                            
                        })
                        .catch(function (error) {
                            api.logError(error.statusCode, error.message, msMember.data.member.id);
                            return {
                                statusCode: 422,
                                body: `Error: ${error}`
                            }
                        });
                    
                    let session;
                    if(member.data){
                        session=await api.createUserSession(member.data.data[0].msmemberid, '', member.data.data[0].datecreated);
                    }                    

                    if(!session.data) {
                        api.logError(session.statusCode, session.body, 'Could not create user session', msMember.data.member.id);
                        setErrorMessage('Something went wrong. The error has been logged and will be reviewed.')
                    }
                    else {
                        localStorage.setItem('__sak:session', session.data.data[0].sessionid);

                        await memberstack.purchasePlansWithCheckout({
                            priceId: prices[0].id
                            , cancelUrl: "/"
                            , successUrl: "/"
                            , autoRedirect: true,
                        })
                    }                                      
                }
            }            
        } catch(err) {
            setErrorMessage(err.message);

            if(err) {
                errors = true;
            }

            if(!errors)
                props.handleDialogClose();
            
        }

        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const passwordHeader = <h6>{``}</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Password requirements</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div>
            <Form 
                onSubmit={onSubmit} 
                initialValues={{ 
                    firstname: (customFields && customFields.firstname) ?? localStorage.getItem('__sak_regform_firstname') ?? '', 
                    lastname: (customFields && customFields.lastname) ?? localStorage.getItem('__sak_regform_lastname') ?? '',  
                    email: (member && member.auth.email) ?? localStorage.getItem('__sak_regform_email') ?? '', 
                    password: '', 
                    price: prices[0].id, 
                    accept: false 
                }} 
                validate={validate} 
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className={`${formMode}-mode p-fluid pt-4`}>
                        <div className={`form-message`}>&nbsp;
                            <div className={`${!errorMessage ? 'hidden' : 'ms-response-error'}`}>{errorMessage}&nbsp;</div>
                            <div className={`${formMode==='review' && !errorMessage ? 'review-message' : 'hidden'}`}>Please review and submit the form to create your membership.</div>
                        </div>

                        <div className={`field fle-x gap-3 ${formMode==='review' ? 'mt-4' :''}`}>
                            <Field name="firstname" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-input-icon-right">
                                        <i className="pi pi-user" />
                                        <label htmlFor="firstname" className={classNames({ 'p-error': isFormFieldValid(meta) })}>First Name: <span className='asterisk'>*</span></label>
                                        <InputText 
                                            id="firstname" 
                                            {...input} 
                                            autoFocus = { true }
                                            disabled  = {member && planConnections>0}
                                            readOnly={formMode==='review'}
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                            name='firstname'
                                        />
                                    </span>
                                    <div className={`form-error-container`}>{ getFormErrorMessage(meta)}</div>
                                </div>
                            )} />
                            <Field name="lastname" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-input-icon-right">
                                        <i className="pi pi-user" />
                                        <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Last Name: <span className='asterisk'>*</span></label>
                                        <InputText 
                                            id="lastname" 
                                            {...input}
                                            disabled  = {member && planConnections>0}
                                            readOnly={formMode==='review'}
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })} 
                                            data-ms-member='lastname'
                                        />
                                    </span>
                                    <div className={`form-error-container`}>{ getFormErrorMessage(meta)}</div>
                                </div>
                            )} />
                        </div>
                        <div className="field fle-x gap--3">
                            <Field name="email" 
                                render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-input-icon-right">
                                        <i className="pi pi-envelope" />
                                        <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Email: <span className='asterisk'>*</span></label>
                                        <InputText 
                                            id="email" 
                                            {...input}
                                            disabled  = {member && planConnections>0}
                                            readOnly={formMode==='review'}
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })} 
                                        />
                                        
                                    </span>
                                    <div className={`form-error-container`}>{ getFormErrorMessage(meta)}</div>
                                </div>
                            )} />
                            <Field name="password" 
                                render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-input-icon-right">
                                        <i className="pi">&nbsp;</i>
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password: <span className='asterisk'>*</span></label>
                                        <Password 
                                            id="password" 
                                            {...input}
                                            //autoFocus = { customFields && customFields.firstname ? true : false }
                                            toggleMask = { !member || planConnections===0 }
                                            disabled = { member && planConnections>0 }
                                            readOnly = {formMode==='review'}
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })} 
                                            header={passwordHeader} 
                                            footer={passwordFooter}                                            
                                        />                                        
                                    </span>
                                    <div className={`form-error-container`}>{ getFormErrorMessage(meta)}</div>
                                </div>
                            )} />
                        </div>                            
                       
                        <Field name="accept" type="checkbox" render={({ input, meta }) => (
                            <div className="field-checkbox">
                                <Checkbox 
                                    inputId="accept" 
                                    {...input} 
                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                    disabled = {formMode==='review'}
                                />
                                <label 
                                    htmlFor="accept" 
                                    className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                        I have read and agree to the terms and conditions *
                                </label>
                            </div>
                        )} />
                        <div>
                            &nbsp;
                        </div>
                        <div className={`faux-form-footer`}>
                            <Button 
                                type="button" 
                                label="Back" 
                                onClick={(e) => setFormMode('edit')} 
                                className="sak-button sak-button--alt sak-button-back sak-button-med mt-0 p-button--secondary"
                                disabled = {false}
                            />
                            &nbsp;&nbsp;
                            <Button 
                                type="button" 
                                label={props.member && props.member.auth.email ? "Close" : "Cancel"} 
                                onClick={(e) => props.handleDialogClose(e)} 
                                className="sak-button sak-button--alt sak-button-med mt-0 p-button--secondary" 
                            />   
                            <Button 
                                type="submit" 
                                label={formMode==='edit' ? "Review" : "Create Membership"} 
                                className="sak-button sak-button-med mt-0 p-button-primary" 
                                disabled = {(planConnections && props.member.planConnections>1) || errorMessage ? true : false}
                            />
                        </div>                        
                    </form>
            )} />
        </div>
    );
  }

  export default SignupForm