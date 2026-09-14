import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.NEXTJS_REVALIDATE_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  revalidatePath('/');

  return Response.json({
    revalidated: true,
  });
}
