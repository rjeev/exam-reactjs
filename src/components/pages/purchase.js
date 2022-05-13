import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const Purchase = ({userData}) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [searchParams, setSearchParams ] = useSearchParams();

    const oid = searchParams.get('oid');
    const amt = searchParams.get('amt');
    const refId = searchParams.get('refId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const navigate = useNavigate();
    
    const getPurchaseDetail = async() => {
      
        if (status === 'pass') {
            const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/order/${oid}/${refId}`, {
                method: "GET",
                headers: {
                  'Authorization': 'Bearer '+ userData.token,
              }, 
              });
              const data = await resp.json();
              if (resp.ok) {
                if (data.status) {
                    enqueueSnackbar("Payment successfull", { variant: "success",  anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                  }, });
                } else {
                  enqueueSnackbar("Payment error", { variant: "error",  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }, });
                }
              } else {
                enqueueSnackbar("Payment error", { variant: "error",  anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
              }, });
              }
        } else {
            enqueueSnackbar("Payment error", { variant: "error",  anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
          }, });
        }
        navigate(`/${type}/sets`);
    }

    useEffect(() => {
        if (userData !== null) {
          getPurchaseDetail();
        }
      }, [userData, oid, amt, refId, status, type]);

    return (
        <div/>
    )

}


Purchase.layout = "L1";
export default Purchase;
    