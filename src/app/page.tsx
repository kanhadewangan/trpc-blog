import Image from "next/image";
import List from "../_components/List";

export default function Home() {
  return (
   <div className="h-screen w-screen flex flex-col justify-center items-center text-black">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is a simple Next.js application.</p>
      <List/>
   </div>
  );
}
