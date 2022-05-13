import React, { useState, useEffect, useRef, useContext } from "react";
import { useSnackbar } from "notistack";
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../userContext";


const UbtSets = () => {
  const [newSets, setNewSets] = useState([]);
  const [purchasedSets, setPurchasedSets] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const userData = useContext(userContext)
  
  const getUbtSets = async () => {
    setLoading(true);
    const category_id = userData.user.ubt_category_id;
    const response = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/ubt/set/${category_id}/all`, {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer '+ userData.token
      }, 
    });
    if (response.status === 200) {
      const data = await response.json();
      setPurchasedSets(data.payload.purchased);
      setNewSets(data.payload.new_sets);
    } else {
      enqueueSnackbar("Sorry no questions available", { variant: "error" });
    }
    setLoading(false);
  };

  const addToYourList = async (set_id) => {
    const response = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/ubt/set/${set_id}`, {
        method: "POST",
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer '+ userData.token,
          'Content-Type': 'application/json',
      }, 
    });
    if (response.status === 200) {
      const data = await response.json();
      enqueueSnackbar("Question set added to your account", {
        variant: "success",
      });
      getUbtSets();
    } else {
      enqueueSnackbar(
        "Sorry, this question set could not be added to your account",
        { variant: "error" }
      );
    }
  };

  const purchase = async(setId, price) => {
    let body = {};
    body.set_id = setId;
    body.price = price;
    body.type = 'ubt';
    const response = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/order/add`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer '+ userData.token,
        'Content-Type': 'application/json',
      }, 
    });
    if (response.status === 201) {
      //go to esewa
      const data = await response.json();
      setOrderNumber(data.payload.order_number);
      setPurchaseAmount(price);
      formRef.current.submit();

    } else {
      enqueueSnackbar(
        "Sorry, something went wrong",
        { variant: "error" }
      );
    }
  }

  const startExam = async (set_id) => {
    navigate(`/ubt/start/${set_id}`);

    const response = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/ubt/set/${set_id}/reset`, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer '+ userData.token,
        'Content-Type': 'application/json'
    }, 
    });
    if (response.status === 200) {
      const data = await response.json();
    } else {
    }

    
  };

  useEffect(() => {
    if (userData !== null) {
      getUbtSets();
    }
    
  }, []);

  return (
    <div id="wrapper">
     <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="set-list">
              <h1 className="title">Your Question Sets</h1>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  {loading ?
                  [...Array(5)].map((item, index) => (
                    <tr key={index}>
                      <td component="th" scope="row">
                        <Skeleton />
                      </td>
                      <td align="right">
                        <Skeleton />
                      </td>
                      <td align="right">
                        <Skeleton />
                      </td>
                    </tr>
                )):
                  <tbody>
                    {purchasedSets &&
                      purchasedSets.map((purchase, key) => {
                        return (
                          <tr key={purchase.id}>
                            <td>{purchase.set_name}</td>
                            <td>Rs. {purchase.price}</td>
                            {/* <td>{purchase.description}</td> */}
                            <td>
                              <button
                                className="btn btn-success btn-sm float-right"
                                onClick={() => startExam(purchase.set_id)}
                              >
                                Start Test
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {purchasedSets && purchasedSets.length === 0 && (
                      <tr>
                        <td colSpan="3">You have no question set available</td>
                      </tr>
                    )}
                  </tbody>
                  }
                </table>
              </div>
            </div>

            <div className="set-list">
              <h1 className="title">Available Question Sets</h1>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  {loading ?
                  [...Array(5)].map((item, index) => (
                    <tr key={index}>
                      <td component="th" scope="row">
                        <Skeleton />
                      </td>
                      <td align="right">
                        <Skeleton />
                      </td>
                      <td align="right">
                        <Skeleton />
                      </td>
                    </tr>
                )):


                  <tbody>
                    {newSets &&
                      newSets.map((newset) => {
                        return (
                          <tr key={newset.id}>
                            <td>{newset.set_name}</td>
                            <td>Rs {newset.price}</td>
                            <td>
                              {
                                newset.price === 0 ?
                                <button
                                className="btn btn-danger btn-sm float-right"
                                onClick={() => addToYourList(newset.id)}
                              >
                                Add to your list
                              </button>:
                              <button
                              className="btn btn-danger btn-sm float-right"
                              onClick=  {() => purchase(newset.id, newset.price)}
                            >
                              Purchase
                            </button>
                              }
                              
                            </td>
                          </tr>
                        );
                      })}
                    {newSets && newSets.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          No new question sets available to add
                        </td>
                      </tr>
                    )}
                  </tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form action={`${process.env.REACT_APP_esewa_url}`} ref={formRef} method="POST" name="test">
        <input value={purchaseAmount} name="tAmt" type="hidden"/>
        <input value={purchaseAmount} name="amt" type="hidden"/>
        <input value="0" name="txAmt" type="hidden"/>
        <input value="0" name="psc" type="hidden"/>
        <input value="0" name="pdc" type="hidden"/>
        <input value={`${process.env.REACT_APP_esewa_merchant   }`} name="scd" type="hidden"/>
        <input value={orderNumber} name="pid" type="hidden"/>
        <input value={`${process.env.REACT_APP_domain}/purchase?status=pass&type=ubt`} type="hidden" name="su"/>
        <input value={`${process.env.REACT_APP_domain}/purchase?status=fail&type=ubt`} type="hidden" name="fu"/>
      </form>
    </div>
  );
};

UbtSets.layout = "L1";
export default UbtSets;
