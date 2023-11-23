import { useState } from 'react'
import './Account.css'
import EyeIcon from '../assets/EyeIcon.svg'

export const Account = () => {
  
  //Empty Input Constraint
  const[data,setdata]= useState("");

  //Delete Account Popup
  const [isActive, setIsActive] = useState(false);
  const openPopup = () => {
    setIsActive(true);
  };
  const closePopup = () => {
    setIsActive(false);
  };

  const [show, setShow] = useState(false);
  const handleTogglePassword = () => {
    setShow(!show);
  };

  return (
    <div className='main'>
    <div className="Container">
    <button className="Back-Account">{'<'+'Back' }</button>
      <div className="Head">
        Your Profile
      </div>
      <div className="Form-Container">
        <div className="One-Form">
          <h4>Username</h4>
          <input type="text" 
          placeholder='Username'
          value='User12345'/>
        </div>
        <div className="One-Form Password">
          <h4>Password</h4>
          <input type={show ? "text" : "password"} 
          placeholder='Password'
          value='Password12345' />
        </div>
        <button className="EyeIcon" onClick={handleTogglePassword}>
          <img src={EyeIcon} alt="EyeIcon" className='EyeSVG'/>
        </button>

        <div className='One-Form-Long'>
          <h4>Email</h4>
          <input type="email" 
          placeholder='HarrypotterHogwarts@gmail.com'
          value='HarrypotterHogwarts@gmail.com'
          />
        </div>
        
        <div className='One-Form'>
          <h4>Name</h4>
          <input type="text" placeholder='Your Full name' onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className='One-Form'>
          <h4>Phone Number</h4>
          <input type="tel" placeholder='********29'
          maxLength={10}
          onChange={(event)=> setdata(event.target.value)}/>
        </div>
       
        {/* Address */}
        <div className='One-Form-Long'>
          <h4>Address</h4>
          <input type="text" placeholder='Address'onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className='One-Form-Short'>
          <input type="text" placeholder='Country'onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className='One-Form-Short'>
          <input type="text" placeholder='City'onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className='One-Form-Short'>
          <input type="text" placeholder='State'onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className='One-Form-Short'>
          <input type="number" placeholder='Post ID'onChange={(event)=> setdata(event.target.value)}/>
        </div>
        <div className="Row">
        <button className='Small-Button' onClick={openPopup}>Delete Account</button>
        <button className='Small-Button'>Order History</button>
        </div>
        <button className='Save-Button' disabled={!data}>Save Profile</button>
      </div> {/* Form-Container */}
      {isActive && (
        <div className="popup open-popup">
          <div className="popup-content">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account?</p>
            <div className="Row">
            <button className='Small-Button White' onClick={closePopup}>Cancel</button>
            <button className='Small-Button' onClick={closePopup}>Confirm</button>
            </div>
          </div>
        </div>)}

    </div>{/* Container */}
    </div>
  )
}
