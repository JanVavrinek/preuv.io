// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

const root = document.getElementById("app");

if (root) mount(() => <StartClient />, root);
