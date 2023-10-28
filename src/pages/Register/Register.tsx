import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
// thư viện lodash không có tree-shaking (import chỉ lấy 1 cái)
// import { omit } from 'lodash'

// import chỉ function omit
import omit from 'lodash/omit'

import { schema, Schema } from 'src/utils/rule'
import Input from 'src/components/Input'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export default function Register() {
  const navigate = useNavigate()
  const { setIsAuthentication, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) }) // generic type

  const registerMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthentication(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formData = error.response?.data.data
          if (formData) {
            Object.keys(formData).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formData[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'server'
              })
            })
          }
          // if (formData?.email) {
          //   setError('email', {
          //     message: formData.email,
          //     type: 'Server'
          //   })
          // }
          // if (formData?.password) {
          //   setError('email', {
          //     message: formData.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })
  // const rules = getRules(getValues)
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Kí</div>
              <Input
                type='email'
                className='mt-8'
                register={register}
                name='email'
                // rules={rules.email}
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                type='password'
                className='mt-2'
                register={register}
                name='password'
                // rules={rules.password}
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />
              <Input
                type='password'
                className='mt-2'
                register={register}
                name='confirm_password'
                // rules={rules.confirm_password}
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center rounded bg-red-500 px-2 py-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerMutation.isLoading}
                  disabled={registerMutation.isLoading}
                >
                  Đăng Ký
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản ?</span>
                <Link to={path.login} className='ml-1 text-orange'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
