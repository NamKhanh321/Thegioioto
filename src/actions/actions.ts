"use server";
import {prisma} from "@/lib/prisma"
import { revalidatePath } from "next/cache";
export async function createPost(formData : FormData){
    const author = formData.get("author");
    const authorId = Number(formData.get("authorId"));
    const data = await prisma.post.create({ data: { title: author as string,authorId: authorId as number } })
    if(data)
    console.log("Post created successfully!: ", data);
    else
    console.error("Failed!: ");
    revalidatePath("/post")
}

export async function deletePost({ PostId }: { PostId: number }) 
{
    const result = await prisma.post.delete({where: {id: PostId}})
    if(result)
    {
    console.log("post deleted successfully!");
    revalidatePath("/post");
    }
    else
    console.log("Failed to delete post")
}