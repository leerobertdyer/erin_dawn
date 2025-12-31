import { useNavigate } from "react-router-dom";
import MainFormTemplate from "./MainFormTemplate";
import CustomInput from "../CustomInput/CustomInput";
import { useState } from "react";
import SubmitBtn from "../Buttons/SubmitBtn";
import { BACKEND_URL } from "../../util/constants";

export default function EmailSignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    
    const resp = await fetch(`${BACKEND_URL}/edc-api/email-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName }),
    })

    if (!resp.ok) {
        alert("Failed to sign up. Please email lee.dyer.dev@gmail.com to sign up.");
        return;
    } else {
        navigate("/");
    }

  }

  return (
    <>
      <MainFormTemplate
        handleClickBack={() => navigate("/")}
        resetState={() => {}}
      >
        <div className="
            w-full h-fit 
            bg-[url('/images/background.jpg')] bg-cover bg-center 
            flex flex-col justify-around items-center rounded-md py-4">

         <div className="bg-white sm:text-lg md:text-2xl rounded-md p-2 m-2 w-[90%] text-center">
            <h1>Erin Dawn Campbell's <br />Mailing List</h1>
         </div>

         <div className="bg-white rounded-md p-2 m-2 w-[90%] text-center">
            <h2 className="text-xs sm:text-lg md:text-2xl">Be the first to know about new series, sales, and more!</h2>
         </div>

         <form onSubmit={handleSubmit} 
            className="flex flex-col items-center gap-4 h-fit p-4 w-[90%] mb-2 bg-white rounded-md text-center">
            <CustomInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <CustomInput
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
            <CustomInput
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
            <SubmitBtn progress={0} />
          </form>
        </div>
      </MainFormTemplate>
    </>
  );
}
