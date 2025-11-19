'use client'

import { getSuppliersAction } from '@/app/(private)/parts-costs/actions'
import { PartDialog } from '@/components/private/parts-costs/part-dialog'
import type { Supplier } from '@/types/suppliers'
import { useEffect, useState } from 'react'

export function PartsCostsHeaderAction() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const result = await getSuppliersAction()
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch suppliers')
        }
        setSuppliers(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        console.error('Failed to fetch suppliers:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchSuppliers()
  }, [])

  if (loading) {
    return null
  }

  if (error) {
    return null
  }

  return <PartDialog mode="create" suppliers={suppliers} />
}
