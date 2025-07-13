"use client"
import { createPost } from "@/actions/actions";
// import {Button} from "@/app/posts/components/dosth-button";
// export function Button({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>){
//     return (<button onClick={() => alert(`button ${children} is clicked!`)} className="hover:text-red-500">{children}</button>);
// }

export function PostForm(){
  return (
    <form action={createPost}>
            <label htmlFor="author">Tên tác giả:</label>
            <input className="border-2" type="text" name="author"></input><br/>
            <label htmlFor="authorId">Mã tác giả:</label>
            <input className="border-2" type="number" name="authorId"></input><br/>
            <button className="hover:text-red-500">Tạo</button>
        </form>
  )
}