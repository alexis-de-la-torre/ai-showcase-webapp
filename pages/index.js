import Image from 'next/image'
import styled from "styled-components"
import {Carousel, Divider, Drawer, Typography} from "antd"
import {useState} from "react"

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2px;
  line-height: 0;
`;

export async function getServerSideProps() {
    const res = await fetch("https://fake-ig.ai-showcase.stg.adlt.dev/api/v1/posts?pageSize=30&pageNo=0")
    const posts = await res.json();

    return {
        props: {
            posts: posts.content
        }
    }
}

export default function Home({posts}) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)

    const showModal = post => {
        setCurrentPost(post)
        setModalVisible(true)
    };

    return (
        <>
            <section>
                <Grid>
                    {posts?.map((post, i) => (
                      <div key={i} onClick={() => showModal(post)}>
                          <Image width={780} height={844}
                                 src={post.imageUrls[0]} />
                      </div>
                    ))}
                </Grid>
            </section>
            {currentPost !== null && (
              <Drawer visible={isModalVisible}
                     onClose={() => setModalVisible(false)}
                     footer={null}>
                  <div style={{paddingLeft: 10, paddingRight: 10}}>
                      <Carousel>
                          {currentPost.imageUrls.map((image, i) => (
                            <Image key={i} width={780}
                                   height={844} src={image} />
                          ))}
                      </Carousel>

                      <Divider />

                      <Typography.Text>{currentPost.caption}</Typography.Text>
                  </div>
              </Drawer>
            )}
        </>
    )
}
