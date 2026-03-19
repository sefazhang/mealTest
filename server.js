import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/ai-summary', async (req, res) => {
  const { dishes, apiKey } = req.body

  const dishNames = dishes.map(d => d.name).join('、')

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `今日菜单：${dishNames}。请用一句话（30字内）总结这些菜的营养搭配情况。`
        }]
      })
    })

    const data = await response.json()
    console.log('Anthropic response:', JSON.stringify(data))
    if (!response.ok) {
      return res.status(500).json({ error: data })
    }
    res.json({ summary: data.content[0].text })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('代理服务器运行在 http://localhost:3000')
})
