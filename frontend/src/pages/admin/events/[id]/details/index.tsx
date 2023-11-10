import { use, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import { withSession } from '@/lib/session'
import { Injector } from '@/infra/di/Injector'
import { Contact, FlashDay, IFlashDayGateway } from '@/infra/gateways/FlashDay'
import DefaultLayout from '@/components/layouts/default-layout'
import Flexbox from '@/components/flexbox'
import Text from '@/components/text'
import Card from '@/components/card'
import Icon from '@/components/icon'
import style from './style.module.css'

interface ActionCardProps {
  icon: string,
  label: string,
  path?: string
  onClick?: () => any
}

function ActionCard(props: ActionCardProps) {
  function Wrapper(props: any) {
    if (props.href)
      return (
        <Card
          tagName="a"
          {...props}
        />
      )

    return (
      <Card
        tagName="button"
        type="button"
        {...props}
      />
    )
  }

  return (
    <Wrapper
      href={props.path}
      onClick={props.onClick}
    >
      <Flexbox
        direction={{ xs: 'column' }}
        gap={{ xs: 'large' }}
      >
        <Icon
          name={props.icon}
          sizes={{ xs: 'small', md: 'medium' }}
        />

        <Text types={{ xs: 'caption', md: 'body-1' }}>
          {props.label}
        </Text>
      </Flexbox>
    </Wrapper>
  )
}

export default function EventDetails(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const [flashDay, setFlashDay] = useState<FlashDay>()
  const [isEventActive, setIsEventActive] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    flashDayGateway.get(props.id, {
      signal: controller.signal
    }).then((flashDay) => {
      setFlashDay(flashDay)
      setIsEventActive(flashDay.active)
    })
    return () => controller.abort()
  }, [])

  async function handleActiveEventClick() {
    setIsFetching(true)
    await flashDayGateway.update(flashDay?.id as string, {
      active: !isEventActive,
      artist_id: props.user.id as string
    })
    setIsEventActive(!isEventActive)
    setIsFetching(false)
  }

  async function handleContactDownload() {
    try {
      const response = await flashDayGateway.getContacts(flashDay?.id as string)
      const content = createCSV(response)
      downloadCSV(content)
      pushDownloadContactSuccessFeedback()
    } catch {
      pushDownloadContactErrorFeedback()
    }
  }

  function createCSV(contacts: Contact[]) {
    let csvContent = "data:text/csv;charset=utf-8,";
    const row = ['nome', 'email', 'telefone', 'permite contato'].join(",")
    csvContent += row + "\r\n"
    contacts.forEach(function({ name, email, phone, acceptContact }) {
      const row = [name, email, phone, acceptContact ? 'sim' : 'não'].join(",")
      csvContent += row + "\r\n"
    })
    return csvContent
  }

  function downloadCSV(content: string) {
    const encodedUri = encodeURI(content)
    const link = document.createElement("a")
    const fileName = `${flashDay?.name.toLocaleLowerCase().replaceAll(' ', '-')}.csv`
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function pushDownloadContactSuccessFeedback() {
    toast('CSV gerado com sucesso!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushDownloadContactErrorFeedback() {
    toast('Não foi possível gerar o CSV, tente novamente!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function handleCopyToClipboard() {
    try {
      const origin = location.origin
      const path = `/events/${props.id}`
      const url = new URL(path, origin).href
      navigator.clipboard.writeText(url)
      pushCopyToClipboardSuccessFeedback()
    } catch {
      pushCopyToClipboardErrorFeedback()
    }
  }

  function pushCopyToClipboardSuccessFeedback() {
    toast('Link do evento copiado com sucesso!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushCopyToClipboardErrorFeedback() {
    toast('Não foi possível copiar, tente novamente!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  if (!flashDay) {
    return (
      <div></div>
    )
  }

  const showPath = `/events/${flashDay.id}`
  const editPath = `/admin/events/${flashDay.id}/edit`

  return (
    <DefaultLayout
      title={flashDay.name}
      buttonLabel={isEventActive ? "Desativar evento" : "Ativar evento"}
      buttonAction={handleActiveEventClick}
      buttonLoading={isFetching}
      backButton
    >
      <Flexbox
        direction={{ xs: 'column' }}
        gap={{ xs: 'medium' }}
      >
        <Flexbox
          tagName="ul"
          direction={{ xs: 'column' }}
          style={{ display: 'none' }}
        >
          <Text tagName="li">
            <Flexbox alignItems={{ xs: 'center' }}>
              <Icon
                name="remove_red_eye"
                sizes={{ xs: 'small', md: 'medium' }}
              />

              <span>
                <strong>230</strong> Visualizações
              </span>
            </Flexbox>
          </Text>

          <Text tagName="li">
            <Flexbox alignItems={{ xs: 'center' }}>
              <Icon
                name="show_chart"
                sizes={{ xs: 'small', md: 'medium' }}
              />

              <span>
                <strong>53</strong> Interações
              </span>
            </Flexbox>
          </Text>
        </Flexbox>

        <section className={style.actionGrid}>
          <ActionCard
            icon="launch"
            label="Visualizar evento"
            path={showPath}
          />

          <ActionCard
            icon="edit"
            label="Editar evento"
            path={editPath}
          />

          <ActionCard
            icon="download"
            label="Baixar contatos"
            onClick={handleContactDownload}
          />

          <ActionCard
            icon="ios_share"
            label="Compartilhar"
            onClick={handleCopyToClipboard}
          />
        </section>
      </Flexbox>
    </DefaultLayout>
  )
}

export const getServerSideProps = withSession(async (context, user) => {
  const id = context.query.id as string
  return {
    props: {
      id,
      user
    }
  }
})
