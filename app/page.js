import Image from "next/image";


export default function Home() {
  return (
    <body>
      <div>
        <div>
          <h1 className="flex justify-center pt-40">Asset Tracker</h1>
        </div>
        <div className="flex items-center justify-center p-40">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy now
          </a>
        </div>
        <div>
          <div class="flex items-center justify-center gap-10 py-3 pt-300">
            <input
              type="text"
              placeholder="Asset"
              class="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
            <input
              type="number"
              placeholder="Quantity (£)"
              class="border border-gray-300 rounded px-4 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
          </div>
          <div class="flex items-center justify-center gap-10 py-3">
            <input
              type="text"
              placeholder="Asset"
              class="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
            <input
              type="number"
              placeholder="Quantity (£)"
              class="border border-gray-300 rounded px-4 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
          </div>
          <div class="flex items-center justify-center gap-10 py-3">
            <input
              type="text"
              placeholder="Asset"
              class="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
            <input
              type="number"
              placeholder="Quantity (£)"
              class="border border-gray-300 rounded px-4 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
          </div>
        </div>

      </div>
    </body>
  );
}
