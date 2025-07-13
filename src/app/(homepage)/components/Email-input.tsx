"use client";

import {useState} from "react";


export default function EmailInput(){
    const [formData, setFormData] = useState({email: ""});

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const formNewData = {...formData, email: e.target.value};
        setFormData(formNewData);
    }
    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
    }
    return (<div>
    <form onSubmit={handleSubmit}>
        <input type="text" value={formData.email ?? ""} onChange={handleInputChange} className="bg-white text-black mt-2" placeholder="youremail@gmail.com"></input><br/>
        <button type="submit" className="w-[150px] mt-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded shadow hover:from-blue-600 hover:to-blue-800 transition">Đăng ký</button>
    </form>
    </div>
    );
}