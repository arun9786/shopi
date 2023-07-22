import React, { useRef, useState , useEffect} from 'react'
import $ from 'jquery'

import '../Styles/LogIn.css'
import googleIcon from '../Image/google_icon.png'


function LogIn(){

    const [name,setName]=useState('');
    const [pass,setPass]=useState('');
    const [errorMessage,setErrorMessage]=useState('');

    const userNameref=useRef(null);
    const passwordRef=useRef(null);

    const emailRegex= /^[a-z]{1}[a-z0-9]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const mobileRegex1=/^[6-9]{1}[0-9]{9}$/;
    const mobileRegex2=/^\+91[6-9]{1}[0-9]{9}$/;

    useEffect(()=>{
        $('#form-username').focus();
    },[]);
    const handleSubmit=(event)=>{
        event.preventDefault();
        setErrorMessage('');
        if(name==='' && pass===''){
            setErrorMessage('Enter Username & Password!');
        }else if(name===''){
            setErrorMessage('Enter Username!');
        }else if(pass===''){
            setErrorMessage('Enter Password!');
        }else{
            if(emailRegex.test(name)){
                console.log("entered email")
            }else if(mobileRegex1.test(name) || mobileRegex2.test(name)){
                console.log("entered mobile")
            }else{
                $('#form-username').focus();
                console.log("wrong value")
            }
        }
    }

    
 
    return(
        <div className='outer-container'>
            <div className='main-container'>
                <div className='container'>
                    <form onSubmit={handleSubmit}>
                        <h1 id='login-title'>LogIn</h1>
                        <label htmlFor='form-username' className='form-label' required>Email / Phone</label>
                        <input type="text" id='form-username' className='input-field'  name='username'  value={name} ref={userNameref} onChange={(e) => setName(e.target.value.toLocaleLowerCase())} /><br />
                        <label htmlFor='form-password' className='form-label' required>Password</label>
                        <input type="password" id='form-password' className='input-field' name='password' value={pass} ref={passwordRef} onChange={(e) => setPass(e.target.value)} /><br />
                        <div className='div-forgot-remindme'>
                            <div id='remindme'>
                                <input type='checkbox' id='form-checkbox-remindme' className='form-checkbox'/><label htmlFor='form-checkbox-remindme'>Remind me</label>
                            </div>
                            <div id='fg-pass'>
                                <p id='form-forgot-password'><span className='anchor'>Forgot password?</span></p>
                            </div>
                        </div>
                        <div id='form-error-msg'>{errorMessage}</div>
                        <button type="submit" id='form-submit'>Submit</button>
                        <p id='form-register'>New User? <a href='/register' className='anchor'>Register</a></p>
                        <div className='form-google'>
                            <img src={googleIcon} alt='error'/>
                            <span className='anchor'>Sign in with google</span>
                        </div>           
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LogIn;