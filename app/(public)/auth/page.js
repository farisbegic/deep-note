import Authentication from "@/components/Authentication";
import routes from "@/config/routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function Auth() {
  const session = await getServerSession();

  if (session !== null) {
    redirect(routes.home.path);
  }
  return <Authentication />;
}

export default Auth;
