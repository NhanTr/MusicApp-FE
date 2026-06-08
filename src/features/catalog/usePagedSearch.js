import { useEffect, useRef, useState } from 'react'

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay, value])

  return debouncedValue
}

function extractItems(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.content || response?.items || response?.results || []
}

export function usePagedSearch(fetchPage, { initialSize = 12, debounceMs = 250, dependencies = [] } = {}) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const [pageSize, setPageSize] = useState(initialSize)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const fetchRef = useRef(fetchPage)
  const requestIdRef = useRef(0)

  useEffect(() => {
    fetchRef.current = fetchPage
  }, [fetchPage])

  useEffect(() => {
    let isMounted = true
    const requestId = ++requestIdRef.current

    async function loadFirstPage() {
      setLoading(true)
      setError('')

      try {
        const response = await fetchRef.current({
          query: debouncedQuery.trim(),
          page: 0,
          size: pageSize,
        })

        if (!isMounted || requestId !== requestIdRef.current) {
          return
        }

        const nextItems = extractItems(response)
        setItems(nextItems)
        setPage(0)
        setTotalElements(response?.totalElements ?? nextItems.length)
        setTotalPages(response?.totalPages ?? (nextItems.length < pageSize ? 1 : 0))
      } catch (err) {
        if (isMounted && requestId === requestIdRef.current) {
          setItems([])
          setPage(0)
          setTotalElements(0)
          setTotalPages(0)
          setError(err.message || 'Không tải được dữ liệu.')
        }
      } finally {
        if (isMounted && requestId === requestIdRef.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    }

    loadFirstPage()

    return () => {
      isMounted = false
    }
  }, [debouncedQuery, pageSize, reloadToken, ...dependencies])

  async function loadMore() {
    if (loading || loadingMore || !hasMore) {
      return
    }

    const nextPage = page + 1
    const requestId = ++requestIdRef.current
    setLoadingMore(true)
    setError('')

    try {
      const response = await fetchRef.current({
        query: debouncedQuery.trim(),
        page: nextPage,
        size: pageSize,
      })

      if (requestId !== requestIdRef.current) {
        return
      }

      const nextItems = extractItems(response)
      setItems((previousItems) => [...previousItems, ...nextItems])
      setPage(nextPage)

      if (response?.totalElements != null) {
        setTotalElements(response.totalElements)
      } else {
        setTotalElements((previousTotal) => previousTotal + nextItems.length)
      }

      if (response?.totalPages != null) {
        setTotalPages(response.totalPages)
      } else if (nextItems.length < pageSize) {
        setTotalPages(nextPage + 1)
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err.message || 'Không tải thêm được dữ liệu.')
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false)
      }
    }
  }

  function reload() {
    setReloadToken((value) => value + 1)
  }

  const hasMore = totalPages > 0 ? page + 1 < totalPages : items.length < totalElements || items.length >= pageSize

  return {
    query,
    setQuery,
    pageSize,
    setPageSize,
    items,
    totalElements,
    totalPages,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  }
}