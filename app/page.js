import Application from "@/components/Application";
import getAll from "@/firebase/firestore/getAll";
import constants from "@/config/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import routes from "@/config/routes";
import get from "@/firebase/firestore/get";

export const metadata = {
  title: constants.name,
  description: constants.description,
};

export default async function Home() {
  const session = await getServerSession();

  if (session === null) {
    redirect(routes.auth.path);
  }
  const data = await get(constants.collections.notes, null, [
    ["user.email", "==", session.user.email],
  ]);

  return <Application notes={data.result} />;
}
