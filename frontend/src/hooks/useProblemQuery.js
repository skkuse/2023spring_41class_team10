import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

function useArticleQuery({ problem } = { problem: null }) {
  const { slug } = useParams()

  return useQuery(`/problems/${problem ? problem?.slug : slug}`, {
    enabled: !!slug || !!problem?.slug,
    placeholderData: { problem: {} },
    initialData: problem ? { problem } : undefined,
  })
}

export default useArticleQuery
