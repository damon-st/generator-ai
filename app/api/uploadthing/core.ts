import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth as Auth } from "@clerk/nextjs";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();
const f = createUploadthing();

const auth = () => {
  const { userId } = Auth();
  return userId;
}; // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ pdf: { maxFileCount: 1, maxFileSize: "32MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user };
    })
    .onUploadError((e) => {
      console.log(e);
    })
    .onUploadComplete(() => {
      console.log("UPLOAD SUCCESSFULLY");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
