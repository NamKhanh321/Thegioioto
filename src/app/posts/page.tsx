import Link from "next/link"
import {prisma} from "@/lib/prisma"
import {PostForm} from "@/app/posts/components/Post-form"
import { DeleteButton } from "./components/Delete-btn";


export default async function PostPage(){
    const data = await prisma.post.findMany();
    return (<div className="text-3xl text-center">
        <h1 className="text-amber-600">This is the post Page</h1>
        <ul>
            {data.map((post) => (
                <li key={post.id} className="mb-2">
                    <Link href={`/posts/${post.id}`} className="text-black hover:underline">{`${post.title}, Ngày tạo: ${new Intl.DateTimeFormat("en-GB").format(post.createdAt)}`}</Link>
                    <DeleteButton postId={post.id}></DeleteButton>
                </li>))}
        </ul>
        <PostForm></PostForm>
    </div>);
}