import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

const server_url = import.meta.env.VITE_SERVER_URL;

function useArticleQuery({ problem } = { problem: null }) {
  const { slug } = useParams()

  return useQuery(`${server_url}/problems/v1/${problem ? problem?.slug : slug}`, {
    enabled: !!slug || !!problem?.slug,
    placeholderData: { problem: {} },
    initialData: problem ? { problem } : undefined,
  })
}

export default useArticleQuery
