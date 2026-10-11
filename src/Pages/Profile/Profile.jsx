import { useState } from 'react'
import axios from 'axios'
import './Profile.css'
import Avatar from '../../Components/Avatar/Avatar'
import Navbar from '../../Components/Navbar/Navbar'
import NavbarCom from '../../Components/NavbarCom/NavbarCom'
import useMe from '../../hooks/useMe'
import {
  API_BASE,
  profileImageUrl,
  companyLogoUrl,
  resumeUrl,
  validateImage,
  validatePdf,
  errorMessage,
} from '../../config'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

// What each upload button sends, where, and how the response updates the page.
const UPLOADS = {
  picture: {
    validate: validateImage,
    endpoint: '/api/profile/picture',
    field: 'profileImage',
    apply: (data) => ({ profileImage: data.profileImage }),
    success: () => 'Profile picture updated.',
  },
  resume: {
    validate: validatePdf,
    endpoint: '/api/post-signup-emp2/upload-resume',
    field: 'resume',
    apply: (data) => ({ resume: data.resume, skills: data.skills, summary: data.summary }),
    success: (data) => data.message,
  },
  logo: {
    validate: validateImage,
    endpoint: '/api/post-signup-com/add-info',
    field: 'companyLogo',
    apply: (data) => ({ companyLogo: data.companyLogo }),
    success: () => 'Company logo updated.',
  },
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

const Profile = () => {
  // Anyone who is not logged in is sent to the login page.
  const { me, setMe, loading } = useMe({ redirectTo: '/login' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const sendFile = async (file, upload) => {
    const problem = upload.validate(file);
    if (problem) return setStatus({ type: 'error', text: problem });

    const form = new FormData();
    form.append(upload.field, file);
    try {
      setBusy(true);
      setStatus({ type: '', text: 'Uploading...' });
      const res = await axios.post(`${API_BASE}${upload.endpoint}`, form, { withCredentials: true });
      setMe((prev) => ({ ...prev, ...upload.apply(res.data) }));
      setStatus({ type: 'success', text: upload.success(res.data) });
    } catch (err) {
      console.error(err.response || err);
      setStatus({ type: 'error', text: errorMessage(err, 'Upload failed') });
    } finally {
      setBusy(false);
    }
  };

  const pickFile = (upload) => (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow choosing the same file again later
    if (file) sendFile(file, upload);
  };

  if (loading || !me) {
    return <div className='profile'><p className='profileLoading'>Loading...</p></div>;
  }

  const isCompany = me.userType === 'company';
  const displayName = isCompany ? me.companyName : (me.fullname || me.username);
  const details = isCompany
    ? [
        ['Email', me.email],
        ['Phone', me.phoneNumber],
        ['Address', me.address],
        ['District', me.district],
      ]
    : [
        ['Username', me.username],
        ['Email', me.email],
        ['Phone', me.phoneNumber],
        ['College / University', me.collegeOrUniversity],
        ['Address', me.address],
        ['District', me.district],
        ['Gender', me.gender],
        ['Birthdate', formatDate(me.birthdate)],
      ];

  return (
    <div className='profile'>
      {isCompany ? <NavbarCom /> : <Navbar />}
      <div className='profileCard'>
        <div className='profileTop'>
          <Avatar
            src={isCompany ? companyLogoUrl(me.companyLogo) : profileImageUrl(me.profileImage)}
            name={displayName}
            size={140}
          />
          <div className='profileTitle'>
            <h1>{displayName}</h1>
            <label className={`uploadButton${busy ? ' disabled' : ''}`}>
              {isCompany ? 'Change logo' : 'Change picture'}
              <input
                type='file'
                accept={IMAGE_ACCEPT}
                disabled={busy}
                onChange={pickFile(isCompany ? UPLOADS.logo : UPLOADS.picture)}
              />
            </label>
          </div>
        </div>

        {status.text && (
          <p className={`profileStatus ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
            {status.text}
          </p>
        )}

        <dl className='profileDetails'>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '-'}</dd>
            </div>
          ))}
        </dl>

        {isCompany ? (
          <div className='profileSection'>
            <h2>About</h2>
            <p>{me.description || 'No description added yet.'}</p>
          </div>
        ) : (
          <>
            <div className='profileSection'>
              <h2>Skills</h2>
              <p>{me.skills || 'No skills detected yet - upload your resume.'}</p>
            </div>
            <div className='profileSection'>
              <h2>Summary</h2>
              <p>{me.summary || 'No summary yet.'}</p>
            </div>
            <div className='profileSection'>
              <h2>Experience</h2>
              <p>{me.experiences || 'No experience added yet.'}</p>
            </div>
            <div className='profileSection'>
              <h2>Resume</h2>
              <p>
                {me.resume ? (
                  <a href={resumeUrl(me.resume)} target='_blank' rel='noreferrer'>View my resume (PDF)</a>
                ) : (
                  'No resume uploaded yet.'
                )}
              </p>
              <label className={`uploadButton${busy ? ' disabled' : ''}`}>
                {me.resume ? 'Replace resume (PDF)' : 'Upload resume (PDF)'}
                <input
                  type='file'
                  accept='.pdf,application/pdf'
                  disabled={busy}
                  onChange={pickFile(UPLOADS.resume)}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
