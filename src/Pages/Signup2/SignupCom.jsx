import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Signup1/SignupEmp.css';
import { API_BASE, errorMessage } from '../../config';


const SignupCom = () => {
  const navigate = useNavigate();

  // Backend Integration

  const handleloginCom = () => {
    navigate("/loginCom"); // Redirect to login page
  };

  const handleSignupCom = () => {
    alert("You are already on Company Signup");
  };
  const handleSignupEmp = () => {
    navigate("/signupEmp"); // Redirect to signup page
  };

  // Google / LinkedIn sign-up: the server handles the whole flow and redirects back to the app.
  const handleSocialSignup = (provider) => {
    window.location.href = `${API_BASE}/auth/${provider}/company`;
  };

  const handleCompanySignup = (e) => {
  e.preventDefault();

  const formData = {
    companyName: e.target.companyName.value,
    email: e.target.email.value,
    password: e.target.password.value,
    confirmPassword: e.target.confirmPassword.value,
  };

  if (!formData.companyName || !formData.email || !formData.password || !formData.confirmPassword) {
    alert("All fields are required!");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // withCredentials lets the browser keep the session cookie the server sets on sign-up
  axios
    .post(`${API_BASE}/api/signup/company`, formData, { withCredentials: true })
    .then((res) => {
      alert(res.data.message);
      navigate("/PostSignupCom");
    })
    .catch((err) => {
      console.error("Error during company signup:", err);
      alert(errorMessage(err, "Failed to create company account."));
    });
};
  // Backend Integration

  return (
    <div className='signupemp'>
      <div className="mainPart">
        <div className="textZone">
          <h1 className='job'>JOB <span className='market'>MARKET</span></h1>
          <div className="paragraphZone">
            <p>This platform connects job seekers with the right opportunities and helps employers find qualified candidates quickly. Whether you&apos;re searching for your next role or hiring top talent, our intelligent matching system streamlines the process. Easy to use, fast, and reliable — it&apos;s your all-in-one solution for modern job searching and recruitment.</p>
          </div>
          <div className="buttonZone">
            <button className='signupCom'onClick={handleSignupEmp}>Signup as Employee</button>
            <button className='signupEmp'onClick={handleSignupCom}>Signup as Company</button>
          </div>
        </div>

        <div className="formZone">
          <h1 className='header'>Company Signup</h1>
          <div className="formInput">
            <form onSubmit={handleCompanySignup} className='form1'>
              <input name="companyName" type='text' placeholder='Company name'/>
              <input name="email" type='email' placeholder='Email'/>
              <input name="password" type='password' placeholder='Password'/>
              <input name="confirmPassword" type='password' placeholder='Re-enter Password'/>
              <button type='submit'>Create Account</button>
            </form>
          </div>
          <div className="socialsignup">
            <p>Or Register with </p>
            <div className="socialButtons">
              <button type="button" onClick={() => handleSocialSignup("google")}>Google</button>
              <button type="button" onClick={() => handleSocialSignup("linkedin")}>Linkedin</button>
            </div>
            <h1>Already Have an Account <span className='special' onClick={handleloginCom}>Login Here</span></h1>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SignupCom
