
import { Metadata } from "next";
export const metadata : Metadata = {
  title: "Mua hàng"
}
import ShoWInfo from "./ShowInfo";

export default function ShoppingPage() {

  return (
    <div>
      <ShoWInfo />
    </div>
  );
}
