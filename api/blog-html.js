import axios from 'axios'
import { toHTML } from '@portabletext/to-html'

export default async function handler(req, res) {
  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' })
  }

  const query = `*[_type == "blog" && slug.current == $slug][0]{ content }`
  const encodedQuery = encodeURIComponent(query)

  const url = `https://lja7795c.api.sanity.io/v2023-08-01/data/query/production?query=${encodedQuery}&$slug="${slug}"`

  try {
    const response = await axios.get(url)
    const content = response.data.result?.content

    if (!content || content.length === 0) {
      return res.status(404).json({ error: 'Post not found or content is empty' })
    }

    const html = toHTML(content)
    res.status(200).json({ html })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error fetching post' })
  }
}
