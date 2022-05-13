import React from "react";
import {useNavigate} from "react-router-dom";

const ChooseSets = (userData) => {

    const navigate = useNavigate();

    React.useEffect(() => {
      if (!userData) {
        navigate('/login');
      }
    }, [userData]);

    const goto = (type) =>{
        navigate(`/${type}/sets`);
    }

    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              {/* <a href="#" onClick={()=>goto('ubt')} className="card card-ubt">UBT</a> */}
        
              <a href="#" onClick={()=>goto('cbt')}className="card card-cbt">CBT</a>
            </div>
          </div>
        </div>
      </>
    )
}
  
  ChooseSets.layout = "L2";
  export default ChooseSets;