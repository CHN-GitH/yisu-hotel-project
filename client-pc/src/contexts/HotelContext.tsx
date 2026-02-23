import { createContext, useContext, useState, ReactNode } from 'react'

interface HotelContextType {
  selectedHotel: string
  setSelectedHotel: (hotelId: string) => void
}

const HotelContext = createContext<HotelContextType | undefined>(undefined)

export function HotelProvider({ children }: { children: ReactNode }) {
  const [selectedHotel, setSelectedHotel] = useState('1')

  return (
    <HotelContext.Provider value={{ selectedHotel, setSelectedHotel }}>
      {children}
    </HotelContext.Provider>
  )
}

export function useHotel() {
  const context = useContext(HotelContext)
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider')
  }
  return context
}
