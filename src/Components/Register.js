import React, { useState , useEffect, useRef} from 'react'
import $ from 'jquery'
import axios from 'axios'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'; 
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import "react-phone-input-2/lib/bootstrap.css";

import '../Styles/Register.css'
import config from '../config.json'
import loadingBar from '../Image/loading-bar-green.svg'
import { validateIndexedDBOpenable } from '@firebase/util';


function Register(){

    const app = firebase.initializeApp(config.firebaseConfig);
    const auth=getAuth(app);

    const recaptchaRef=useRef();

    const [currentUser,setCurrentUser]=useState(null);
    const [firstname,setFirstName]=useState('');
    const [lastname,setLastName]=useState('');
    const [dob,setDob]=useState('');
    const [gender,setGender]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [rePassword,setRepassword]=useState('');
    const [passwordVisible,setPasswordVisible]=useState(false);
    const [phone,setPhone]=useState('');
    const [countryCode, setCountryCode] = useState('');
    const [otp, setOtp] = useState(null);
    const [phoneVerified, setPhoneVerified] = useState(true);
    const [oldCaptchId,setOldCaptchId]=useState('recaptcha')
    const [pincode,setPincode]=useState('');
    const [homeaddress,setHomeaddress]=useState('');
    const [post,setPost]=useState('');
    const [postOfficeUrl,setPostOfficeUrl]=useState([]);
    const [taluk,setTaluk]=useState('');
    const [district,setDistrict]=useState('');
    const [state,setState]=useState('');

    const [errorMessage,setErrorMessage]=useState('');
    const [otpSuccessMsg,setOtpSuccessMsg]=useState('');
    const firstNameRegex=/^[a-zA-Z]{4,}$/;
    const lastNameRegex=/^[a-zA-Z]{1,}$/;
    const dobRegex=/^([1-2][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;
    const emailRegex= /^[a-z]{1}[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const passwordRegex=/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{9,}$/;
    const mobileRegex=/^[6-9]{1}[0-9]{9}$/;
    const pincodeRegex=/^[1-9][0-9]{5}$/

    let recaptchaVerifier;

    const sendOtp=async()=>{
        setOtpSuccessMsg('');
        $('.form-otp-div').hide();
        if(mobileRegex.test(phone)){
            setErrorMessage('')
            try{
                $('#loading-bar-image').show();
                console.log(oldCaptchId);
                if(oldCaptchId=='recaptcha'){
                    recaptchaVerifier =await new RecaptchaVerifier(getAuth(app),'recaptcha',{size: 'invisible'});  
                    sendOTPWithPhoneNumber();
                    setOldCaptchId('recaptcha-1');
                }else if(oldCaptchId=='recaptcha-1'){
                    console.log("hi")
                    recaptchaVerifier =await new RecaptchaVerifier(getAuth(app),'recaptcha-1',{size: 'invisible'});  
                    console.log("ho")
                    sendOTPWithPhoneNumber();
                    setOldCaptchId('recaptcha-2');
                }else if(oldCaptchId=='recaptcha-2'){
                    recaptchaVerifier =await new RecaptchaVerifier(getAuth(app),'recaptcha-2',{size: 'invisible'});  
                    sendOTPWithPhoneNumber();
                }
            }catch(error){
                $('#loading-bar-image').hide();
                setErrorMessage('Error: While verifying recaptcha')
            }
        }else{
            $('.form-otp-div').hide();
            $('#loading-bar-image').hide();
            setErrorMessage('Enter valid mobile number')
        }
    }
    const sendOTPWithPhoneNumber = () => {
        const element = document.getElementById('recaptcha');
        recaptchaVerifier.render(element);
        setErrorMessage('');
        let mobile='+'+countryCode+phone;
        signInWithPhoneNumber(getAuth(app), mobile, recaptchaVerifier)
        .then((confirmationResult) => {
            setCurrentUser(confirmationResult);
            let firstTwo=phone.slice(0,2);
            let middlesixEight=phone.slice(2,8).replace(/[0-9]/g,'*');
            let lastTwo=phone.slice(8);
            let encodedMobile='+'+countryCode+firstTwo+middlesixEight+lastTwo;
            setOtpSuccessMsg('Otp sent to '+encodedMobile);
            $('.form-otp-div').show();
            $('#loading-bar-image').hide();
        })
        .catch((error) => {
            console.log(error);
            setErrorMessage('Error while sending OTP. Check once whether have you entered right phone number.');
            $('.form-otp-div').hide();
            $('#loading-bar-image').hide();
        });
      };
    const verifyOtp=async ()=>{
        $('#loading-bar-image').show();
        currentUser.confirm(otp).then((result) => {
            setErrorMessage("")
            setOtpSuccessMsg('Otp Verified');
            setPhoneVerified(true);
            $('.form-otp-div').hide();
            $('#loading-bar-image').hide();
            $("#form-phone").prop("disabled", true);
            $("#countryCodeSelect").prop("disabled", true);
            $("#btnSendOtp").prop("disabled", true);
        }).catch((error) => {
            $('#loading-bar-image').hide();
           setErrorMessage("You have entered wrong OTP")
        });
    }

    const inputVerification=(id)=>{
        const value=$('#'+id).val().trim();
        setErrorMessage('');
        const successStyle='input-success-style';
        const errorStyle='input-error-style';
        if(id==='form-firstname'){
            if(firstNameRegex.test(value)){
                $("#"+id).removeClass(errorStyle).focus();
                $("#"+id).addClass(successStyle).focus();
            }else{
                $("#"+id).removeClass(successStyle).focus();
                $("#"+id).addClass(errorStyle).focus()
            }
        }else if(id==='form-lastname'){
            if(lastNameRegex.test(value)){
                $("#"+id).removeClass(errorStyle).focus();
                $("#"+id).addClass(successStyle).focus();
            }else{
                $("#"+id).removeClass(successStyle).focus();
                $("#"+id).addClass(errorStyle).focus()
            }
        }else if(id==='form-dob'){
            if(dobRegex.test(value)){
                const today = new Date();
                const givenDate=new Date(value); 
                if(givenDate>today){
                    $("#"+id).removeClass(successStyle);
                    $("#"+id).addClass(errorStyle);
                }else{
                    $("#"+id).removeClass(errorStyle);
                    $("#"+id).addClass(successStyle);
                }
            }else{
                $("#"+id).removeClass(successStyle);
                $("#"+id).addClass(errorStyle);
            }
        }else if(id==='form-gender'){
            if(value===''){
                $("#"+id).css({"border": "2px solid red","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }
        }else if(id==='form-email'){
            if(emailRegex.test(value)){
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid red","outline":"none"});
            }
        }else if(id==='form-pass'){
            let passValue=$('#'+id).val();
            $('#pass-hint-caps').html('✘').css({'color':'red'});
            $('#pass-hint-small').html('✘').css({'color':'red'});
            $('#pass-hint-digit').html('✘').css({'color':'red'});
            $('#pass-hint-symbol').html('✘').css({'color':'red'});
            $('#pass-hint-count').html('✘').css({'color':'red'});
            $('#pass-hint-space').html('✓').css({'color':'green'});
            if(/[A-Z]/.test(passValue)){
                $('#pass-hint-caps').html('✓').css({'color':'green'});
            }if(/[a-z]/.test(passValue)){
                $('#pass-hint-small').html('✓').css({'color':'green'});
            }if(/[0-9]/.test(passValue)){
                $('#pass-hint-digit').html('✓').css({'color':'green'});
            }if(/[!@#$%^&*()_+]/.test(passValue)){
                $('#pass-hint-symbol').html('✓').css({'color':'green'});
            }if(/\s/.test(passValue)){
                $('#pass-hint-space').html('✘').css({'color':'red'});
            }if(passValue.length>8){
                $('#pass-hint-count').html('✓').css({'color':'green'});
            }
            if(passwordRegex.test(passValue)){
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid red","outline":"none"});
            }
        }else if(id=='form-repass'){
            let passValue=$('#'+id).val();
            if(password===passValue){
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid red","outline":"none"});
                setErrorMessage('Password Does not match');
            }
        }else if(id==='form-phone'){
            if(mobileRegex.test(value)){
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid red","outline":"none"});
            }
        }else if(id==='form-pincode'){
            setTaluk('');
            setDistrict('');
            setState('');
            setPost('');
            if(pincode.length<7){
                $("#form-post").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
                $("#form-taluk").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
                $("#form-district").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
                $("#form-state").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
            }
            $("#"+id).css({"border": "2px solid red","outline":"none"});
        }else if(id==='form-address'){
            if(value.length<6){
                $("#"+id).css({"border": "2px solid red","outline":"none"});
            }else{
                $("#"+id).css({"border": "2px solid green","outline":"none"});
            }
        }
    }

    const disableFutureDate=()=>{
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        const minDate = yyyy + '-' + mm + '-' + dd;
        $("#form-dob").attr('max', minDate).on('input',function(){
            setErrorMessage('');
            addClass('','input-error-style');
        });
    }

    const handlePasswordVisible=()=>{
        if(!passwordVisible){
            $('#form-pass').attr('type','text');
            $('#form-repass').attr('type','text');
            setPasswordVisible(true);
        }else{
            $('#form-pass').attr('type','password');
            $('#form-repass').attr('type','password'); 
            setPasswordVisible(false);  
        }
    }

    const pincodeValidation=(e)=>{
        
        let pincodeVal=e.target.value;
        if(pincodeVal.length<=6 && /^[+]?\d+$/.test(pincodeVal)){
            setPincode(pincodeVal);
            inputVerification('form-pincode');
        }else if(pincodeVal.length==0){
            setPincode(e.target.value);
        }
    }

    const postSelect=(e)=>{
        setPost(e.target.value)
        if(e.target.value===''){
            setTaluk('');
            setDistrict('');
            setState('');
            $("#form-post").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
            $("#form-taluk").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
            $("#form-district").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});
            $("#form-state").css({"border": "1px solid rgb(212, 212, 210)","outline":"none"});        
        }
    }

    const handleSubmit=(event)=>{
        event.preventDefault();
        setErrorMessage('');
        addClass('','input-error-style');
        if(!phoneVerified)
        {
            if(!firstNameRegex.test(firstname.trim())){
                setErrorMessage('Enter valid firstname');
                addClass('form-firstname','input-error-style');
            }else if(!lastNameRegex.test(lastname.trim())){
                setErrorMessage('Enter valid lastname');
                addClass('form-lastname','input-error-style');
                addClass('form-firstname','input-success-style');
            }else if(dob.trim()==''){
                setErrorMessage('Select valid date of birth');
                addClass('form-dob','input-error-style');
                addClass('form-lastname','input-success-style');
            }else if(gender.trim()==''){
                setErrorMessage('Select valid gender');
                $("#form-gender").css("border", "2px solid red");
            }else if(!emailRegex.test(email.trim())){
                setErrorMessage('Enter valid Email');
                $("#form-email").css("border", "2px solid red");
            }else if(!passwordRegex.test(password.trim())){
                setErrorMessage('Enter valid Password');
                $("#form-pass").css("border", "2px solid red");
            }else if(!passwordRegex.test(password.trim())){
                setErrorMessage('Enter valid Password');
                $("#form-pass").css("border", "2px solid red");
            }else if(password!==rePassword){
                setErrorMessage('Password Does not match');
                $("#form-repass").css("border", "2px solid red");
            }
            // else if(!phoneVerified){
            //     setErrorMessage('Please verify your phone number');
            //     $("#form-phone").css("border", "2px solid red");
            // }
            else{
                setPhoneVerified(true);
            }
        }else{
            if(!pincodeRegex.test(pincode.trim()) || postOfficeUrl.length==0){
                setErrorMessage('Enter valid pincode');
                addClass('form-pincode','input-error-style');
            }else if(homeaddress.length<6){
                setErrorMessage('Enter valid Line 1 Address');
                addClass('form-address','input-error-style');
            }else if(post===''){
                setErrorMessage('Please Select yout post office');
                addClass('form-post','input-error-style');
            }else{
                let obj={pincode,homeaddress,post,taluk,district,state};
                console.log(obj);
            }
        }
    }

    const addClass=(fieldId,style)=>{
        const arr=['form-firstname','form-lastname','form-dob','form-gender','form-email','form-pass','form-repass'];
        if(fieldId!=''){
            (style=== 'input-error-style')?$("#"+fieldId).addClass(style).focus(): $("#"+fieldId).addClass(style);
        } 
        if(style==='input-error-style'){
            for(let i of arr){
                if(i!==fieldId){
                    removeClass(i,style);
                }
            }
        }
        
    }
    const removeClass=(fieldId,style)=>{
        $("#"+fieldId).removeClass(style);
    }

    useEffect(() => {
        setCountryCode($('#countryCodeSelect').val());
        $('#form-username').focus();
        disableFutureDate();
        $('#form-pass').focus(function(){
            $('.div-password-hint').show();
        });
        $('#form-pass').blur(function(){
            $('.div-password-hint').hide();
        })
    },[]);

    useEffect(()=>{
        if(pincode.length===6){
            setPostOfficeUrl([]);
            var body={
                'pincode':pincode
            }
            axios.post('/api/pincode',body)
                .then(response => {
                    console.log(response);
                    if(response && response.data && response.data.response && response.data.response.PostOffice!==null){
                        setPostOfficeUrl(response.data.response.PostOffice);
                        setErrorMessage('')
                        $("#form-pincode").css({"border": "2px solid green","outline":"none"});
                    }
                    else{
                        if(response && response.data){
                            $("#form-pincode").css({"border": "2px solid red","outline":"none"});
                            if(response.data.response){
                                setErrorMessage(response.data.response.Message+": Check your pincode")
                            }else if(response.data.error){
                                setErrorMessage('Error: Check your network once')
                            }else{
                                setErrorMessage('Enter a valid pincode')
                            }
                        }
                    }
                })
                .catch(error => {
                    $("#form-pincode").css({"border": "2px solid red","outline":"none"});
                    setErrorMessage(error)
                    console.error('Error fetching data:', error);
                });
        }else{
            setPostOfficeUrl([]);
            $('#form-post option:not(:first)').remove();
        }
    },[pincode])

    useEffect(()=>{
        if(postOfficeUrl && postOfficeUrl.length>0){
            for(let i of postOfficeUrl){
                var newOption = $('<option>', {
                    value: i.Name,
                    text: i.Name
                });
                $('#form-post').append(newOption);
            }
        }
    },[postOfficeUrl])

    useEffect(()=>{
        let totalAdded=$('#form-post option').length;
        if(totalAdded>1){
            let value=$('#form-post').val();
            if(value!==''){
                setErrorMessage("")
                let found=false;
                for(let i of postOfficeUrl){
                    if(i.Name==value){
                        setTaluk(i.Taluk);
                        setDistrict(i.District);
                        setState(i.State);
                        console.log("found");
                        found=true;
                    }
                }
                if(!found){
                    setErrorMessage("Something went wrong. Please re enter your pincode")
                }else{
                    $("#form-post").css({"border": "2px solid green","outline":"none"});
                    $("#form-taluk").css({"border": "2px solid green","outline":"none"});
                    $("#form-district").css({"border": "2px solid green","outline":"none"});
                    $("#form-state").css({"border": "2px solid green","outline":"none"});
                }
            }else{
                setTaluk('');
                setDistrict('');
                setState('');
                $("#form-post").css({"border": "2px solid red","outline":"none"});
                $("#form-taluk").css({"border": "2px solid red","outline":"none"});
                $("#form-district").css({"border": "2px solid red","outline":"none"});
                $("#form-state").css({"border": "2px solid red","outline":"none"});
                setErrorMessage("Please select your postoffice")
            }
        }
    },[post]);
 
    return(
        <div className='outer-container'>
            <div className='main-container'>
                <div className='container'>
                    <form onSubmit={handleSubmit}>
                        <h1 id='login-title'>Create Account</h1>

                        {!phoneVerified &&(
                            <div id='div-personal-details'>
                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-firstname' className='form-label' required>First Name</label>
                                        <input type="text" id='form-firstname' className='input-field'  name='firstname'  value={firstname} onChange={(e) => {setFirstName(e.target.value); inputVerification('form-firstname')}} /><br />
                                    </div>
                                    <div>
                                        <label htmlFor='form-lastname' className='form-label' required>Last Name</label>
                                        <input type="text" id='form-lastname' className='input-field'  name='lastname'  value={lastname}  onChange={(e) => { setLastName(e.target.value); inputVerification('form-lastname')}} /><br />
                                    </div>
                                </div>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-dob' className='form-label' required>Date of Birth</label>
                                        <input type="date" id='form-dob' className='input-field'  name='dob'  value={dob}  onChange={(e) =>{ setDob(e.target.value); inputVerification('form-dob')}} /><br />
                                    </div>
                                    <div>
                                        <label htmlFor='form-gender' className='form-label' required>Gender</label>
                                        <select id='form-gender' className='form-gender input-error-style' onChange={(e)=>{setGender(e.target.value); inputVerification('form-gender')}}>
                                            <option  value="" >Select Gender</option>
                                            <option  value="Male">Male</option>
                                            <option  value="Female">Female</option>
                                            <option  value="Others">Others</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-email' className='form-label' required>Email</label>
                                        <input type="email" id='form-email' className='input-field'  name='email'  value={email}  onChange={(e) => {setEmail(e.target.value); inputVerification('form-email')}} /><br />
                                    </div>
                                </div>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-pass' className='form-label' required>Password</label>
                                        <input type="password" id='form-pass' className='input-field'  name='pass'  value={password}  onChange={(e) => {setPassword(e.target.value); inputVerification('form-pass')}} /><br />
                                    </div>   
                                    <div>
                                        <label htmlFor='form-repass' className='form-label' required>Retype Password</label>
                                        <input type="password" id='form-repass' className='input-field'  name='repass'  value={rePassword}  onChange={(e) => {setRepassword(e.target.value); inputVerification('form-repass')}} /><br />
                                    </div>
                                </div>
                                <div className='div-show-password'>
                                    <input type='checkbox' id='form-pass-checkbox' onClick={()=>handlePasswordVisible()}/>
                                    <label htmlFor='form-pass-checkbox'>Show Password</label>
                                </div>

                                <div className='div-password-hint'>
                                    <ul>
                                        <li>At least one uppercase letter (A-Z) <span id='pass-hint-caps'></span></li>
                                        <li>At least one lowercase letter (a-z) <span id='pass-hint-small'></span></li>
                                        <li>At least one digit (0-9) <span id='pass-hint-digit'></span></li>
                                        <li>At least one symbol (e.g., !@#$%^&*()_+) <span id='pass-hint-symbol'></span></li>
                                        <li>Length should be greater than 8 characters <span id='pass-hint-count'></span></li>
                                        <li>No Space <span id='pass-hint-space'></span></li>
                                    </ul>
                                </div>
                                
                                <div className='phone-div-form'>
                                    <label htmlFor='form-phone' className='form-label-phone' required>Phone</label>
                                    <div id='phone-div-form-child1'>
                                        <select id="countryCodeSelect" onChange={(e)=>setCountryCode(e.target.value)}>
                                            <option  value="91" >India (+91)</option>
                                            <option  value="44">UK (+44)</option>
                                            <option  value="1">USA (+1)</option>
                                            <optgroup label="Other countries">
                                                <option  value="213">Algeria (+213)</option>
                                                <option  value="376">Andorra (+376)</option>
                                                <option  value="244">Angola (+244)</option>
                                                <option  value="1264">Anguilla (+1264)</option>
                                                <option  value="1268">Antigua &amp; Barbuda (+1268)</option>
                                                <option  value="54">Argentina (+54)</option>
                                                <option  value="374">Armenia (+374)</option>
                                                <option  value="297">Aruba (+297)</option>
                                                <option  value="61">Australia (+61)</option>
                                                <option  value="43">Austria (+43)</option>
                                                <option  value="994">Azerbaijan (+994)</option>
                                                <option  value="1242">Bahamas (+1242)</option>
                                                <option  value="973">Bahrain (+973)</option>
                                                <option  value="880">Bangladesh (+880)</option>
                                                <option  value="1246">Barbados (+1246)</option>
                                                <option  value="375">Belarus (+375)</option>
                                                <option  value="32">Belgium (+32)</option>
                                                <option  value="501">Belize (+501)</option>
                                                <option  value="229">Benin (+229)</option>
                                                <option  value="1441">Bermuda (+1441)</option>
                                                <option  value="975">Bhutan (+975)</option>
                                                <option  value="591">Bolivia (+591)</option>
                                                <option  value="387">Bosnia Herzegovina (+387)</option>
                                                <option  value="267">Botswana (+267)</option>
                                                <option  value="55">Brazil (+55)</option>
                                                <option  value="673">Brunei (+673)</option>
                                                <option  value="359">Bulgaria (+359)</option>
                                                <option  value="226">Burkina Faso (+226)</option>
                                                <option  value="257">Burundi (+257)</option>
                                                <option  value="855">Cambodia (+855)</option>
                                                <option  value="237">Cameroon (+237)</option>
                                                <option  value="1">Canada (+1)</option>
                                                <option  value="238">Cape Verde Islands (+238)</option>
                                                <option  value="1345">Cayman Islands (+1345)</option>
                                                <option  value="236">Central African Republic (+236)</option>
                                                <option  value="56">Chile (+56)</option>
                                                <option  value="86">China (+86)</option>
                                                <option  value="57">Colombia (+57)</option>
                                                <option  value="269">Comoros (+269)</option>
                                                <option  value="242">Congo (+242)</option>
                                                <option  value="682">Cook Islands (+682)</option>
                                                <option  value="506">Costa Rica (+506)</option>
                                                <option  value="385">Croatia (+385)</option>
                                                <option  value="53">Cuba (+53)</option>
                                                <option  value="90392">Cyprus North (+90392)</option>
                                                <option  value="357">Cyprus South (+357)</option>
                                                <option  value="42">Czech Republic (+42)</option>
                                                <option  value="45">Denmark (+45)</option>
                                                <option  value="253">Djibouti (+253)</option>
                                                <option  value="1809">Dominica (+1809)</option>
                                                <option  value="1809">Dominican Republic (+1809)</option>
                                                <option  value="593">Ecuador (+593)</option>
                                                <option  value="20">Egypt (+20)</option>
                                                <option  value="503">El Salvador (+503)</option>
                                                <option  value="240">Equatorial Guinea (+240)</option>
                                                <option  value="291">Eritrea (+291)</option>
                                                <option  value="372">Estonia (+372)</option>
                                                <option  value="251">Ethiopia (+251)</option>
                                                <option  value="500">Falkland Islands (+500)</option>
                                                <option  value="298">Faroe Islands (+298)</option>
                                                <option  value="679">Fiji (+679)</option>
                                                <option  value="358">Finland (+358)</option>
                                                <option  value="33">France (+33)</option>
                                                <option  value="594">French Guiana (+594)</option>
                                                <option  value="689">French Polynesia (+689)</option>
                                                <option  value="241">Gabon (+241)</option>
                                                <option  value="220">Gambia (+220)</option>
                                                <option  value="7880">Georgia (+7880)</option>
                                                <option  value="49">Germany (+49)</option>
                                                <option  value="233">Ghana (+233)</option>
                                                <option  value="350">Gibraltar (+350)</option>
                                                <option  value="30">Greece (+30)</option>
                                                <option  value="299">Greenland (+299)</option>
                                                <option  value="1473">Grenada (+1473)</option>
                                                <option  value="590">Guadeloupe (+590)</option>
                                                <option  value="671">Guam (+671)</option>
                                                <option  value="502">Guatemala (+502)</option>
                                                <option  value="224">Guinea (+224)</option>
                                                <option  value="245">Guinea - Bissau (+245)</option>
                                                <option  value="592">Guyana (+592)</option>
                                                <option  value="509">Haiti (+509)</option>
                                                <option  value="504">Honduras (+504)</option>
                                                <option  value="852">Hong Kong (+852)</option>
                                                <option  value="36">Hungary (+36)</option>
                                                <option  value="354">Iceland (+354)</option>
                                                <option  value="91">India (+91)</option>
                                                <option  value="62">Indonesia (+62)</option>
                                                <option  value="98">Iran (+98)</option>
                                                <option  value="964">Iraq (+964)</option>
                                                <option  value="353">Ireland (+353)</option>
                                                <option  value="972">Israel (+972)</option>
                                                <option  value="39">Italy (+39)</option>
                                                <option  value="1876">Jamaica (+1876)</option>
                                                <option  value="81">Japan (+81)</option>
                                                <option  value="962">Jordan (+962)</option>
                                                <option  value="7">Kazakhstan (+7)</option>
                                                <option  value="254">Kenya (+254)</option>
                                                <option  value="686">Kiribati (+686)</option>
                                                <option  value="850">Korea North (+850)</option>
                                                <option  value="82">Korea South (+82)</option>
                                                <option  value="965">Kuwait (+965)</option>
                                                <option  value="996">Kyrgyzstan (+996)</option>
                                                <option  value="856">Laos (+856)</option>
                                                <option  value="371">Latvia (+371)</option>
                                                <option  value="961">Lebanon (+961)</option>
                                                <option  value="266">Lesotho (+266)</option>
                                                <option  value="231">Liberia (+231)</option>
                                                <option  value="218">Libya (+218)</option>
                                                <option  value="417">Liechtenstein (+417)</option>
                                                <option  value="370">Lithuania (+370)</option>
                                                <option  value="352">Luxembourg (+352)</option>
                                                <option  value="853">Macao (+853)</option>
                                                <option  value="389">Macedonia (+389)</option>
                                                <option  value="261">Madagascar (+261)</option>
                                                <option  value="265">Malawi (+265)</option>
                                                <option  value="60">Malaysia (+60)</option>
                                                <option  value="960">Maldives (+960)</option>
                                                <option  value="223">Mali (+223)</option>
                                                <option  value="356">Malta (+356)</option>
                                                <option  value="692">Marshall Islands (+692)</option>
                                                <option  value="596">Martinique (+596)</option>
                                                <option  value="222">Mauritania (+222)</option>
                                                <option  value="269">Mayotte (+269)</option>
                                                <option  value="52">Mexico (+52)</option>
                                                <option  value="691">Micronesia (+691)</option>
                                                <option  value="373">Moldova (+373)</option>
                                                <option  value="377">Monaco (+377)</option>
                                                <option  value="976">Mongolia (+976)</option>
                                                <option  value="1664">Montserrat (+1664)</option>
                                                <option  value="212">Morocco (+212)</option>
                                                <option  value="258">Mozambique (+258)</option>
                                                <option  value="95">Myanmar (+95)</option>
                                                <option  value="264">Namibia (+264)</option>
                                                <option  value="674">Nauru (+674)</option>
                                                <option  value="977">Nepal (+977)</option>
                                                <option  value="31">Netherlands (+31)</option>
                                                <option  value="687">New Caledonia (+687)</option>
                                                <option  value="64">New Zealand (+64)</option>
                                                <option  value="505">Nicaragua (+505)</option>
                                                <option  value="227">Niger (+227)</option>
                                                <option  value="234">Nigeria (+234)</option>
                                                <option  value="683">Niue (+683)</option>
                                                <option  value="672">Norfolk Islands (+672)</option>
                                                <option  value="670">Northern Marianas (+670)</option>
                                                <option  value="47">Norway (+47)</option>
                                                <option  value="968">Oman (+968)</option>
                                                <option  value="680">Palau (+680)</option>
                                                <option  value="507">Panama (+507)</option>
                                                <option  value="675">Papua New Guinea (+675)</option>
                                                <option  value="595">Paraguay (+595)</option>
                                                <option  value="51">Peru (+51)</option>
                                                <option  value="63">Philippines (+63)</option>
                                                <option  value="48">Poland (+48)</option>
                                                <option  value="351">Portugal (+351)</option>
                                                <option  value="1787">Puerto Rico (+1787)</option>
                                                <option  value="974">Qatar (+974)</option>
                                                <option  value="262">Reunion (+262)</option>
                                                <option  value="40">Romania (+40)</option>
                                                <option  value="7">Russia (+7)</option>
                                                <option  value="250">Rwanda (+250)</option>
                                                <option  value="378">San Marino (+378)</option>
                                                <option  value="239">Sao Tome &amp; Principe (+239)</option>
                                                <option  value="966">Saudi Arabia (+966)</option>
                                                <option  value="221">Senegal (+221)</option>
                                                <option  value="381">Serbia (+381)</option>
                                                <option  value="248">Seychelles (+248)</option>
                                                <option  value="232">Sierra Leone (+232)</option>
                                                <option  value="65">Singapore (+65)</option>
                                                <option  value="421">Slovak Republic (+421)</option>
                                                <option  value="386">Slovenia (+386)</option>
                                                <option  value="677">Solomon Islands (+677)</option>
                                                <option  value="252">Somalia (+252)</option>
                                                <option  value="27">South Africa (+27)</option>
                                                <option  value="34">Spain (+34)</option>
                                                <option  value="94">Sri Lanka (+94)</option>
                                                <option  value="290">St. Helena (+290)</option>
                                                <option  value="1869">St. Kitts (+1869)</option>
                                                <option  value="1758">St. Lucia (+1758)</option>
                                                <option  value="249">Sudan (+249)</option>
                                                <option  value="597">Suriname (+597)</option>
                                                <option  value="268">Swaziland (+268)</option>
                                                <option  value="46">Sweden (+46)</option>
                                                <option  value="41">Switzerland (+41)</option>
                                                <option  value="963">Syria (+963)</option>
                                                <option  value="886">Taiwan (+886)</option>
                                                <option  value="7">Tajikstan (+7)</option>
                                                <option  value="66">Thailand (+66)</option>
                                                <option  value="228">Togo (+228)</option>
                                                <option  value="676">Tonga (+676)</option>
                                                <option  value="1868">Trinidad &amp; Tobago (+1868)</option>
                                                <option  value="216">Tunisia (+216)</option>
                                                <option  value="90">Turkey (+90)</option>
                                                <option  value="7">Turkmenistan (+7)</option>
                                                <option  value="993">Turkmenistan (+993)</option>
                                                <option  value="1649">Turks &amp; Caicos Islands (+1649)</option>
                                                <option  value="688">Tuvalu (+688)</option>
                                                <option  value="256">Uganda (+256)</option>
                                                <option  value="44">UK (+44)</option>
                                                <option  value="380">Ukraine (+380)</option>
                                                <option  value="971">United Arab Emirates (+971)</option>
                                                <option  value="598">Uruguay (+598)</option>
                                                <option  value="1">USA (+1)</option>
                                                <option  value="7">Uzbekistan (+7)</option>
                                                <option  value="678">Vanuatu (+678)</option>
                                                <option  value="379">Vatican City (+379)</option>
                                                <option  value="58">Venezuela (+58)</option>
                                                <option  value="84">Vietnam (+84)</option>
                                                <option  value="84">Virgin Islands - British (+1284)</option>
                                                <option  value="84">Virgin Islands - US (+1340)</option>
                                                <option  value="681">Wallis &amp; Futuna (+681)</option>
                                                <option  value="969">Yemen (North)(+969)</option>
                                                <option  value="967">Yemen (South)(+967)</option>
                                                <option  value="260">Zambia (+260)</option>
                                                <option  value="263">Zimbabwe (+263)</option>
                                            </optgroup>
                                        </select>
                                        <input type="phone" id='form-phone' className='input-phone'  name='pass'  value={phone}  placeholder='Enter Mobile Number' onChange={(e) => {setPhone(e.target.value); inputVerification('form-phone')}} /><br />

                                    </div>
                                    <div id='phone-div-form-child2'>
                                        <button type='button' id='btnSendOtp' onClick={sendOtp}>Send OTP</button>
                                    </div>

                                </div>
                                <img src={loadingBar} alt='Error' id='loading-bar-image'/>
                                <div className='success-msg'>{otpSuccessMsg}</div>
                                <div className='form-otp-div'>
                                    <div id='form-otp-inside-div'>
                                        <input type='phone' id='otp_input'  placeholder='Enter otp' onChange={(e)=>setOtp(e.target.value)}/>
                                        <button type='button' id='btnVerifyOtp' onClick={verifyOtp}>Verify OTP</button>
                                    </div>
                                </div>
                                <div id='recaptcha'></div>
                                <div id='recaptcha-2'></div>
                                <div id='recaptcha-3'></div>
                            </div>)}

                        {phoneVerified &&(
                            <div id='div-address'>
                                <h2>Address</h2>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-pincode' className='form-label' required>Pincode</label>
                                        <input type="number" id='form-pincode' className='input-field'  name='pincode'  value={pincode}  maxLength='6' onChange={(e) => pincodeValidation(e) }/><br />
                                    </div>
                                    <div>
                                        <label htmlFor='form-address' className='form-label' required>Line 1 Address</label>
                                        <input type="text" id='form-address' className='input-field'  name='address'  value={homeaddress}  onChange={(e) => {setHomeaddress(e.target.value);inputVerification('form-address')}} /><br />
                                    </div>
                                </div>

                                <span></span>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-post' className='form-label' required>Post Office</label>
                                        <select id='form-post' className='input-field'  name='post'  value={post}  onChange={(e) => postSelect(e)} >
                                            <option value=''>Select PostOffice</option>
                                        </select><br />
                                    </div>
                                    <div>
                                        <label htmlFor='form-taluk' className='form-label' required>Taluk</label>
                                        <input type="text" id='form-taluk' className='input-field'  name='taluk'  value={taluk}  disabled onChange={(e) => setTaluk(e.target.value)} /><br />
                                    </div>
                                </div>

                                <div className='every-form-div'>
                                    <div>
                                        <label htmlFor='form-district' className='form-label' required>District</label>
                                        <input type="text" id='form-district' className='input-field'  name='district'  value={district} disabled onChange={(e) => setDistrict(e.target.value)} /><br />
                                    </div>
                                    <div>
                                        <label htmlFor='form-state' className='form-label' required>State</label>
                                        <input type="text" id='form-state' className='input-field'  name='state'  value={state} disabled onChange={(e) => setState(e.target.value)} /><br />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id='form-error-msg'>{errorMessage}</div>
                        <button type="submit" id='form-submit' onClick={()=>handleSubmit}>{phoneVerified?'Submit':'Next'}</button>
                        <p id='form-login'>Already a User? <a href='/' className='anchor'>Login</a></p>
                
                            
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;