import Avatar from '../Avatar/Avatar'
import './HeaderUser.css'
import { profileImageUrl } from '../../config'

// `category` is optional: pages without a category filter (e.g. Users) simply omit that part.
const HeaderUser = ({ fullname, category, profileImage }) => {
  return (
    <div className='HomeUserHeader'>
        <div className="namePart">
            <Avatar src={profileImageUrl(profileImage)} name={fullname} size={64} />
            <h1>
              <span className='fullname'>Name</span> {fullname || "User Name"}
            </h1>
        </div>
        {category !== undefined && (
          <div className="catagoryPart">
              <h1>
                <span className='catagory'>Catagory</span> {category || "Category"}
              </h1>
          </div>
        )}
    </div>
  )
}

export default HeaderUser
