import Image from "next/image"
export default function LoginForm() {
    return (
        <form className="flex flex-col max-w-xs mx-auto mt-8 p-4 bg-blue-200 rounded shadow">
            <Image src="/logo-thegioioto.png" alt="login logo" width={200} height={200} className="self-center"></Image>
            <div className="gap-3 mb-4">
                <div className="flex flex-col">
                    <label htmlFor="username" className="">Tên đăng nhập:</label>
                    <input type="text" name="username" id="username" className="focus:outline-none focus:border-blue-400" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="">Mật khẩu:</label>
                    <input type="password" name="password" id="password" className="focus:outline-none focus:border-blue-400" />
                </div>
            </div>
            <button
                type="submit"
                className="w-full max-w-30 self-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 shadow hover:from-blue-600 hover:to-blue-800 transition"
            >
                Đăng nhập
            </button>
        </form>
    );
}