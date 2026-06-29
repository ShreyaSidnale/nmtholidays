'use client'

import { useRowLabel } from '@payloadcms/ui'

type ItineraryRow = { title?: string }

export const ItineraryRowLabel = () => {
  const { data, rowNumber } = useRowLabel<ItineraryRow>()
  const day = (rowNumber ?? 0) + 1
  return <span>{`Day ${day}${data?.title ? ` — ${data.title}` : ''}`}</span>
}
