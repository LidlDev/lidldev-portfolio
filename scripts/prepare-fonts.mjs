import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const target = path.join(root, "public/fonts");
fs.mkdirSync(target, { recursive: true });
for (const [name, output] of [
  ["inter", "inter-latin.woff2"],
  ["space-grotesk", "space-grotesk-latin.woff2"],
]) {
  const source = path.join(root, "node_modules/@fontsource-variable", name);
  const file = fs
    .readdirSync(path.join(source, "files"))
    .find((file) => file.endsWith("-latin-wght-normal.woff2"));
  if (!file) throw new Error("Latin variable font not found: " + name);
  fs.copyFileSync(path.join(source, "files", file), path.join(target, output));
  fs.copyFileSync(
    path.join(source, "LICENSE"),
    path.join(target, name + "-OFL.txt"),
  );
}
