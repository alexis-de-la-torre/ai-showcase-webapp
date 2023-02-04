import {Button, Input, Space, Typography} from "antd"
import Image from "next/image.js"
import {useState} from "react"

const westworldAddr = "https://westworld.ai-showcase.stg.adlt.dev/api/v1/generations/karlo?"

export default function GeneratePage() {
    const [imgSrc, setImageSrc] =
      useState("https://storage.googleapis.com/ai-showcase-stg/a33d19a1-0029-4e57-bd23-58f3eb32b08c.jpg")

    const [prompt, setPrompt] = useState("")

    const [loading, setLoading] = useState(false)

    const handleGenerate = prompt => {
        setLoading(true)

        setPrompt(prompt)

        fetch(westworldAddr + new URLSearchParams({
            promp: prompt,
            qty: 1
        }))
          .then((res) => res.json())
          .then((body) => {

              setImageSrc(body.urls[0])

              setLoading(false);
          })
          .catch(() => {
              setLoading(false);
          });
    }

    return (
      <div style={{ paddingTop: 85, paddingRight: 26, paddingLeft: 26, minHeight: '90vh' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input.Search
                allowClear
                enterButton="Generate"
                size="large"
                onSearch={handleGenerate}
                loading={loading}
              />

              <Image
                width={780}
                 height={844}
                 src={imgSrc}
                 alt="alt"
                 layout="responsive"
              />

              <Typography.Paragraph>
                  {}
              </Typography.Paragraph>
          </Space>
      </div>
    )
}
