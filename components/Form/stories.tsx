import { Story } from '@storybook/react'

import Form from 'components/Form/index'

export default {
  title: 'Components/Form',
  component: Form,
  args: {
    disabled: false,
  },
  argTypes: {
    type: {
      options: ['basic', 'primary'],
    },
    onClick: {
      action: 'clicked',
    },
    onChangeInput: {
      action: 'clicked',
    },
  },
}

type TemplateType = Story<import('react').ComponentPropsWithoutRef<typeof Form>&{onChangeInput: () => void}>
const Template: TemplateType = ({ onChangeInput, ...args }) => (
  <Form {...args}>
    <Form.Input placeholder="required" required onChange={onChangeInput} />
    <Form.Input placeholder="email" type="email" onChange={onChangeInput} />
  </Form>
)

export const Default = Template.bind({})
Default.args = {}

export const Disabled = Template.bind({})
Disabled.args = {}
