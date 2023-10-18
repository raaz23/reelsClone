import { signInWithGoogle } from "./firebase"; 
import { authContext } from "./AuthProvider";
import { useContext } from "react";
import {Redirect} from "react-router-dom";

let Login = () => {
    let user=useContext(authContext);
  return (
    <>
    
   {(user) && <Redirect to="/"/> } 
      <button
        onClick={() => {
          signInWithGoogle();
          
        }}
        type="button"
        className="btn btn-primary m-4"
      >
        Sign in with Google
      </button>
     
    </>
  );
};

export default Login;
