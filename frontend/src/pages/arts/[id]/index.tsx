import { FlashDayGateway } from "@/infra/gateways/FlashDayGateway";
import { FetchAdapter } from "@/infra/http/FetchAdapter";
import { withSession } from "@/lib/session";
import { InferGetServerSidePropsType } from "next";

export default function ArtsShow(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      {JSON.stringify(props.art)}
    </div>
  )
}

export const getServerSideProps = withSession(async (context, user) => {
  const id = context.query.id as string
  const httpClient = new FetchAdapter()
  const flashDayGateway = new FlashDayGateway(httpClient)

  try {
    const art = await flashDayGateway.getArt(id)
    const flashDay = await flashDayGateway.get(art.flashDayId as string)
    const currentUserIsOwner = user?.id === flashDay.artistId
    return {
      props: {
        art,
        currentUserIsOwner
      }
    }
  } catch (error) {
    console.log(error)
    return {
      notFound: true
    }
  }

}, { redirectTo: '' })
