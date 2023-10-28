import React from 'react'
import useQueryParams from './useQueryParams'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParam: QueryConfig = useQueryParams()
  // omitBy loại bỏ những thành phần undefine
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParam.page || '1',
      limit: queryParam.limit || '20',
      sort_by: queryParam.sort_by,
      order: queryParam.order,
      exclude: queryParam.exclude,
      rating_filter: queryParam.rating_filter,
      price_max: queryParam.price_max,
      price_min: queryParam.price_min,
      name: queryParam.name,
      category: queryParam.category
    },
    isUndefined
  )
  return queryConfig
}
