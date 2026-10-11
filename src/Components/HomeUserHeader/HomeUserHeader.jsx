import Avatar from '../Avatar/Avatar'
import './HomeUserHeader.css'
import { profileImageUrl } from '../../config'

const HomeUserHeader = ({ userInfo }) => {
  let skillsText = "No skills listed";
  if (userInfo?.skills) {
    if (Array.isArray(userInfo.skills)) {
      skillsText = userInfo.skills.length > 0 ? userInfo.skills.join(", ") : "No skills listed";
    } else if (typeof userInfo.skills === "string") {
      skillsText = userInfo.skills;
    }
  }
  return (
    <div className='HomeUserHeader'>
      <div className="namePart">
        <Avatar src={profileImageUrl(userInfo?.profileImage)} name={userInfo?.fullname} size={64} />
        <h1>
          <span className='welcomePart'>Welcome </span>
          {userInfo?.fullname || "User"}
        </h1>
      </div>
      <div className="catagoryPart">
        <h1>
          <span className='catagory'>Skill</span> {skillsText}
        </h1>
      </div>
    </div>
  );
};

export default HomeUserHeader;
