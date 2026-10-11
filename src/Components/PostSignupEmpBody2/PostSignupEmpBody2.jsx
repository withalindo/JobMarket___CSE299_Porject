import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import "./PostSignupEmpBody2.css"
import useMe from '../../hooks/useMe';
import { API_BASE, resumeUrl, validatePdf, errorMessage } from '../../config';

const PostSignupEmpBody2 = () => {
  const navigate = useNavigate();
  // The account comes from the login session created at sign-up, so no username has to be typed.
  const { me } = useMe({ redirectTo: '/login', userType: 'employee' });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState("");
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const redirectTimer = useRef(null);

  // Show what is already saved when the person returns to this step.
  useEffect(() => {
    if (!me) return;
    setSkill(me.skills || "");
    setSummary(me.summary || "");
    setExperiences(me.experiences || "");
  }, [me]);

  // Don't navigate after the page has been left.
  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    const problem = validatePdf(file);
    if (problem) {
      setStatus({ type: "error", text: problem });
      setResumeFile(null);
      e.target.value = ""; // clear the rejected file from the input
      return;
    }
    setStatus({ type: "", text: "" });
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      return setStatus({ type: "error", text: "Please choose your resume (PDF) first." });
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("experiences", experiences);

    try {
      setLoading(true);
      setStatus({ type: "", text: "" });
      // withCredentials sends the session cookie; axios sets the multipart boundary itself.
      const res = await axios.post(
        `${API_BASE}/api/post-signup-emp2/upload-resume`,
        formData,
        { withCredentials: true }
      );
      setSkill(res.data.skills || "");
      setSummary(res.data.summary || "");
      setStatus({ type: "success", text: `${res.data.message} Taking you to your home page...` });
      // Give the person a moment to read the detected skills and summary.
      redirectTimer.current = setTimeout(() => navigate("/HomeUser"), 5000);
    } catch (err) {
      console.error(err.response || err);
      setStatus({ type: "error", text: errorMessage(err, "Upload failed") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='postSignupEmpBody2'>
      <h1>Skill Information</h1>
      <form className='skillForm' onSubmit={handleSubmit}>
        <div className="username">
          <input
            type="text"
            placeholder='Username'
            value={me?.username || ""}
            readOnly
            title='Your account username'
          />
        </div>
        <div className="upload">
          <input
            name='resume'
            type='file'
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />
        </div>
        {me?.resume && (
          <p className='currentResume'>
            Current resume: <a href={resumeUrl(me.resume)} target="_blank" rel="noreferrer">view</a> (choose a new file to replace it)
          </p>
        )}
        <div className="texts">
          <input
            type="text"
            name='skill'
            placeholder='Skills'
            value={skill}
            readOnly
          />
          <h1>
            <span className='summary'>Summary: </span>
            {summary ? summary : "Upload your resume to get a summary."}
          </h1>
        </div>
        <div className="experiences">
          <textarea
            cols={60}
            rows={10}
            placeholder='Experience with duration'
            value={experiences}
            onChange={e => setExperiences(e.target.value)}
          />
        </div>
        {status.text && (
          <p className={`status ${status.type}`} role={status.type === "error" ? "alert" : "status"}>
            {status.text}
          </p>
        )}
        <div className="buttons">
          <button type="button" onClick={() => navigate("/PostSignupEmp")}>Back</button>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Get Started"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostSignupEmpBody2
