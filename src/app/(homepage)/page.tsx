
//components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faTruck, faLock, faGift } from '@fortawesome/free-solid-svg-icons'

import ImageSlider from "@/app/(homepage)/components/image-slider";

export default function HomePage() {
  return (
      <>
        <ImageSlider />
        <div className="flex flex-wrap justify-center items-center gap-10 mt-5">
          <div className="flex flex-col items-center justify-center bg-blue-400 hover:bg-blue-600 text-base transition-transform duration-200 hover:scale-110 text-white sm:text-lg w-[100px] h-[100px] grow max-w-[200px] max-h-[200px]">
            <FontAwesomeIcon icon={faRefresh} className="text-3xl sm:text-4xl" />
            <p className="text-center">Hoàn trả 30 ngày</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-yellow-400 hover:bg-yellow-600 text-base transition-transform duration-200 hover:scale-110 text-white sm:text-lg w-[100px] h-[100px] grow max-w-[200px] max-h-[200px]">
            <FontAwesomeIcon icon={faTruck} className="text-3xl sm:text-4xl" />
            <p className="text-center">Vận chuyển nhanh</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-red-400 hover:bg-red-600 text-base transition-transform duration-200 hover:scale-110 text-white sm:text-lg w-[100px] h-[100px] grow max-w-[200px] max-h-[200px]">
            <FontAwesomeIcon icon={faLock} className="text-3xl sm:text-4xl" />
            <p className="text-center">Thanh toán an toàn</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-cyan-400 hover:bg-cyan-600 text-base transition-transform duration-200 hover:scale-110 text-white sm:text-lg w-[100px] h-[100px] grow max-w-[200px] max-h-[200px]">
            <FontAwesomeIcon icon={faGift} className="text-3xl sm:text-4xl" />
            <p className="text-center">Quà tặng khuyến mãi</p>
          </div>
        </div>
        <div className="mt-5 mb-5">
          <p className="text-5xl text-center">Sản phẩm mới nhất</p>
        </div>
      </>
  );
}
