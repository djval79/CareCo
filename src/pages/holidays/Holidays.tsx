import { PlusIcon } from '@heroicons/react/24/outline'

export default function Holidays() {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Holidays
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage company holidays and observances
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button className="btn-primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Holiday
          </button>
        </div>
      </div>
      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Holidays Module Coming Soon</h3>
          <p className="text-gray-500 mt-2">This module is under development</p>
        </div>
      </div>
    </div>
  )
}