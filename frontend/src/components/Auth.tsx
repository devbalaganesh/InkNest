import { Link } from "react-router-dom";
import { ChangeEvent,useState } from "react";
import { SigninInput } from "@bala_dev/inknest-common";


export const Auth = ({type}:{type:"signup" | "signin"}) => {
  const  PostInputs = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
        <div className="text-3xl font-extrabold">
          Create an account
          </div>
        <div className="text-slate-400" >
          Already have an account?
          <Link className="underline" to ={"/signin"}>Login</Link>
        </div>
      </div>
 <LabelledInput
  label="Name"
  placeholder="John Doe"
  onChange={(e) => console.log(e.target.value)}
/>
    </div>
    </div>
  );
};


interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}