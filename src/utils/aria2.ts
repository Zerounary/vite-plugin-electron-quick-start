import Aria2 from "aria2";
import nodefetch from "node-fetch";
import ws from "ws";
import { getPort } from "get-port-please";
import { run } from "@/utils/shell";

let aria2 = null;

export default async () => {
  if (aria2) return aria2;

  let port = await getPort({ random: true });
  console.log("🚀 ~ file: aria2.ts ~ line 13 ~ port", port);

  run(
    `aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all --rpc-listen-port=${port} --conf-path=aria2.conf`
  );

  aria2 = new Aria2({
    WebSocket: ws,
    fetch: nodefetch,
    host: "localhost.charlesproxy.com",
    port,
    secure: false,
    path: "/jsonrpc",
  });

  return aria2;
};
