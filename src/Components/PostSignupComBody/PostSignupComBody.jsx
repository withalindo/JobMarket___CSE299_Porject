import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import "./PostSignupComBody.css"
import Avatar from '../Avatar/Avatar';
import useMe from '../../hooks/useMe';
import { API_BASE, companyLogoUrl, validateImage, errorMessage } from '../../config';

const PostSignupComBody = () => {
  const navigate = useNavigate();
  // The company comes from the login session created at sign-up (name and email are fixed).
  const { me } = useMe({ redirectTo: '/loginCom', userType: 'company' });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill the form when the company comes back to this step.
  useEffect(() => {
    if (!me) return;
    setPhoneNumber(me.phoneNumber || "");
    setAddress(me.address || "");
    setDistrict(me.district || "");
    setDescription(me.description || "");
  }, [me]);

  // Local preview of the chosen logo; released when it changes or the page closes.
  useEffect(() => {
    if (!companyLogo) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(companyLogo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [companyLogo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCompanyLogo(null);
      return;
    }
    const problem = validateImage(file);
    if (problem) {
      setError(problem);
      setCompanyLogo(null);
      e.target.value = ""; // clear the rejected file from the input
      return;
    }
    setError("");
    setCompanyLogo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("district", district);
    formData.append("description", description);
    if (companyLogo) {
      formData.append("companyLogo", companyLogo);
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/post-signup-com/add-info`,
        formData,
        { withCredentials: true }
      );
      navigate("/HomeCom");
    } catch (err) {
      console.error(err.response || err);
      setError(errorMessage(err, "Failed to add company information."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='postSignupComBody'>
      <h1>Company Information</h1>
      <form onSubmit={handleSubmit} className='postSignupForm'>
        <div className="pictureSec">
          <Avatar
            src={previewUrl || companyLogoUrl(me?.companyLogo)}
            name={me?.companyName}
            size={90}
          />
          <label htmlFor="companyLogo">Company logo (JPG, PNG, WEBP or GIF, max 5 MB)</label>
          <input
            id='companyLogo'
            name='companyLogo'
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            onChange={handleFileChange}
          />
          <hr />
        </div>
        <div className="inputSec">
          <input
            type="text"
            placeholder='Company Name'
            value={me?.companyName || ""}
            readOnly
            title='Your account company name'
          />
          <input
            type="text"
            placeholder='Email'
            value={me?.email || ""}
            readOnly
            title='Your account email'
          />
          <input type="text" placeholder='Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <input type="text" placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="text" placeholder='District' value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div className="textBoxSec">
          <textarea cols={60} rows={10} placeholder='Company Description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          {error && <p className='formError' role='alert'>{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Loading..." : "Get Started"}</button>
        </div>
      </form>
    </div>
  )
}
export default PostSignupComBody;
