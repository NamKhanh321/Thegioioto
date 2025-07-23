"use client"; // This directive marks the component as a client component in Next.js

import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js

// Define a type for the data object for better type safety and readability
interface CardData {
  [key: string]: string | number | boolean | React.ReactNode | undefined;
  image?: string; // Added optional image property for the URL
}

// Define the structure for a display field entry
interface DisplayField {
  key: string; // The key from the data object
  label: string; // The label to display for this key
}

interface CardProps {
  data: CardData; // The data object to display
  children?: React.ReactNode; // Optional action component or any other children
  title?: string; // Optional title for the card
  displayFields?: DisplayField[]; // Optional array to control which fields to display and their labels
}

/**
 * Card Component
 *
 * A reusable card component that displays data properties, an optional image,
 * and an optional action component at the bottom. It can now
 * accept a `displayFields` array to customize displayed properties.
 *
 * @param {CardProps} props - The props for the Card component.
 * @param {CardData} props.data - An object containing the data to display.
 * @param {React.ReactNode} [props.children] - Optional React nodes (e.g., an <Action> component or buttons) to render at the bottom of the card.
 * @param {string} [props.title] - Optional title to display at the top of the card.
 * @param {DisplayField[]} [props.displayFields] - Optional array of objects { key: string, label: string } to define which fields from `data` to display and their custom labels. If not provided, all data properties will be displayed with auto-formatted labels.
 */
export default function Card({ data, children, title, displayFields }: CardProps) {
  // Determine which fields to render and their labels
  let fieldsToRender: DisplayField[] = [];
  if (displayFields && displayFields.length > 0) {
    // If displayFields are provided, filter them based on presence in data
    fieldsToRender = displayFields.filter(field => data[field.key] !== undefined);
  } else {
    // If no displayFields, map all keys from data and generate default labels
    fieldsToRender = Object.keys(data).map(key => ({ key, label: key.replace(/([A-Z])/g, ' $1').trim() }));
  }

  // Refinement: Filter out the 'image' key from fieldsToRender if data.image exists,
  // as it's handled by the dedicated Image component block.
  if (data.image) {
    fieldsToRender = fieldsToRender.filter(field => field.key !== 'image');
  }

  return (
    <div className="bg-gray-300 rounded-lg shadow-md p-6 max-w-sm mx-auto my-4 border border-gray-500 hover:shadow-lg transition-shadow duration-200">
      {/* Optional Card Title */}
      {title && (
        <h3 className="text-xl text-center font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {title}
        </h3>
      )}

      {/* Optional Card Image - Renders only if data.image is present */}
      {data.image && (
        <div className="mb-4 rounded-md overflow-hidden"> {/* Added a wrapper div for styling */}
          <Image
            src={data.image as string}
            alt={data.name ? `${data.name} image` : "Card image"} // More descriptive alt text if name exists
            width={400} // Example width, adjust as needed
            height={200} // Example height, adjust as needed
            layout="responsive" // Makes the image responsive within its container
            objectFit="cover" // Ensures the image covers the area, cropping if necessary
            className="rounded-md" // Apply rounded corners to the image itself
          />
        </div>
      )}

      {/* Data Display Area */}
      <div className="space-y-2 mb-4">
        {fieldsToRender.length > 0 ? (
          fieldsToRender.map(field => {
            const value = data[field.key];
            return (
              <div key={field.key} className="flex items-start text-sm">
                <span className="font-semibold text-gray-700 capitalize min-w-[80px] pr-2">
                  {field.label}:
                </span>
                <span className="text-gray-600 flex-1 break-words">
                  {/* Render value. If it's a boolean, display "Yes" or "No". */}
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm italic">No data available for this card or no display fields defined.</p>
        )}
      </div>

      {/* Action Component Area (Optional) */}
      {children && (
        <div className="mt-4 pt-4 border-t items-center border-gray-200 flex justify-center space-x-2">
          {children}
        </div>
      )}
    </div>
  );
}