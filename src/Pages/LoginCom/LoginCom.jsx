import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import '../Login/Login.css'
import { API_BASE, errorMessage } from '../../config';

const LoginCom = () => {
    const navigate = useNavigate();

   // Backend Integration
    const handlelogin = (e) => {
        e.preventDefault();

        const formData = {
            companyName: e.target.username.value,
            password: e.target.password.value,
        };
        if (!formData.companyName || !formData.password) {
            alert("Company Name and password are required!");
            return;
        }
        axios
            .post(`${API_BASE}/api/company-login`, formData, { withCredentials: true })
            .then(() => {
                navigate("/HomeCom");
            })
            .catch((err) => {
                console.error("Login error:", err);
                alert(errorMessage(err, "Login failed. Please check your credentials."));
            });

    }

    // Google / LinkedIn sign-in: the server handles the whole flow and redirects back to the app.
    const handleSocialLogin = (provider) => {
        window.location.href = `${API_BASE}/auth/${provider}/company`;
    };

  return (
    <div className='login'>
      <div className="mainLoginArea">
                <div className="companyName">
                    <h1 className='job'>JOB <span className='market'>MARKET</span></h1>
                </div>

                <form onSubmit={handlelogin} className="inputfields">
                    <input name="username" type='text' placeholder='Company Name' />
                    <input name="password" type='password' placeholder='password' />
                    <button>Login</button>
                </form>
                <div className="socialzone">
                    <h1>Or Login with</h1>
                    <div className="socialbtns">
                        <button type="button" onClick={() => handleSocialLogin("google")}>Google</button>
                        <button type="button" onClick={() => handleSocialLogin("linkedin")}>Linkedin</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default LoginCom
