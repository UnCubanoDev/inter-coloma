export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-pulse">
        <div className="md:col-span-8 bg-gray-200 dark:bg-gray-800 rounded-xl h-48" />
        <div className="md:col-span-4 bg-gray-200 dark:bg-gray-800 rounded-xl h-48" />
        <div className="md:col-span-4 bg-gray-200 dark:bg-gray-800 rounded-xl h-24" />
        <div className="md:col-span-4 bg-gray-200 dark:bg-gray-800 rounded-xl h-24" />
        <div className="md:col-span-4 bg-gray-200 dark:bg-gray-800 rounded-xl h-24" />
      </div>
    </div>
  )
}
