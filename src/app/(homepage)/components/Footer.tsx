import  EmailInput  from "./Email-input";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (<div className="flex flex-col mt-auto border-black/10 border-t px-5 py-6 bg-neutral-800 text-white ">
            {/* Titles Row */}
            <div className="flex justify-between gap-5 text-lg sm:text-2xl md:text-3xl sm:gap-10">
                <p className="flex-1 text-left">Thế Giới <span className="text-blue-500">Ô tô</span></p>
                <p className="flex-1 text-left sm:ml-20">Danh mục</p>
                <p className="flex-1 text-left">Liên hệ</p>
            </div>
            {/* Contents Row */}
            <div className="flex justify-between text-xs gap-5 sm:text-sm sm:gap-10">
                <div className="flex-1 text-left">
                    <p>
                        Thế giới ô tô nhận đặt hàng trực tuyến và giao hàng tận nơi.
                        Hỗ trợ đặt dịch vụ trực tuyến qua hệ thống Website của thế giới ô tô
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="https://facebook.com"><FontAwesomeIcon icon={faFacebook} className="text-3xl rounded bg-blue-500 hover:bg-blue-700 text-white mt-3" /></Link>
                        <Link href="https://twitter.com"><FontAwesomeIcon icon={faTwitter} className="text-3xl rounded bg-blue-500 hover:bg-blue-700 text-white mt-3" /></Link>
                        <Link href="https://youtube.com"><FontAwesomeIcon icon={faYoutube} className="text-3xl rounded bg-blue-500 hover:bg-blue-700 text-white mt-3" /></Link>
                        <Link href="https://instagram.com"><FontAwesomeIcon icon={faInstagram} className="text-3xl rounded bg-blue-500 hover:bg-blue-700 text-white mt-3" /></Link>
                    </div>
                </div>
                <div className="flex-1 text-left sm:ml-20">
                    <ul>
                        <li>Lazang - Mâm xe</li>
                        <li>Ca Lăng - Mặt ca lăng</li>
                        <li>Loa</li>
                        <li>nước hoa - Sáp thơm xe hơi</li>
                        <li>Cảm biến</li>
                    </ul>
                </div>
                <div className="flex-1 text-left">
                    <p>
                        Đăng ký nhận bản tin của chúng tôi và nhận các ưu đãi độc quyền
                        mà bạn sẽ không tìm thấy ở bất kỳ nơi nào khác ngay trong hộp thư đến của bạn!
                    </p>
                    <EmailInput />
                </div>
            </div>
        </div>);
}