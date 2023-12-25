import { supabase } from "../native-app/lib/supabase";
import { Request } from "express";

export const getUser = (req: Request) => {
  let result = undefined;
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user)
      result = {
        email: user.email,
        id: user.id,
      };
    else {
      result = { error: "Couldn't retrieve user" };
    }
  });
  return result;
};
