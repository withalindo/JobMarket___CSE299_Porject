import { useState } from 'react'
import "./TopJobCard.css"
import { companyLogoUrl } from '../../config'

const TopJobCard = (props) => {
  const { job } = props;
  const [failedSrc, setFailedSrc] = useState(null);

  const logo = job?.image || companyLogoUrl(job?.companyLogo);
  const showLogo = Boolean(logo) && failedSrc !== logo;
  const companyName = job?.companyName || job?.company || "Company";

  return (
    <div className='topjobcard'>

      <div className="part1">
        {showLogo ? (
          <img src={logo} alt={companyName} onError={() => setFailedSrc(logo)} />
        ) : (
          <div className="logoFallback">{companyName.trim().charAt(0).toUpperCase()}</div>
        )}
      </div>

      <div className="part2">
        <h1>{job?.title || job?.company || "No Title"}</h1>
        <p>{job?.description || "No Description"}</p>
        <button onClick={() => alert("You have applied for the job: " + job?.title)}>Apply now</button>
      </div>
    </div>
  )
}

export default TopJobCard
