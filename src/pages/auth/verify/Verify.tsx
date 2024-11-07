import React, { useEffect } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import Toastify from 'utils/Toastify';
import EndPointProvider from 'utils/EndPointProvider';
import axios from 'axios';
import DutifyLogoImg from "images/dutify-logo.png";

function Verify() {
  const navigate = useNavigate();
  const [token, setToken] = React.useState<string>('');

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const urlToken = urlParams.get('key');
    setToken(urlToken ? urlToken : '');
  }, []);

  const verify = async () => {
    
    let endpoint = EndPointProvider.getAuthEndPoint() + "/verify-email";
    try{
      await axios.post(endpoint, {token: token ? token : ''}, {params: {token: token ? token : ''}});
      navigate('/signed');
    } catch(error) {
      Toastify.error("This Link is Invalid or Expired");
    }
  };

  return (
    <div className="auth-container">
      <div className="wrapper">
        <div className="content">
          <div className="body">
            <div className="header">
              <div className="welcome">
                <div className='w-full flex justify-center mb-14'>
                  <img src={DutifyLogoImg} className='w-[100px] h-[30px]' alt=''/>
                </div>
                <div className="welcome-container">
                  <h1 className='m-0 font-sans font-bold' style={{ fontSize: 48 }}>Confirm email
                    <div className="overlay" />
                  </h1>
                </div>
              </div>
            </div>
            <form>
              <button className="dutify-button login-button text-16 font-semibold font-sans" type="button" onClick={verify}>
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
