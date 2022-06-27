
export const a = 1;
export let b = 2;
export default function printMe () {
    console.log("我来自于prints.js");
    console.log(process.env.NODE_ENV)
    // 故意写错console,测试sourcemap
    cnosole.log("我来自于print.jsd");
}
