import { useState } from 'react'
import './JobPost.css'
import axios from 'axios';
import { API_BASE, errorMessage } from '../../config';

const EMPTY_FORM = {
  title: '',
  description: '',
  Salary: '',
  category: ''
};

const JobPost = ({ onPosted }) => {

  //Backend Integration

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [posting, setPosting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return alert("Please enter a job title.");
    }
    try {
      setPosting(true);
      const res = await axios.post(`${API_BASE}/api/post-job`, formData,
        {
          withCredentials: true

        });
        alert(res.data.message);
        setFormData(EMPTY_FORM);
        if (onPosted) onPosted();

    } catch (error) {
      alert(errorMessage(error, "Failed to post job. Please try again."));
      console.error("Error posting job:", error);
    } finally {
      setPosting(false);
    }


  }

  //Backend Integration

  return (
    <div className='JobPost'>
      <div className="headingPart">
        <h1>POST A JOB</h1>
      </div>
      <div className="formPart">
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <input type='text' placeholder='Job Title' name='title' value={formData.title} onChange={handleChange} />
            <input type='text' placeholder='Add A Small Description' name='description' value={formData.description} onChange={handleChange} />
            <input type="text" placeholder='Salary Range' name='Salary' value={formData.Salary} onChange={handleChange} />
            <input type="text" placeholder='Catagory' name='category' value={formData.category} onChange={handleChange} />
            <button type='submit' disabled={posting}>{posting ? 'Posting...' : 'Post Job'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobPost
