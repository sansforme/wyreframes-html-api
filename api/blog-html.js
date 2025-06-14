import axios from 'axios'
import { toHTML } from '@portabletext/to-html'

export default async function handler(req, res) {
  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' })
  }

  const query = `*[_type == "blog" && slug.current == $slug][0]{ contentRaw }`
  const encodedQuery = encodeURIComponent(query)

  const url = `https://lja7795c.api.sanity.io/v2023-08-01/data/query/production?query=${encodedQuery}&$slug="${slug}"`

  try {
    const response = await axios.get(url)
    const contentRaw = response.data.result?.contentRaw

    if (!contentRaw) {
      return res.status(404).json({ error: 'Post not found or empty' })
    }

    const html = toHTML(contentRaw)
    res.status(200).json({ html })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error fetching post' })
  }
}
