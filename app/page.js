import Application from "@/components/Application";
import getAll from "@/firebase/firestore/getAll";
import constants from "@/config/constants";

export const metadata = {
  title: constants.name,
  description: constants.description,
};

export default async function Home() {
  const data = await getAll(constants.collection);
  return <Application notes={data} />;
}
