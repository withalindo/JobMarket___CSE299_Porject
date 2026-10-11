import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostSignupEmpBody.css';
import Avatar from '../Avatar/Avatar';
import useMe from '../../hooks/useMe';
import { API_BASE, profileImageUrl, validateImage, errorMessage } from '../../config';

const PostSignupEmpBody = () => {

    const navigate = useNavigate();

    // The account comes from the login session created at sign-up (email can't be edited here).
    const { me } = useMe({ redirectTo: '/login', userType: 'employee' });

    // Backend Integration
    const [formData, setFormData] = useState({
        fullname: '',
        phoneNumber: '',
        collegeOrUniversity: '',
        address: '',
        district: '',
        gender: 'Male',
        birthdate: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill the form when the person comes back to this step.
    useEffect(() => {
        if (!me) return;
        setFormData({
            fullname: me.fullname || '',
            phoneNumber: me.phoneNumber || '',
            collegeOrUniversity: me.collegeOrUniversity || '',
            address: me.address || '',
            district: me.district || '',
            gender: me.gender || 'Male',
            birthdate: me.birthdate ? me.birthdate.slice(0, 10) : '',
        });
    }, [me]);

    // Local preview of the chosen picture; released when it changes or the page closes.
    useEffect(() => {
        if (!profileImage) {
            setPreviewUrl('');
            return undefined;
        }
        const url = URL.createObjectURL(profileImage);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [profileImage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setProfileImage(null);
            return;
        }
        const problem = validateImage(file);
        if (problem) {
            setError(problem);
            setProfileImage(null);
            e.target.value = ''; // clear the rejected file from the input
            return;
        }
        setError('');
        setProfileImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (profileImage) {
            data.append('profileImage', profileImage);
        }

        try {
            setSubmitting(true);
            // withCredentials sends the session cookie so the server knows which account this is.
            await axios.post(`${API_BASE}/api/post-signup-emp`, data, { withCredentials: true });
            navigate('/PostSignupEmp2');
        } catch (err) {
            console.error('Error submitting employee details:', err);
            setError(errorMessage(err, 'Failed to save employee details'));
        } finally {
            setSubmitting(false);
        }
    };
    // Backend Integration

    return (
        <div className='postSignupEmpBody'>
            <h1>Personal Information</h1>
            <form className='fullForm' onSubmit={handleSubmit}>
                <div className='uploadSection'>
                    <Avatar
                        src={previewUrl || profileImageUrl(me?.profileImage)}
                        name={formData.fullname || me?.username}
                        size={90}
                    />
                    <div className='uploadControls'>
                        <label htmlFor='profileImage'>Profile picture (JPG, PNG, WEBP or GIF, max 5 MB)</label>
                        <input
                            id='profileImage'
                            name='profileImage'
                            type='file'
                            accept='image/jpeg,image/png,image/webp,image/gif'
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className='infoInputPart1'>
                    <input
                        type='text'
                        name='fullname'
                        placeholder='Full Name'
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={me?.email || ''}
                        readOnly
                        title='Your account email cannot be changed here'
                    />
                    <input
                        type='text'
                        name='phoneNumber'
                        placeholder='Phone Number'
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='text'
                        name='collegeOrUniversity'
                        placeholder='College or University'
                        value={formData.collegeOrUniversity}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='text'
                        name='address'
                        placeholder='Address'
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='infoInputPart2'>
                    <input
                        type='text'
                        name='district'
                        placeholder='District'
                        className='district'
                        value={formData.district}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name='gender'
                        className='selectGen'
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Other'>Other</option>
                    </select>
                </div>
                <div className='infoInputPart3'>
                    <input
                        name='birthdate'
                        type='date'
                        value={formData.birthdate}
                        onChange={handleChange}
                        required
                    />
                    {error && <p className='formError' role='alert'>{error}</p>}
                    <button type='submit' disabled={submitting}>{submitting ? 'Saving...' : 'Next'}</button>
                </div>
            </form>
        </div>
    );
};

export default PostSignupEmpBody;
