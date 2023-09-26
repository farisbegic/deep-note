import Notebook from "@/components/Notebook";
import constants from "@/config/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import routes from "@/config/routes";
import getDocument from "@/firebase/firestore/getDocument";

export const metadata = {
  title: constants.name,
  description: constants.description,
};

export default async function Home() {
  const session = await getServerSession();

  if (session === null) {
    redirect(routes.auth.path);
  }

  const data = await getDocument(constants.collections.notes, null, [
    ["user.email", "==", session.user.email],
  ]);

  return <Notebook notes={data.result} user={session.user} />;
}
