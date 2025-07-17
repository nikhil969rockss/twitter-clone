import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../../components/svgs/X";

// react-icons
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: "",

        password: "",
    });

    const {
        mutate: loginMutation,
        error,
        isPending,
        isError,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await res.json();

                console.log(data);
                if (!res.ok) throw Error(data.error || "Failed to login");

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },

        onSuccess: () => {
            toast.success("Login successfully");
        },
        onError: () => {
            throw new Error("Something went wrong");
        },
    });

  

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="sm:max-w-screen-xl w-full  mx-auto flex h-screen px-10">
            <div className="flex-1 hidden lg:flex items-center  justify-center">
                <XSvg className=" lg:w-2/3 fill-white" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center ">
                <form
                    className="w-[80%]  mx-auto items-center  md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white">
                        Let's Go.
                    </h1>

                    <div className="flex gap-4 flex-col   w-full sm:w-2/3 ">
                        <label className="input  input-bordered rounded flex items-center gap-2 w-full">
                            <MdOutlineMail />
                            <input
                                type="text"
                                className="p-3 w-full"
                                placeholder="Username"
                                name="username"
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                    </div>
                    <label className="input w-full input-bordered sm:w-2/3 rounded flex items-center gap-2">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className="btn sm:w-2/3 w-full flex items-center justify-center rounded-full btn-primary text-white">
                        {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Login"}
                    </button>
                    {isError && <p className="text-red-500">{error.message}</p>}
                </form>
                <div className="flex flex-col mx-auto   lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg text-center">
                        Don't have an account?
                    </p>
                    <Link to="/signup">
                        <button className="btn  sm:w-2/3 mx-auto block   rounded-full btn-primary text-white btn-outline w-full">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
