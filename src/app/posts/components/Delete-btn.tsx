"use client"
import { deletePost } from "@/actions/actions";

export function DeleteButton({postId} : {postId : number}){
    return (                    
    <button onClick={() => deletePost({PostId: postId})} className="text-red-500 hover:text-amber-800">X</button>
    )
}