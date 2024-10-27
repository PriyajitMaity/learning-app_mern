import { useContext, useState } from "react";
import CommonForm from "@/components/Form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signUpFormControls, signInFormControls } from "@/config/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [showTab, setShowTab] = useState("signin");
  const { signInData, setSignInData, signUpData, setSignUpData, handleSignUpData, handleSignInData } = useContext(AuthContext);

  const handleTabChange = (value) => {
    setShowTab(value);
  };
  const toggleSignInSubmitButton =() =>{
   return signInData && signInData.userEmail !='' && signInData.password !=''
  }
  const toggleSignUpSubmitButton =() =>{
    return signUpData && signUpData.userName!='' && signUpData.userEmail!='' && signUpData.password!=''
  }
  // console.log(signUpData);

  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 m-4" />
          <span className="font-extrabold text-xl">Idemy</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs className="w-full max-w-md" defaultValue="signin" value={showTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader className="text-center">
                <CardTitle>Sign In to your Account</CardTitle>
                <CardDescription>Enter you required details to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInData}
                  setFormData={setSignInData}
                  isSubmitDisable={!toggleSignInSubmitButton()}
                  handleSubmit={handleSignInData}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader className="text-center">
                <CardTitle>Create a new Account</CardTitle>
                <CardDescription>Enter your required details to create your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpData}
                  setFormData={setSignUpData}
                  isSubmitDisable={!toggleSignUpSubmitButton()}
                  handleSubmit={handleSignUpData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
