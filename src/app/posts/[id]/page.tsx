import {prisma} from "@/lib/prisma";

import {notFound} from "next/navigation";
// type PageProps = {
//     params: {
//         id: string;
//     };
// }

export default async function Page({ params, }: {params: Promise<{id: string}>})
{
    const id = (await params).id;
    const post = await prisma.post.findUnique({
    where: {
        id: Number(id),
    },
});
    if(!post)
    {
        return notFound();
    }
    return (<div className="text-center text-black">
        <h1 className="text-3xl text-red-500">This is the post with id {id}</h1>
        <p>Người tạo: {post?.title}</p>
    </div>)
}