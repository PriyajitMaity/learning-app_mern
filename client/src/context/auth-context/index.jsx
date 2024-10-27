import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInData, initialSignUpData } from "@/config/config";
import { checkAuth, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [signInData, setSignInData] = useState(initialSignInData);
  const [signUpData, setSignUpData] = useState(initialSignUpData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const[loading, setLoading] =useState(true);

  const handleSignUpData = async (e) => {
    e.preventDefault();
    const data = await registerService(signUpData);
    // console.log(data);
  };
  const handleSignInData = async (e) => {
    e.preventDefault();
    const data = await loginService(signInData);
    // console.log(data);
    if (data.success) {
      sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
      setAuth({ authenticate: true, user: data.data.user });
    } else {
      setAuth({ authenticate: false, user: null });
    }
  };

  const checkAuthData = async () => {
    try{
      const data = await checkAuth();
      if (data.success) {
        setAuth({ authenticate: true, user: data.data.user });
        setLoading(false);
      } else {
        setAuth({ authenticate: false, user: null });
        setLoading(false);
      }
    }catch(error){
      console.log(error)
      if(!error?.response?.data?.success){
        setAuth({ authenticate: false, user: null });
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    checkAuthData();
  }, []);
  // console.log(auth);

  const resetCredentials=() =>{
    setAuth({
      authenticate: false,
      user: null,
    })
  }

  return (
    <AuthContext.Provider
      value={{ signInData, setSignInData, signUpData, setSignUpData, handleSignUpData, handleSignInData, auth, resetCredentials }}
    >
      {
        !loading ? children : <Skeleton />
      }
    </AuthContext.Provider>
  );
};
export default AuthProvider;
