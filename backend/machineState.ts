import { Request } from "express";
import { supabase } from "./supabase";

export const latestMachineState = async (req: Request) => {
  // First check for the latest factory score calculated
  const factory = await supabase
    .from("Factory")
    .select("*")
    .eq("user_id", String(req.query.user))
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
    .then((data) => {
      return data;
    });
  if (factory.error) return factory;

  // Get the rest of the machines for factory
  const machines = await supabase
    .from("Machine")
    .select("*")
    .eq("factory_id", factory.data.id)
    .then((data) => {
      return data;
    });
  if (machines.error) return machines;

  return {
    data: { factory: factory.data.score, machines: machines.data },
    error: null,
  };
};
