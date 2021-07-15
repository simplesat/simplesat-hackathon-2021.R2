import { Story } from '@storybook/react'

import SendEmailInput, { SendEmailInputProps } from '.'

export default {
  title: 'Components/SendEmailInput',
  component: SendEmailInput,
  argTypes: {
    onChange: {
      action: 'changed',
    },
  },
}

type TemplateType = Story<SendEmailInputProps>
const Template: TemplateType = (args) => (
  <SendEmailInput {...args} />
)

export const Default = Template.bind({})
// Default.args = {}
