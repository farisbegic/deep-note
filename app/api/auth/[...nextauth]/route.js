import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import constants from "@/config/constants";
import routes from "@/config/routes";
import addDocument from "@/firebase/firestore/addDocument";
import getDocument from "@/firebase/firestore/getDocument";

// get firestore

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: constants.googleOauth.clientId ?? "",
      clientSecret: constants.googleOauth.clientSecret ?? "",
    }),
  ],
  callbacks: {
    async signIn(user) {
      try {
        const userResponse = await getDocument(
          constants.collections.users,
          null,
          [["email", "==", user.user.email]]
        );

        if (userResponse.length === 0) {
          const response = await addDocument(constants.collections.users, {
            name: user.user.name.split(" ")[0],
            surname: user.user.name.split(" ")[1],
            email: user.user.email,
            picture: user.user.image,
          });

          await addDocument(constants.collections.notes, {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "Write your content here!",
                },
              },
            ],
            time: new Date().toISOString(),
            version: "2.28.0",
            name: `First Note`,
            user: {
              id: response.result.id,
              email: user.user.email,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }

      return true;
    },
  },
  pages: {
    signIn: routes.auth.path,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
