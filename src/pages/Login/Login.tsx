import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Helmet } from 'react-helmet'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const navigate = useNavigate()
  const { setIsAuthentication, setProfile } = useContext(AppContext)
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginApi(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthentication(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formData = error.response?.data.data
          if (formData) {
            Object.keys(formData).forEach((key) => {
              setError(key as keyof FormData, {
                message: formData[key as keyof FormData],
                type: 'server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      {/* <Helmet>
        <title>login | Shopee ClLone</title>
        <meta name='description' content='Này là login' />

        <meta property='og:url' content='https://shopee-clone-lyart-seven.vercel.app/login' />
        <meta property='og:type' content='article' />
        <meta property='og:title' content='title login' />
        <meta property='og:description' content='Đây description là login' />
        <meta property='og:image' content='https://shopee-clone-lyart-seven.vercel.app/images/SHAZAM.jpg' />
      </Helmet> */}
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                type='email'
                className='mt-8'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                type='password'
                className='mt-2'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />

              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center rounded bg-red-500 px-2 py-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản ?</span>
                <Link to={path.register} className='ml-1 text-orange'>
                  Đăng Ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
