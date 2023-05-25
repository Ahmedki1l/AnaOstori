import { Form as AntdForm } from 'antd'
import styled from 'styled-components'

export const FormItem = styled(AntdForm.Item)`
  margin-bottom: ${props => props.marginbottom ? props.marginbottom : '20px'} !important;
`