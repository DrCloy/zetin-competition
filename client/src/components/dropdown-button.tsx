import { useState } from 'react';

export default function DropdownButton({
  outerItem,
  outerOptions,
  innerItems,
}: {
  outerItem: string | JSX.Element;
  outerOptions: object;
  innerItems: { label: string; onClick: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left -ml-1">
      <div>
        <button
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          {...outerOptions}
        >
          {outerItem}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 min-w-32 w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 w-full" role="none">
            {innerItems.map((item, index) => (
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
