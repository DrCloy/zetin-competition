import { useState } from 'react';

export default function DropdownButton({
  items,
}: {
  items: { label: string; onClick: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left -ml-1">
      <div>
        <button
          className="no-underline inline-flex text-center align-middle justify-center gap-x-1 w-full rounded-md border border-gray-500 px-2 py-1 bg-gray-500 text-sm font-normal text-white transision ease-in-out duration-150 active:bg-gray-600 active:border-gray-600 active:cursor-pointer focus:outline-0 focus:bg-gray-600 focus:border-gray-600 focus:shadow-[0_0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
        >
          ...
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="-mr-1 h-4 w-4"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
