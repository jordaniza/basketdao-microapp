import type { GetStaticProps, NextPage } from 'next'

type Props = { data: string }
export const getStaticProps: GetStaticProps<Props> = async () => {
  console.debug('[NextJS] Called getStaticProps');
  return {
    props: {
      data: 'Hey, everyone...I\'m YI LONG MA!'
    }
  }
};

const Home: NextPage<Props> = (props) => {
  return (
      <div className='w-screen h-screen flex flex-wrap items-center justify-center'>
        <p className='w-full text-center'>{props.data}</p>
        <button>CLICK</button>
      </div>
    )
}

export default Home
