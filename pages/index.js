import Image from 'next/image'
import styled from "styled-components"
import {Carousel, Divider, Drawer, Spin, Typography} from "antd"
import {useEffect, useRef, useState} from "react"
import InfiniteScroll from 'react-infinite-scroll-component'
// import InfiniteScroll from 'react-awesome-infinite-scroll';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2px;
  line-height: 0;
`;

export async function getServerSideProps() {
    const res = await fetch("https://fake-ig.ai-showcase.stg.adlt.dev/api/v1/posts?pageSize=25&pageNo=0")
    const posts = await res.json();

    return {
        props: {
            postsInit: posts.content
        }
    }
}

export default function Home({postsInit}) {
    const [posts, setPosts] = useState(postsInit)

    const [isModalVisible, setModalVisible] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)

    const [loading, setLoading] = useState(false)
    let [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const sendRequestRef = useRef(true)

    const loadMoreData = () => {
        if (loading) return

        if(sendRequestRef.current === true) {
            sendRequestRef.current = false;

            setLoading(true)

            fetch(`https://fake-ig.ai-showcase.stg.adlt.dev/api/v1/posts?pageSize=25&pageNo=${page}`)
              .then((res) => res.json())
              .then((body) => {
                  setPosts(current => {
                      return [...current, ...body.content]
                  });
                  setLoading(false);
                  setHasMore(!body.empty)
              })
              .catch(() => {
                  setLoading(false);
              });

            setPage(currentPage => {
                return page + 1
            });

            sendRequestRef.current = true;
        }
    }

    // useEffect(() => {
    //     loadMoreData();
    // }, [])

    const showModal = post => {
        setCurrentPost(post)
        setModalVisible(true)
    };

    const refresh = () => {
        setPosts([])
        loadMoreData()
    }

    // console.log(posts)

    return (
        <>
            <InfiniteScroll
              next={loadMoreData}
              hasMore={hasMore}
              loader={<Spin />}
              dataLength={posts.length}
              pullDownToRefresh
              refreshFunction={refresh}
            >
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
            </InfiniteScroll>

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
