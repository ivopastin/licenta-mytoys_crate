"use client";
import { useEffect } from "react";

export default function ScrollDebug() {
  useEffect(() => {
    const scroller = document.getElementById("scroll-container");
    if (!scroller) return;

    const log = () => {
      // The page wrapper div is the second child of scroll-container (first is Navbar)
      const pageRoot = scroller.querySelector(".flex.flex-col.w-full") as HTMLElement;
      const children = pageRoot ? Array.from(pageRoot.children) : [];
      console.log("=== SCROLL DEBUG ===");
      console.log("scroller.clientHeight", scroller.clientHeight);
      console.log("scroller.scrollHeight", scroller.scrollHeight);
      console.log("max scrollTop", scroller.scrollHeight - scroller.clientHeight);
      console.log("current scrollTop", scroller.scrollTop);
      children.forEach((el, i) => {
        const h = el as HTMLElement;
        console.log(`section[${i}] offsetTop=${h.offsetTop} height=${h.offsetHeight} class="${h.className.slice(0,80)}"`);
      });
    };

    setTimeout(log, 1000);
    scroller.addEventListener("scroll", log);
    return () => scroller.removeEventListener("scroll", log);
  }, []);
  return null;
}
