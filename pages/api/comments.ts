import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import primsa from '@/libs/prismadb'

export default async function (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if( req.method !== "POST") {
      return  res.status(405).end();
    }

    try {
        const { currentUser } =await serverAuth(req, res);
        const { body } = req.body;

        const { postId } = req.query;

        if(!postId || typeof postId !== "string") {
            throw new Error('Invalid ID');
        }

        const comment = await prisma?.comment.create({
            data: {
                body,
                userId: currentUser.id,
                postId
            }
        });

        try {
            const post = await primsa.post.findUnique({
                where: {
                    id: postId
                }
            })

            if(post?.userId) {
                await primsa.notification.create({
                    data: {
                        body: "Some replied to your tweet!",
                        userId: post.userId
                    }
                })

                await primsa.user.update({
                    where: {
                        id: post.userId
                    },
                    data: {
                        hasNotification: true
                    }
                })
            }

        } catch(error) {
            console.log(error);
        }

        return res.status(200).json(comment);
    } catch(error) {
        console.log(error);
        return res.status(400).end();
    }
}