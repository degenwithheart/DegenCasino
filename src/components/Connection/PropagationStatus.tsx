import React from 'react'

type Status = {
  location: string
  country: string
  code: string
  status: 'online' | 'offline'
}

const getFlag = (countryCode: string) =>
  String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))

export const PropagationStatus = ({ statusList }: { statusList: Status[] }) => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">🌍 Domain Propagation Status</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {statusList.map(({ location, country, code, status }) => (
          <div
            key={`${location}-${code}`}
            className={`p-2 sm:p-3 rounded shadow-md border flex items-center justify-between text-base sm:text-lg ${status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <div>
              <span className="text-base sm:text-lg">{getFlag(code)} {location}, {country}</span>
            </div>
            <div>{status === 'online' ? '✅' : '❌'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
