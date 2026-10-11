import Avatar from "../Avatar/Avatar";
import "./TopEmpCard.css";
import { profileImageUrl } from "../../config";

const TopEmpCard = (props) => {
  const { employee } = props;
  return (
    <div className='topEmpCard'>

      <div className="imagePart">
        <Avatar src={profileImageUrl(employee?.profileImage)} name={employee?.fullname} />
      </div>

      <div className="infoPart">
        <h1>{employee?.fullname}</h1>
        <p>{employee?.skills}</p>
        <button onClick={() => alert("Employee's Contact details: " + employee?.fullname + " \n " + employee?.email+" \n " + employee?.phoneNumber)}>Contact Now</button>
      </div>
    </div>
  )
}

export default TopEmpCard;
