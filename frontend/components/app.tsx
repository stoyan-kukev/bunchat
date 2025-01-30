import "./style.css";
import { createRoot } from "react-dom/client";
import { Root } from "./root.tsx";

document.addEventListener("DOMContentLoaded", () => {
	const root = createRoot(document.getElementById("root")!);
	root.render(<Root />);
});
