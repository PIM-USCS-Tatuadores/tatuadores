import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import VMasker from 'vanilla-masker'
import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Input from '@/components/input'
import ImageInput from '@/components/image-input'
import ErrorMessage from '@/components/error-message'

export interface ArtFormState {
  title: string,
  price: string,
  size: string,
  image: File | undefined,
  description: string
}

interface ArtFormProps {
  id?: string,
  title?: string,
  imageUrl?: string,
  description?: string,
  price?: string,
  size?: string,
  loading?: boolean,
  validationSchema: z.ZodTypeAny,
  onSubmit: (state: any) => void
}

function maskMoney(value: string) {
  return VMasker.toMoney(value, {
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: 'R$'
  })
}

function maskSize(value: string) {
  return VMasker.toNumber(value)
}

export default function ArtForm(props: ArtFormProps) {
  const isEditForm = !!props.id
  const { onSubmit: onSubmitHandler, loading = false } = props
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ArtFormState>({
    resolver: zodResolver(props.validationSchema),
    defaultValues: {
      title: props.title,
      price: maskMoney(props.price || ''),
      size: maskSize(props.size || ''),
      description: props.description
    }
  })

  function submit(data: ArtFormState) {
    const { title, image, price, size, description } = data

    onSubmitHandler({
      title,
      image,
      description,
      price,
      size
    })
  }

  return (
    <Flexbox
      tagName="form"
      direction={{ xs: 'column' }}
      gap={{ xs: 'medium' }}
      onSubmit={handleSubmit(submit)}
    >
      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'small' }}
        style={{ textAlign: 'center' }}
      >
        <ImageInput>
          <input
            id="image"
            type='file'
            {...register('image')}
          />
        </ImageInput>

        <ErrorMessage message={errors.image?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Título">
          <input
            type="text"
            id="title"
            placeholder='Ex: Pássaro tribal'
            {...register('title')}
          />
        </Input>

        <ErrorMessage message={errors.title?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Preço">
          <input
            type="text"
            id="price"
            placeholder='Ex: R$ 120,00'
            {...register('price', {
              onChange: (event) => {
                const { value } = event.target
                event.target.value = maskMoney(value)
              }
            })}
          />
        </Input>

        <ErrorMessage message={errors.price?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Tamanho sugerido (em centímetros)">
          <input
            type="text"
            id="size"
            placeholder='Ex: 12'
            {...register('size', {
              onChange: (event) => {
                const { value } = event.target
                event.target.value = maskSize(value)
              }
            })}
          />
        </Input>

        <ErrorMessage message={errors.size?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Descrição">
          <textarea
            id="description"
            placeholder='Descrição informativa da arte'
            {...register('description')}
          ></textarea>
        </Input>

        <ErrorMessage message={errors.description?.message} />
      </Flexbox>

      <Button
        type='secondary'
        loading={loading}
      >
        <button type="submit">
          {isEditForm ? 'Editar arte' : 'Criar arte'}
        </button>
      </Button>
    </Flexbox>
  )
}
