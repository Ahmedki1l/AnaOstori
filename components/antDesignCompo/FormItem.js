import { Form as AntdForm } from 'antd'
import styled from 'styled-components'

export const Form = styled(AntdForm)`
  direction:rtl;
`

export const FormItem = styled(AntdForm.Item)`
  margin-bottom: ${props => props.marginbottom ? props.marginbottom : '20'}px  !important;
  margin-left: ${props => props.marginleft ? props.marginleft : '12'}px !important;
`
